// multipartUpload.jsx
// Enterprise-grade multipart uploader for OVH S3 (S3-compatible)
// - Handles 100GB+ safely (S3 10,000 part limit)
// - Backpressure to prevent Safari memory crashes
// - Retries with URL refresh on 403/timeout/expired presign
// - Zero-copy worker transfers supported (see your worker code)
//
// Assumptions about backend endpoints (match your current API):
// POST   {baseUrl}/transfers/multipart/start   -> { uploadId, key, bucket }
// POST   {baseUrl}/transfers/multipart/urls    -> [{ partNumber, url }]
// POST   {baseUrl}/transfers/multipart/complete
// POST   {baseUrl}/transfers/create

import { deriveEncryptionKey } from "./deriveKey";

export const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const URL_BATCH_SIZE = 20; // backend enforced
const S3_MAX_PARTS = 10000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ensure chunk size is large enough so total parts <= 10,000 (S3 limit).
 * For 100GB: min ~ 10.5MB. We’ll pad up safely.
 */
const computeSafeChunkSize = (fileSize, preferredChunkSize) => {
  const minChunk = Math.ceil(fileSize / S3_MAX_PARTS);
  // round up to nearest 1MB for stability
  const MB = 1024 * 1024;
  const roundedMin = Math.ceil(minChunk / MB) * MB;
  return Math.max(preferredChunkSize, roundedMin);
};

const getDynamicConfig = (fileSize) => {
  const GB = 1024 * 1024 * 1024;
  const MB = 1024 * 1024;

  // Preferred baseline
  let chunkSize = 5 * MB;

  // Larger files => fewer parts, better throughput, fewer URLs
  if (fileSize > 50 * GB) chunkSize = 8 * MB;
  if (fileSize > 100 * GB) chunkSize = 12 * MB; // IMPORTANT: >10MB to keep parts <= 10k at 100GB

  // Enforce S3 10k part limit
  chunkSize = computeSafeChunkSize(fileSize, chunkSize);

  // Adaptive concurrency (Safari lower to avoid tab kill)
  let uploadConcurrency = isSafari ? 2 : 6;
  if (fileSize > 50 * GB) uploadConcurrency = isSafari ? 2 : 5;
  if (fileSize > 100 * GB) uploadConcurrency = isSafari ? 2 : 4;

  // Backpressure window (semaphore)
  const maxBufferedChunks = uploadConcurrency + 2;

  return {
    CHUNK_SIZE: chunkSize,
    UPLOAD_CONCURRENCY: uploadConcurrency,
    MAX_BUFFERED_CHUNKS: maxBufferedChunks,
    WORKERS: isSafari ? 2 : 4,
  };
};

export const splitIntoChunks = (blob, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < blob.size; i += chunkSize) {
    chunks.push(blob.slice(i, i + chunkSize));
  }
  return chunks;
};

const isRetryableNetworkError = (err) => {
  if (!err) return false;
  const msg = String(err.message || err);
  return (
    msg.includes("Network error") ||
    msg.includes("timeout") ||
    msg.includes("Failed to fetch") ||
    msg.includes("Server error")
  );
};

const shouldRefreshUrl = (status) => {
  // 403 often means presigned URL expired/signature mismatch
  // 408/499/504 are timeouts; refreshing URL is often safe too
  return status === 403 || status === 408 || status === 499 || status === 504;
};

const xhrPut = ({
  url,
  body,
  abortSignal,
  timeoutMs,
  onProgress,
  responseHeaders = ["ETag"],
}) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const onAbort = () => {
      try {
        xhr.abort();
      } catch {}
      reject(new DOMException("Upload aborted", "AbortError"));
    };

    abortSignal?.addEventListener("abort", onAbort, { once: true });

    xhr.open("PUT", url, true);

    // Avoid infinite hanging connections (esp. large PUTs)
    xhr.timeout = timeoutMs;

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      onProgress?.(e.loaded, e.total);
    };

    xhr.onload = () => {
      abortSignal?.removeEventListener("abort", onAbort);

      const status = xhr.status;
      if (status >= 200 && status < 300) {
        const headers = {};
        for (const h of responseHeaders) {
          headers[h] = xhr.getResponseHeader(h);
        }
        resolve({ status, headers });
        return;
      }

      // Attach status to error for smarter retry decision
      const err = new Error(`Upload failed ${status}`);
      err.status = status;
      reject(err);
    };

    xhr.ontimeout = () => {
      abortSignal?.removeEventListener("abort", onAbort);
      const err = new Error("timeout");
      err.status = 408;
      reject(err);
    };

    xhr.onerror = () => {
      abortSignal?.removeEventListener("abort", onAbort);
      const err = new Error("Network error");
      err.status = 0;
      reject(err);
    };

    // Send ArrayBuffer to avoid potential view-copy issues
    const payload = body instanceof Uint8Array ? body.buffer : body;
    xhr.send(payload);
  });

export const handleMultipartSubmit = async ({
  files,
  baseUrl,
  expiryDays,
  recipientEmail,
  message,
  dossierNumber,
  e2eeEnabled,
  setIsUploading,
  setProgress,
  setUploadSpeed,
  setUploadKey,
  resetForm,
  onTransferCreated,
  setShowSuccess,
  setSuccessData,
  onOpenChange,
  toast,
  speedRef,
  WorkerPool,
  abortSignal,
  onMultipartInit,
}) => {
  if (!files || !files[0]) return;

  const throwIfAborted = () => {
    if (abortSignal?.aborted) throw new DOMException("Upload aborted", "AbortError");
  };

  // Progress state (local per upload)
  const chunkProgress = {};
  const partLoaded = {};

  const updateProgressPct = (chunksLen) => {
    const total =
      Object.values(chunkProgress).reduce((s, v) => s + v, 0) / Math.max(1, chunksLen);
    setProgress(Math.min(100, Math.round(total)));
  };

  try {
    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("");
    speedRef.current = { lastTime: Date.now(), lastLoaded: 0 };

    const file = files[0];

    const { CHUNK_SIZE, UPLOAD_CONCURRENCY, MAX_BUFFERED_CHUNKS, WORKERS } =
      getDynamicConfig(file.size);

    // ---- E2EE init
    const encryptionPass = e2eeEnabled ? crypto.randomUUID() : null;
    let derivedKey = null;
    if (e2eeEnabled) derivedKey = await deriveEncryptionKey(encryptionPass);

    const expiresAt = new Date(
      Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000
    ).toISOString();

    // ---- Start multipart
    const startRes = await fetch(`${baseUrl}/transfers/multipart/start`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: "application/octet-stream",
      }),
      signal: abortSignal,
    });

    const startData = await startRes.json();
    if (!startRes.ok) throw new Error(startData.message || "multipart start failed");

    const { uploadId, key, bucket } = startData;
    setUploadKey(key);
    onMultipartInit?.({ uploadId, key });

    const chunks = splitIntoChunks(file, CHUNK_SIZE);

    // Safety check: should never exceed S3 10k parts
    if (chunks.length > S3_MAX_PARTS) {
      throw new Error(
        `Too many parts (${chunks.length}). Increase chunk size. (S3 max ${S3_MAX_PARTS})`
      );
    }

    const pool = e2eeEnabled ? new WorkerPool(WORKERS) : null;
    if (e2eeEnabled && pool) {
      await pool.broadcast({ type: "INIT", key: derivedKey });
    }

    const uploadedParts = [];

    // ---- URL cache
    const urlCache = new Map(); // partNumber -> url

    const fetchUrlBatch = async (startPart) => {
      throwIfAborted();

      const batch = [];
      for (let p = startPart; p <= chunks.length && batch.length < URL_BATCH_SIZE; p++) {
        if (!urlCache.has(p)) batch.push(p);
      }
      if (!batch.length) return;

      const res = await fetch(`${baseUrl}/transfers/multipart/urls`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, key, parts: batch }),
        signal: abortSignal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch URL batch");

      for (const { partNumber, url } of data) {
        urlCache.set(partNumber, url);
      }
    };

    const getUrlForPart = async (partNum, forceRefresh = false) => {
      throwIfAborted();

      if (forceRefresh) {
        urlCache.delete(partNum);
      }
      if (!urlCache.has(partNum)) {
        await fetchUrlBatch(partNum);
      }
      const url = urlCache.get(partNum);
      // IMPORTANT: remove after use to avoid stale URLs sitting around
      urlCache.delete(partNum);
      return url;
    };

    // ---- Pipeline buffers + semaphores
    const buffer = []; // queue of { partNumber, encrypted: Uint8Array }
    let nextChunkToEncrypt = 0;
    let nextChunkToUpload = 0;

    // Explicit upload semaphore (client requirement)
    let activeUploads = 0;

    // Producer: read/encrypt -> push into buffer with strict backpressure
    const producer = async () => {
      const inflightEncrypt = new Set();

      const launchEncrypt = (partIndex) => {
        const task = (async () => {
          throwIfAborted();

          // Backpressure: if too many uploads pending, slow producer
          while (activeUploads >= MAX_BUFFERED_CHUNKS || buffer.length >= MAX_BUFFERED_CHUNKS) {
            throwIfAborted();
            await sleep(50);
          }

          let ab = await chunks[partIndex].arrayBuffer();

          if (!e2eeEnabled) {
            // No encryption: still obey buffer backpressure
            while (buffer.length >= MAX_BUFFERED_CHUNKS) {
              throwIfAborted();
              await sleep(50);
            }
            buffer.push({ partNumber: partIndex, encrypted: new Uint8Array(ab) });
            // aggressive cleanup
            ab = null;
            return;
          }

          const encrypted = await pool.run({
            type: "ENCRYPT",
            chunk: ab, // Worker should treat as ArrayBuffer
            id: partIndex + 1,
          });

          // Ensure Uint8Array wrapper
          const encryptedU8 =
            encrypted instanceof Uint8Array ? encrypted : new Uint8Array(encrypted);

          // Backpressure again before push (covers network slowdowns)
          while (buffer.length >= MAX_BUFFERED_CHUNKS) {
            throwIfAborted();
            await sleep(50);
          }

          buffer.push({ partNumber: partIndex, encrypted: encryptedU8 });

          // aggressive cleanup
          ab = null;
        })();

        inflightEncrypt.add(task);
        task.finally(() => inflightEncrypt.delete(task));
      };

      while (nextChunkToEncrypt < chunks.length || inflightEncrypt.size) {
        throwIfAborted();

        while (
          nextChunkToEncrypt < chunks.length &&
          inflightEncrypt.size < MAX_BUFFERED_CHUNKS
        ) {
          launchEncrypt(nextChunkToEncrypt++);
        }

        if (inflightEncrypt.size) await Promise.race(inflightEncrypt);
      }
    };

    // Upload one part with retries + URL refresh on expiry/403/timeouts
    const uploadPartWithRetry = async ({ partNum, encryptedU8 }) => {
      const maxRetries = 5;
      const baseDelayMs = 2000;

      // OVH/S3 can be slow on huge PUTs; keep generous timeout per part
      // For 12MB chunk on slow links, 10–20 minutes is possible
      const PER_PART_TIMEOUT_MS = isSafari ? 20 * 60 * 1000 : 15 * 60 * 1000;

      let lastErr = null;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        throwIfAborted();

        let url = await getUrlForPart(partNum, attempt > 1); // refresh after first failure

        try {
          const res = await xhrPut({
            url,
            body: encryptedU8,
            abortSignal,
            timeoutMs: PER_PART_TIMEOUT_MS,
            onProgress: (loaded, total) => {
              partLoaded[partNum] = loaded;
              chunkProgress[partNum] = Math.round((loaded / total) * 100);

              updateProgressPct(chunks.length);

              const now = Date.now();
              const dt = (now - speedRef.current.lastTime) / 1000;
              if (dt > 0.5) {
                const bytesNow = Object.values(partLoaded).reduce((a, b) => a + b, 0);
                const bytesDiff = bytesNow - speedRef.current.lastLoaded;
                const mbps = bytesDiff / (1024 * 1024) / dt;

                setUploadSpeed(`${mbps.toFixed(2)} MB/s`);
                speedRef.current.lastTime = now;
                speedRef.current.lastLoaded = bytesNow;
              }
            },
          });

          // Success: capture ETag
          const etagRaw = res.headers?.ETag;
          const etag = etagRaw ? String(etagRaw).replace(/"/g, "") : undefined;
          if (!etag) {
            // Some S3-compatible vendors still return ETag; if not, backend may still accept.
            // Keep it but prefer having it.
          }

          uploadedParts.push({
            PartNumber: partNum,
            ETag: etag,
          });

          return; // success
        } catch (err) {
          lastErr = err;

          if (err?.name === "AbortError") throw err;

          const status = err?.status ?? 0;

          // If presign expired / signature invalid / timeout: refresh URL next attempt
          const refresh = shouldRefreshUrl(status);
          if (refresh) {
            // force refresh by deleting cached entry
            urlCache.delete(partNum);
          }

          const retryable =
            refresh || isRetryableNetworkError(err) || (status >= 500 && status <= 599);

          if (!retryable || attempt === maxRetries) {
            throw err;
          }

          // Backoff
          await sleep(baseDelayMs * attempt);
        }
      }

      // should not reach here
      throw lastErr || new Error("Upload failed");
    };

    // Consumer worker: pop from buffer -> upload with concurrency limit
    const consumer = async () => {
      while (nextChunkToUpload < chunks.length) {
        throwIfAborted();

        // wait for encrypted/plain chunk availability
        if (!buffer.length) {
          await sleep(10);
          continue;
        }

        // Enforce active upload semaphore
        while (activeUploads >= UPLOAD_CONCURRENCY) {
          throwIfAborted();
          await sleep(25);
        }

        const item = buffer.shift();
        if (!item) continue;

        const partIndex = item.partNumber;
        const partNum = partIndex + 1;

        let encryptedU8 =
          item.encrypted instanceof Uint8Array ? item.encrypted : new Uint8Array(item.encrypted);

        nextChunkToUpload++;

        activeUploads++;
        try {
          await uploadPartWithRetry({ partNum, encryptedU8 });
        } finally {
          activeUploads--;

          // Aggressive cleanup
          try {
            encryptedU8.fill(0);
          } catch {}
          encryptedU8 = null;
          item.encrypted = null;
        }
      }
    };

    // ---- run pipeline
    const producerPromise = producer();
    const consumers = Array.from({ length: UPLOAD_CONCURRENCY }, () => consumer());

    await Promise.all([producerPromise, ...consumers]);
    pool?.terminate();

    // ---- complete multipart
  /* ---------------- COMPLETE MULTIPART ---------------- */

const completeRes = await fetch(`${baseUrl}/transfers/multipart/complete`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    uploadId,
    key,
  }),
  signal: abortSignal,
});


/* ---------------- HANDLE RESPONSE ---------------- */

const completeData = await completeRes.json().catch(() => ({}));

if (!completeRes.ok) {
  throw new Error(
    completeData?.message || "Multipart complete failed"
  );
}


    // ---- metadata save
    const metaRes = await fetch(`${baseUrl}/transfers/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail,
        message,
        dossierNumber,
        securityLevel: "professional",
        expiresAt,
        file: {
          name: file.name,
          size: file.size,
          type: "application/octet-stream",
        },
        key,
        bucket,
        totalSizeBytes: file.size,
        encryption: e2eeEnabled ? "aes-gcm" : "none",
        encryptionPassword: e2eeEnabled ? encryptionPass : null,
      }),
      signal: abortSignal,
    });

    const metaData = await metaRes.json().catch(() => ({}));
    if (!metaRes.ok) throw new Error(metaData?.message || "Metadata save failed");

    toast.success("Secure transfer created successfully");

setSuccessData({
  recipientEmail,
  fileCount: files.length,
  totalSize: file.size,
  expiresAt: expiresAt,
  downloadLink: `${window.location.origin}/download/sample-secure-link`,
  dossierNumber,
  securityLevel: "professional",
});

setShowSuccess(true);
    resetForm();
    // onTransferCreated();
    // onOpenChange(false);
  } catch (err) {
    if (err?.name === "AbortError") {
      toast.error("Upload cancelled by user");
      return;
    }
    toast.error(err?.message || "Upload failed");
  } finally {
    setIsUploading(false);
  }
};

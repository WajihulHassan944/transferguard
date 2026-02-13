// multipartUpload.jsx

/* -------------------- CONFIG -------------------- */

export const WORKERS = 4;
export const CHUNK_SIZE = 25 * 1024 * 1024;      // ⭐ BEST for S3
export const UPLOAD_CONCURRENCY = 4;           // ⭐ parallelism
export const URL_BATCH_SIZE = 20;               // keep backend rule



export const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);



  export const SAFE_UPLOAD_CONCURRENCY = isSafari ? 2 : UPLOAD_CONCURRENCY;
export const BUFFER_SIZE = isSafari ? 4 : 5;

/* -------------------- HELPERS -------------------- */


const chunkProgress = {};
const partLoaded = {};
let totalUploadedBytes = 0;

const updateOverallProgress = () => {
  const uploaded = Object.values(partLoaded).reduce((a, b) => a + b, 0);
  const pct = Math.round((uploaded / file.size) * 100);
  setProgress(Math.min(100, pct));
};



export const splitIntoChunks = (blob) => {
  const chunks = [];
  for (let i = 0; i < blob.size; i += CHUNK_SIZE) {
    chunks.push(blob.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

/* -------------------- MAIN UPLOAD -------------------- */


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
  onOpenChange,
  toast,
  speedRef,
  WorkerPool,
   abortSignal,
  onMultipartInit,
}) => {
  if (!files || !files[0]) return;
const throwIfAborted = () => {
  if (abortSignal?.aborted) {
    throw new DOMException("Upload aborted", "AbortError");
  }
};

  try {
    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("");
    speedRef.current = { lastTime: Date.now(), lastLoaded: 0 };

    const file = files[0];
  const encryptionPass = e2eeEnabled ? crypto.randomUUID() : null;


    const expiresAt = new Date(
      Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000
    ).toISOString();

    /* ---------------- START MULTIPART ---------------- */

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
    if (!startRes.ok) throw new Error(startData.message);

    const { uploadId, key, bucket } = startData;
    setUploadKey(key);
onMultipartInit?.({ uploadId, key });
    const chunks = splitIntoChunks(file);
    const pool = e2eeEnabled ? new WorkerPool(WORKERS) : null;
    const uploadedParts = [];

    /* ---------------- URL CACHE ---------------- */

    const urlCache = new Map();

    const fetchUrlBatch = async (startPart) => {
      const batch = [];

      for (
        let p = startPart;
        p <= chunks.length && batch.length < URL_BATCH_SIZE;
        p++
      ) {
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
      for (const { partNumber, url } of data) {
        urlCache.set(partNumber, url);
      }
    };

    /* ---------------- BUFFER + PROGRESS ---------------- */

    const buffer = [];
    let nextChunkToEncrypt = 0;
    let nextChunkToUpload = 0;

  
    const updateOverallProgress = () => {
      const total =
        Object.values(chunkProgress).reduce((s, v) => s + v, 0) /
        chunks.length;
      setProgress(Math.round(total));
    };


/* ---------------- PRODUCER ---------------- */
const producer = async () => {
  const inflight = new Set();

  // dynamically reduce buffer size for huge files
  const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024 * 1024; // 5GB
  const dynamicBufferSize = file.size > LARGE_FILE_THRESHOLD ? 2 : BUFFER_SIZE;

  const launch = (partNumber) => {
    const task = (async () => {
      throwIfAborted();

      const ab = await chunks[partNumber].arrayBuffer();
      console.log("Chunk", partNumber, "size:", ab.byteLength, "bytes");

  if (!e2eeEnabled) {
  // Backpressure control
  while (buffer.length >= BUFFER_SIZE) {
    await new Promise(r => setTimeout(r, 20));
  }

  buffer.push({ partNumber, encrypted: new Uint8Array(ab) });
  return;
}

 const encrypted = await pool.run({
  chunk: ab.slice(0),
  pass: encryptionPass,
  id: partNumber + 1,
});
buffer.push({
  partNumber,
  encrypted: new Uint8Array(encrypted) // always wrap
});

      const finalEncrypted = encrypted instanceof Uint8Array ? encrypted : new Uint8Array(encrypted);
      console.log("Chunk", partNumber, "encrypted size:", finalEncrypted.byteLength);

    })();

    inflight.add(task);
    task.finally(() => inflight.delete(task));
  };

  while (nextChunkToEncrypt < chunks.length || inflight.size) {
    throwIfAborted();

    while (nextChunkToEncrypt < chunks.length && inflight.size < dynamicBufferSize) {
      launch(nextChunkToEncrypt++);
    }

    if (inflight.size) await Promise.race(inflight);
  }
};

/* ---------------- CONSUMER ---------------- */
const consumer = async () => {
  while (nextChunkToUpload < chunks.length) {
    throwIfAborted();

    if (!buffer.length) {
      await new Promise((r) => setTimeout(r, 10));
      continue;
    }

    const item = buffer.shift();
    const partNumber = item.partNumber;
    const encrypted =
      item.encrypted instanceof Uint8Array
        ? item.encrypted
        : new Uint8Array(item.encrypted);

    nextChunkToUpload++;
    const partNum = partNumber + 1;

    if (!urlCache.has(partNum)) {
      await fetchUrlBatch(partNum);
    }

    const url = urlCache.get(partNum);
    urlCache.delete(partNum);

    /* ---------------- RETRY LOGIC ---------------- */

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          const onAbort = () => {
            xhr.abort();
            reject(new DOMException("Upload aborted", "AbortError"));
          };

          abortSignal?.addEventListener("abort", onAbort, { once: true });

          xhr.open("PUT", url, true);

          xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) return;

            partLoaded[partNum] = e.loaded;
            chunkProgress[partNum] = Math.round(
              (e.loaded / e.total) * 100
            );

            setProgress(
              Math.round(
                Object.values(chunkProgress).reduce((a, b) => a + b, 0) /
                  chunks.length
              )
            );

            const now = Date.now();
            const dt = (now - speedRef.current.lastTime) / 1000;

            if (dt > 0.5) {
              const bytesDiff =
                Object.values(partLoaded).reduce((a, b) => a + b, 0) -
                speedRef.current.lastLoaded;

              const mbps = bytesDiff / (1024 * 1024) / dt;

              setUploadSpeed(`${mbps.toFixed(2)} MB/s`);

              speedRef.current.lastTime = now;
              speedRef.current.lastLoaded += bytesDiff;
            }
          };

          xhr.onload = () => {
            abortSignal?.removeEventListener("abort", onAbort);

            if (xhr.status >= 200 && xhr.status < 300) {
              const etag = xhr
                .getResponseHeader("ETag")
                ?.replace(/"/g, "");

              uploadedParts.push({
                PartNumber: partNum,
                ETag: etag,
              });

              resolve();
            } else if (xhr.status >= 500) {
              reject(new Error(`Server error ${xhr.status}`));
            } else {
              reject(new Error(`Upload failed ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            abortSignal?.removeEventListener("abort", onAbort);
            reject(new Error("Network error"));
          };

          xhr.send(encrypted);
        });

        // SUCCESS → free memory
        encrypted.fill(0);
        item.encrypted = null;

        break; // exit retry loop

      } catch (err) {
        if (err.name === "AbortError") throw err;

        const retryable =
          err.message.includes("Server error") ||
          err.message.includes("Network error");

        if (!retryable || attempt === maxRetries) {
          throw err;
        }

        // exponential backoff
        await new Promise((r) =>
          setTimeout(r, 2000 * attempt)
        );
      }
    }
  }
};

    /* ---------------- RUN PIPELINE ---------------- */

    const producerPromise = producer();
    const consumers = Array.from(
      { length: SAFE_UPLOAD_CONCURRENCY },
      () => consumer()
    );

    await Promise.all([producerPromise, ...consumers]);
    pool?.terminate();

    /* ---------------- COMPLETE ---------------- */

    await fetch(`${baseUrl}/transfers/multipart/complete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        key,
        parts: uploadedParts.sort(
          (a, b) => a.PartNumber - b.PartNumber
        ),
      }),
      signal: abortSignal,
    });

    /* ---------------- METADATA ---------------- */

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

    if (!metaRes.ok) throw new Error("Metadata save failed");

    toast.success("Secure transfer created successfully");

    resetForm();
    onTransferCreated();
    onOpenChange(false);
  } catch (err) {
    if (err.name === "AbortError") {
    toast.error("Upload cancelled by user");
    return; // ❌ no toast
  }
    toast.error(err.message || "Upload failed");
  } finally {
    setIsUploading(false);
  }
};

// multipartUpload.jsx

/* -------------------- CONFIG -------------------- */

export const CHUNK_SIZE = 16 * 1024 * 1024; // 16MB
export const WORKERS = 5;
export const BUFFER_SIZE = 10;              // ~2 per worker
export const UPLOAD_CONCURRENCY = 5;
export const URL_BATCH_SIZE = 50;           // fewer round-trips

export const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const SAFE_UPLOAD_CONCURRENCY = isSafari
  ? 4
  : UPLOAD_CONCURRENCY;

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
}) => {
  if (!files || !files[0]) return;

  try {
    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("");
    speedRef.current = { lastTime: Date.now(), lastLoaded: 0 };

    const file = files[0];
    const encryptionPass = crypto.randomUUID();

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
    });

    const startData = await startRes.json();
    if (!startRes.ok) throw new Error(startData.message);

    const { uploadId, key, bucket } = startData;
    setUploadKey(key);

    const chunks = splitIntoChunks(file);
    const pool = new WorkerPool(WORKERS);
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

    const chunkProgress = {};

    const updateOverallProgress = () => {
      const total =
        Object.values(chunkProgress).reduce((s, v) => s + v, 0) /
        chunks.length;
      setProgress(Math.round(total));
    };

    /* ---------------- PRODUCER ---------------- */

   const producer = async () => {
  const inflight = new Set();

  const launch = async (partNumber) => {
    const ab = await chunks[partNumber].arrayBuffer();
    const p = pool
      .run({ chunk: ab, pass: encryptionPass, id: partNumber + 1 })
      .then((encrypted) => {
        buffer.push({ partNumber, encrypted });
      })
      .finally(() => inflight.delete(p));

    inflight.add(p);
  };

  while (nextChunkToEncrypt < chunks.length || inflight.size) {
    while (
      nextChunkToEncrypt < chunks.length &&
      inflight.size < BUFFER_SIZE
    ) {
      const partNumber = nextChunkToEncrypt++;
      await launch(partNumber);
    }

    if (inflight.size) {
      await Promise.race(inflight);
    }
  }
};


    /* ---------------- CONSUMER ---------------- */

    const consumer = async () => {
      while (nextChunkToUpload < chunks.length) {
        if (!buffer.length) {
          await new Promise((r) => setTimeout(r, 10));
          continue;
        }

        const item = buffer.shift();
        const { partNumber, encrypted } = item;
        nextChunkToUpload++;

        const partNum = partNumber + 1;

        if (!urlCache.has(partNum)) {
          await fetchUrlBatch(partNum);
        }

        const url = urlCache.get(partNum);
        urlCache.delete(partNum);

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.open("PUT", url, true);
          xhr.setRequestHeader(
            "Content-Type",
            "application/octet-stream"
          );

        
xhr.upload.onprogress = (e) => {
  if (!e.lengthComputable) return;

  partLoaded[partNum] = e.loaded;
  chunkProgress[partNum] = Math.round((e.loaded / e.total) * 100);

  updateOverallProgress();

  const now = Date.now();
  const dt = (now - speedRef.current.lastTime) / 1000;

  if (dt > 0.5) {
    const bytesDiff =
      Object.values(partLoaded).reduce((a, b) => a + b, 0) -
      speedRef.current.lastLoaded;

    const mbps = (bytesDiff * 8) / (1024 * 1024) / dt;

    setUploadSpeed(`${mbps.toFixed(2)} Mbps`);

    speedRef.current.lastTime = now;
    speedRef.current.lastLoaded += bytesDiff;
  }
};



          xhr.onload = () => {
            partLoaded[partNum] = encrypted.length;
chunkProgress[partNum] = 100;
updateOverallProgress();

            if (xhr.status >= 200 && xhr.status < 300) {
              const etag = xhr
                .getResponseHeader("ETag")
                ?.replace(/"/g, "");

              uploadedParts.push({
                PartNumber: partNum,
                ETag: etag,
              });

              encrypted.fill(0);
              resolve();
            } else {
              reject(new Error("Chunk upload failed"));
            }
          };

          xhr.onerror = reject;

          xhr.send(new Blob([encrypted]));
        });
      }
    };

    /* ---------------- RUN PIPELINE ---------------- */

    const producerPromise = producer();
    const consumers = Array.from(
      { length: SAFE_UPLOAD_CONCURRENCY },
      () => consumer()
    );

    await Promise.all([producerPromise, ...consumers]);
    pool.terminate();

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
        encryption: "pgp",
        encryptionPassword: encryptionPass,
      }),
    });

    if (!metaRes.ok) throw new Error("Metadata save failed");

    toast.success("Secure transfer created successfully");

    resetForm();
    onTransferCreated();
    onOpenChange(false);
  } catch (err) {
    toast.error(err.message || "Upload failed");
  } finally {
    setIsUploading(false);
  }
};

/// <reference lib="webworker" />
export {};

let aesKey: CryptoKey | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type } = e.data;

  try {
    // INIT (runs once)
    if (type === "INIT") {
      const { key } = e.data;

      aesKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );

      (self as DedicatedWorkerGlobalScope).postMessage({
        type: "READY",
      });

      return;
    }

    // ENCRYPT
    if (type === "ENCRYPT") {
      if (!aesKey) throw new Error("Worker not initialized");

      const { chunk, id } = e.data;

      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        chunk
      );

      const final = new Uint8Array(iv.length + encrypted.byteLength);
      final.set(iv, 0);
      final.set(new Uint8Array(encrypted), iv.length);

      (self as DedicatedWorkerGlobalScope).postMessage(
        { id, encrypted: final.buffer },
        [final.buffer]
      );
    }
  } catch (err: any) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      error: err.message,
    });
  }
};

/// <reference lib="webworker" />
export {};

let aesKey: CryptoKey | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type } = e.data;

  try {
    if (type === "INIT") {
      const { key } = e.data; // ArrayBuffer (256-bit)

      aesKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      (self as DedicatedWorkerGlobalScope).postMessage({ type: "READY" });
      return;
    }

    if (type === "DECRYPT") {
      if (!aesKey) throw new Error("Worker not initialized");

      const { chunk, id } = e.data; // chunk: ArrayBuffer

      const bytes = new Uint8Array(chunk);

      // layout: [12B IV][ciphertext+tag]
      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const plain = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        ciphertext
      );

      (self as DedicatedWorkerGlobalScope).postMessage(
        { id, plain },
        [plain]
      );
      return;
    }
  } catch (err: any) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      error: err?.message || "Worker error",
    });
  }
};

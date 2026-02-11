/// <reference lib="webworker" />

export {};

const getKey = async (pass: string) => {
  const enc = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(pass),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("transferguard-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt"]
  );
};

self.onmessage = async (e: MessageEvent) => {
  const { chunk, pass, id } = e.data;

  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await getKey(pass);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      chunk
    );

    // prepend IV (needed for decrypt)
    const final = new Uint8Array(iv.length + encrypted.byteLength);
    final.set(iv, 0);
    final.set(new Uint8Array(encrypted), iv.length);

    (self as DedicatedWorkerGlobalScope).postMessage(
      { id, encrypted: final },
      [final.buffer]
    );
  } catch (err: any) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      id,
      error: err.message,
    });
  }
};

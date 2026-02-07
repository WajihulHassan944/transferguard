/// <reference lib="webworker" />

import * as openpgp from "openpgp";

export {};

self.onmessage = async (e: MessageEvent) => {
  const { chunk, pass, id } = e.data as {
    chunk: ArrayBuffer;
    pass: string;
    id: number;
  };

  try {
    const message = await openpgp.createMessage({
      binary: new Uint8Array(chunk),
    });

    // ✅ OpenPGP v5+ correct usage
   const encrypted = await openpgp.encrypt({
  message,
  passwords: [pass],
  format: "binary",   // ⭐⭐⭐ REQUIRED
});


    const result = encrypted as Uint8Array;

    (self as DedicatedWorkerGlobalScope).postMessage(
      { id, encrypted: result },
      [result.buffer]
    );
  } catch (err: any) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      id,
      error: err.message,
    });
  }
};

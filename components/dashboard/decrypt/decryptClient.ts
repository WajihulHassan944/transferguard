// decryptClient.ts
export async function createDecryptWorker(rawKey: ArrayBuffer) {
  const worker = new Worker(new URL("./decrypt.worker.ts", import.meta.url), {
    type: "module",
  });

  await new Promise<void>((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "READY") {
        worker.removeEventListener("message", onMessage);
        resolve();
      } else if (e.data?.error) {
        worker.removeEventListener("message", onMessage);
        reject(new Error(e.data.error));
      }
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage({ type: "INIT", key: rawKey }); // no transfer needed
  });

  const decrypt = (chunk: ArrayBuffer, id: number) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      const onMessage = (e: MessageEvent) => {
        if (e.data?.error) {
          worker.removeEventListener("message", onMessage);
          reject(new Error(e.data.error));
          return;
        }
        if (e.data?.id === id && e.data?.plain) {
          worker.removeEventListener("message", onMessage);
          resolve(e.data.plain as ArrayBuffer);
        }
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage({ type: "DECRYPT", chunk, id }, [chunk]); // transfer buffer
    });

  return {
    decrypt,
    terminate: () => worker.terminate(),
  };
}



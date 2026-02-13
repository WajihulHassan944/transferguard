type Job = {
  data: any;
  resolve: (val: Uint8Array) => void;
};

export class WorkerPool {
  workers: Worker[] = [];
  queue: Job[] = [];
  busy = new Map<Worker, Job>();

  constructor(size: number) {
    console.log("🧵 WorkerPool started:", size);

    for (let i = 0; i < size; i++) {
      const worker = new Worker(
        new URL("./encrypt.worker.ts", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (e) => {
        const job = this.busy.get(worker);
        if (!job) return;

        this.busy.delete(worker);

        if (e.data.error) {
          console.error("Worker error:", e.data.error);
        } else {
          job.resolve(new Uint8Array(e.data.encrypted));
        }

        this.next();
      };

      this.workers.push(worker);
    }
  }

  /* 🔹 NEW: initialize all workers */
async broadcast(message: any) {
  await Promise.all(
    this.workers.map(
      (worker) =>
        new Promise<void>((resolve) => {
          const handleReady = (e: MessageEvent) => {
            if (e.data?.type === "READY") {
              worker.removeEventListener("message", handleReady);
              resolve();
            }
          };

          worker.addEventListener("message", handleReady);
          worker.postMessage({ ...message }); // no transfer
        })
    )
  );
}


  run(data: any) {
    return new Promise<Uint8Array>((resolve) => {
      this.queue.push({ data, resolve });
      this.next();
    });
  }

  private next() {
    const idle = this.workers.find((w) => !this.busy.has(w));
    if (!idle || !this.queue.length) return;

    const job = this.queue.shift()!;
    this.busy.set(idle, job);

    if (job.data.type === "ENCRYPT") {
      const { chunk, id } = job.data;

      const transferable =
        chunk instanceof ArrayBuffer ? chunk : chunk.buffer;

      idle.postMessage(
        { type: "ENCRYPT", chunk, id },
        [transferable]
      );
    }
  }

  terminate() {
    console.log("🧵 WorkerPool terminated");
    this.workers.forEach((w) => w.terminate());
  }
}

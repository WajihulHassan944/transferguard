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
          job.resolve(e.data.encrypted);
        }

        this.next();
      };

      this.workers.push(worker);
    }
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

    idle.postMessage(job.data, [job.data.chunk]);
  }

  terminate() {
    console.log("🧵 WorkerPool terminated");
    this.workers.forEach((w) => w.terminate());
  }
}

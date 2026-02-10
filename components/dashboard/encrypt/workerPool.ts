type Job = {
  data: any;
  resolve: (val: Uint8Array) => void;
};

export class WorkerPool {
  workers: Worker[] = [];
  queue: Job[] = [];

  // ✅ must be Map, not Set
  busy = new Map<Worker, Job>();

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(
        new URL("./encrypt.worker.ts", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (e: MessageEvent) => {
        const job = this.busy.get(worker);
        if (!job) return;

        this.busy.delete(worker);

        if (e.data.error) {
          console.error(e.data.error);
        } else {
         job.resolve(
  e.data.encrypted instanceof Uint8Array
    ? e.data.encrypted
    : new Uint8Array(e.data.encrypted)
);

        }

        this.next();
      };

      this.workers.push(worker);
    }
  }

  run(data: any): Promise<Uint8Array> {
    return new Promise((resolve) => {
      this.queue.push({ data, resolve });
      this.next();
    });
  }

  private next() {
    const idle = this.workers.find((w) => !this.busy.has(w));
    if (!idle || this.queue.length === 0) return;

    const job = this.queue.shift()!;
    this.busy.set(idle, job);

  idle.postMessage(job.data, [job.data.chunk]);

  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
  }
}

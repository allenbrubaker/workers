import { str as hash } from 'crc-32';

export type WorkerTasks = Record<string, string[]>;

const hash360 = (id: string) => {
  let mod = hash(id) % 360;
  if (mod < 0) mod += 360;
  return mod;
};

export const buildHashRing = (workerIds: string[], taskIds: string[]): WorkerTasks => {
  const ring: (string | null)[] = new Array(360).fill(null);
  const weight = Number(process.env.SERVICE_WEIGHT ?? 20);
  for (let i = 0; i < weight; ++i) for (const worker of workerIds) ring[hash360(`${worker}_${i}`)] = worker; // add 'weight' number of entries to ring for each pod for equal distribution and assignment of items to pods.
  const assignments = {} as WorkerTasks;

  // Assign each task to its closest clockwise worker.
  for (const item of taskIds) {
    let index = hash360(item);
    while (ring[index] === null) index = (index + 1) % ring.length;
    const worker = ring[index]!;
    if (!assignments[worker]) assignments[worker] = [];
    assignments[worker].push(item);
  }
  return assignments;
};

export const printHashRing = (ring: WorkerTasks) =>
  console.log(
    Object.keys(ring)
      .sort()
      .map(key => `${key}: ${ring[key].length}`)
  );

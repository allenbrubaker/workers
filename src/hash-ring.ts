import CRC32 from 'crc-32';

export type WorkerTasks = Record<string, string[]>;

const hash360 = (id: string) => {
  let mod = CRC32.str(id) % 360;
  if (mod < 0) mod += 360;
  return mod;
};

export const buildHashRing = (workerIds: string[], taskIds: string[]): WorkerTasks => {
  const ring: (string | null)[] = new Array(360).fill(null);
  const weight = Number(process.env.SERVICE_WEIGHT ?? 10);
  for (const worker of workerIds) for (let i = 0; i < weight; ++i) ring[hash360(`pod_${i}`)] = worker; // add 'weight' number of entries to ring for each pod for equal distribution and assignment of items to pods.
  const assignments = {} as WorkerTasks;
  for (const item of taskIds) {
    let index = hash360(item);
    while (ring[index] === null) index = (index + 1) % ring.length;
    const worker = ring[index]!;
    if (!assignments[worker]) assignments[worker] = [];
    assignments[worker].push(item);
  }
  return assignments;
};

import { Task } from '@prisma/client';
import { getAllTasks, getTaskCount, saveTasks } from './db';
import { buildHashRing } from './hash-ring';
import { getMyPod, getPods as getPodsSorted } from './kube-client';

type Counts = {
  workers: string[];
  tasks: number;
};

export const startWorker = async () => {
  const pod = getMyPod();
  let counts: Counts | undefined;
  let myTasks = [] as Task[];
  while (true) {
    const start = Date.now();

    if (myTasks.length) {
      console.log(`Watching: ${myTasks.map(t => t.ID)}`);
      myTasks = increment(myTasks, pod);
      await saveTasks(myTasks);
    }

    const newCounts = await getCounts();
    if (isModified(newCounts, counts)) {
      counts = newCounts;
      myTasks = await rebalance(counts.workers, pod);
    }

    await delay(Math.max(0, 1000 - (Date.now() - start)));
  }
};

const rebalance = async (workers: string[], pod: string) => {
  const tasks = await getAllTasks();
  let taskMap = {} as Record<string, Task>;
  tasks.forEach(t => (taskMap[t.ID] = t));
  const assignments = buildHashRing(
    workers,
    tasks.map(x => x.ID)
  );
  return assignments[pod].sort().map(tid => taskMap[tid]);
};

const increment = (tasks: Task[], pod: string) =>
  tasks.map(x => ({ ID: x.ID, CurrentWorker: pod, Value: x.Value + 1 }));

const getCounts = async (): Promise<Counts> => {
  const [workers, tasks] = await Promise.all([getPodsSorted(), getTaskCount()]);
  return { workers, tasks };
};

const isModified = (c1?: Counts, c2?: Counts) => JSON.stringify(c1) !== JSON.stringify(c2);

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

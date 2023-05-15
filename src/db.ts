import { PrismaClient, Task, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getTaskCount = async (): Promise<number> => prisma.task.count();
export const getAllTasks = async (): Promise<Task[]> => prisma.task.findMany();
export const saveTasks = async (tasks: Task[]): Promise<void> => {
//   console.log('saving-tasks', { tasks: tasks.length });
  for (const task of tasks) await prisma.task.update({ select: { ID: true }, where: { ID: task.ID }, data: task }); // Invoking this in parallel uses up postpgres thread pool too quickly and reduces maximum number of possible workers.
//   console.log('saved-tasks', { tasks: tasks.length });
};

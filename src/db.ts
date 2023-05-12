import { PrismaClient, Task, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getTaskCount = async (): Promise<number> => prisma.task.count();
export const getAllTasks = async (): Promise<Task[]> => prisma.task.findMany();
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await Promise.all(tasks.map(task => prisma.task.update({ select: {}, where: { ID: task.ID }, data: task })));
};

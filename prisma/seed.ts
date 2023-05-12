import { PrismaClient, Task, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const count = Number(process.env.SEED_TASKS ?? 10);
  await prisma.task.createMany({
    data: Array(count)
      .fill(0)
      .map<Task>(_ => ({ ID: randomUUID(), Value: 0, CurrentWorker: null }))
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

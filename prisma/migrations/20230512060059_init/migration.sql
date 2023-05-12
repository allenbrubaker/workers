-- CreateTable
CREATE TABLE "Task" (
    "ID" TEXT NOT NULL,
    "Value" INTEGER NOT NULL DEFAULT 0,
    "CurrentWorker" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("ID")
);

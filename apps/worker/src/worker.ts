import { workerEnv } from "@forgeai/config/worker";
import { logger } from "@forgeai/logger";
import { WORKFLOW_QUEUE_NAME, redisConnectionOptions } from "@forgeai/workflow";
import { Worker } from "bullmq";

const worker = new Worker(
  WORKFLOW_QUEUE_NAME,
  (job) => {
    logger.info({ jobId: job.id, jobName: job.name }, "Processing workflow job");
    return Promise.resolve({ processedAt: new Date().toISOString() });
  },
  {
    connection: redisConnectionOptions(workerEnv.REDIS_URL)
  }
);

worker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Workflow job completed");
});

worker.on("failed", (job, error) => {
  logger.error({ err: error, jobId: job?.id }, "Workflow job failed");
});

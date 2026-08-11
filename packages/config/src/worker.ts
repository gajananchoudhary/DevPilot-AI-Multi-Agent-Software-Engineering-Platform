import "./load-env.js";

import { z } from "zod";

export const workerEnvSchema = z.object({
  QUEUE_PREFIX: z.string().default("forgeai"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5)
});

export const workerEnv = workerEnvSchema.parse(process.env);

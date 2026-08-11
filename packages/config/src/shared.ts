import "./load-env.js";

import { z } from "zod";

export const sharedEnvSchema = z.object({
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export const sharedEnv = sharedEnvSchema.parse(process.env);

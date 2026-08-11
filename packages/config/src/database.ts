import "./load-env.js";

import { z } from "zod";

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export const databaseEnv = databaseEnvSchema.parse(process.env);

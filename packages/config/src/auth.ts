import "./load-env.js";

import { z } from "zod";

export const authEnvSchema = z.object({
  ADMIN_EMAIL: z.string().email().default("admin@forgeai.local"),
  ADMIN_NAME: z.string().default("ForgeAI Administrator"),
  ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!")
});

export const authEnv = authEnvSchema.parse(process.env);

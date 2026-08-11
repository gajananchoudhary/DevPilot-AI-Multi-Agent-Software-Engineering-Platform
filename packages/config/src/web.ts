import "./load-env.js";

import { z } from "zod";

export const webEnvSchema = z.object({
  API_URL: z.string().url().default("http://localhost:4000"),
  VITE_API_URL: z.string().url().default("http://localhost:4000"),
  VITE_APP_NAME: z.string().default("ForgeAI"),
  WEB_PORT: z.coerce.number().int().positive().default(5173),
  WEB_URL: z.string().url().default("http://localhost:5173")
});

export const webEnv = webEnvSchema.parse(process.env);

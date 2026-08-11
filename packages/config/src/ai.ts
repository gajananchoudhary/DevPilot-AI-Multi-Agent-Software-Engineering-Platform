import "./load-env.js";

import { z } from "zod";

export const aiEnvSchema = z.object({
  OPENAI_API_KEY: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1, "OPENAI_API_KEY must not be empty").optional()
  ),
  OPENAI_EMBEDDING_MODEL: z.string().min(1).default("text-embedding-3-small"),
  OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini")
});

export const aiEnv = aiEnvSchema.parse(process.env);

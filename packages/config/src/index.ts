import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  WEB_PORT: z.coerce.number().int().positive().default(5173),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default("http://localhost:4000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .default("postgresql://forgeai:forgeai@localhost:5432/forgeai?schema=public"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(24).default("development-access-secret-change-me"),
  JWT_REFRESH_SECRET: z.string().min(24).default("development-refresh-secret-change-me"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  OPENAI_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
export type ForgeEnv = z.infer<typeof envSchema>;

import { z } from "zod";

import {
  DEFAULT_ACCESS_TOKEN_TTL,
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
  DEFAULT_REFRESH_TOKEN_TTL,
  DEFAULT_REQUEST_BODY_LIMIT
} from "./constants.js";

export const envSchema = z.object({
  APP_NAME: z.string().default("ForgeAI"),
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_VERSION: z.string().default("0.1.0"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  WEB_PORT: z.coerce.number().int().positive().default(5173),
  WEB_URL: z.string().url().default("http://localhost:5173"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default("http://localhost:4000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  REQUEST_BODY_LIMIT: z.string().default(DEFAULT_REQUEST_BODY_LIMIT),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(DEFAULT_RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(DEFAULT_RATE_LIMIT_MAX),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(24, "JWT_ACCESS_SECRET must be at least 24 characters"),
  JWT_REFRESH_SECRET: z.string().min(24, "JWT_REFRESH_SECRET must be at least 24 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default(DEFAULT_ACCESS_TOKEN_TTL),
  JWT_REFRESH_EXPIRES_IN: z.string().default(DEFAULT_REFRESH_TOKEN_TTL),
  JWT_ISSUER: z.string().default("forgeai"),
  JWT_AUDIENCE: z.string().default("forgeai-web"),
  ADMIN_EMAIL: z.string().email().default("admin@forgeai.local"),
  ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!"),
  ADMIN_NAME: z.string().default("ForgeAI Administrator"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  QUEUE_PREFIX: z.string().default("forgeai"),
  OPENAI_API_KEY: z.string().optional()
});

export type ForgeEnv = z.infer<typeof envSchema>;

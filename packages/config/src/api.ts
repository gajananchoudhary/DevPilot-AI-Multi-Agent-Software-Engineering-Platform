import "./load-env.js";

import { z } from "zod";

import {
  DEFAULT_ACCESS_TOKEN_TTL,
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
  DEFAULT_REFRESH_TOKEN_TTL,
  DEFAULT_REQUEST_BODY_LIMIT
} from "./constants.js";

export const apiEnvSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default("http://localhost:4000"),
  APP_VERSION: z.string().default("0.1.0"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default(DEFAULT_ACCESS_TOKEN_TTL),
  JWT_ACCESS_SECRET: z.string().min(24, "JWT_ACCESS_SECRET must be at least 24 characters"),
  JWT_AUDIENCE: z.string().default("forgeai-web"),
  JWT_ISSUER: z.string().default("forgeai"),
  JWT_REFRESH_EXPIRES_IN: z.string().default(DEFAULT_REFRESH_TOKEN_TTL),
  JWT_REFRESH_SECRET: z.string().min(24, "JWT_REFRESH_SECRET must be at least 24 characters"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(DEFAULT_RATE_LIMIT_MAX),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(DEFAULT_RATE_LIMIT_WINDOW_MS),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  REQUEST_BODY_LIMIT: z.string().default(DEFAULT_REQUEST_BODY_LIMIT)
});

export const apiEnv = apiEnvSchema.parse(process.env);

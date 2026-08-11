import { apiEnv } from "@forgeai/config/api";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export function registerSecurityMiddleware(app: Express) {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(compression());
  app.use(cors({ credentials: true, origin: apiEnv.CORS_ORIGIN }));
  app.use(cookieParser());
  app.use(express.json({ limit: apiEnv.REQUEST_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: apiEnv.REQUEST_BODY_LIMIT }));
  app.use(
    rateLimit({
      legacyHeaders: false,
      limit: apiEnv.RATE_LIMIT_MAX,
      standardHeaders: true,
      windowMs: apiEnv.RATE_LIMIT_WINDOW_MS
    })
  );
}

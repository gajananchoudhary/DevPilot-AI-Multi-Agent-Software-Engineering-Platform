import { logger } from "@forgeai/logger";
import type { RequestHandler } from "express";

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info(
      {
        durationMs: Date.now() - startedAt,
        method: req.method,
        requestId: req.id,
        statusCode: res.statusCode,
        url: req.originalUrl
      },
      "HTTP request completed"
    );
  });

  next();
};

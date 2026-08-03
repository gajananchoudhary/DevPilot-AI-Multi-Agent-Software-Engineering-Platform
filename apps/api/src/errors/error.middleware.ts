import { logger } from "@forgeai/logger";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { sendError } from "../utils/api-response.js";

import { ValidationError } from "./app-errors.js";
import { BaseError } from "./base-error.js";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const normalizedError =
    error instanceof ZodError
      ? new ValidationError(
          "Validation failed",
          error.issues.map((issue) => ({
            code: issue.code,
            message: issue.message,
            path: issue.path
          }))
        )
      : error instanceof BaseError
        ? error
        : new BaseError("Internal server error", 500, "INTERNAL_SERVER_ERROR");

  if (normalizedError.statusCode >= 500) {
    logger.error({ err: error, requestId: req.id }, normalizedError.message);
  } else {
    logger.warn({ err: error, requestId: req.id }, normalizedError.message);
  }

  sendError(res, normalizedError.statusCode, normalizedError.message, normalizedError.details, {
    requestId: req.id
  });
};

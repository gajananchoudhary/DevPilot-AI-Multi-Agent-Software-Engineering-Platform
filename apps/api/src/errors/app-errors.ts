import type { ApiErrorDetail } from "@forgeai/types";

import { BaseError } from "./base-error.js";

export class ValidationError extends BaseError {
  constructor(message = "Validation failed", details: ApiErrorDetail[] = []) {
    super(
      message,
      400,
      "VALIDATION_ERROR",
      details.length ? details : [{ code: "VALIDATION_ERROR", message }]
    );
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class ConflictError extends BaseError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

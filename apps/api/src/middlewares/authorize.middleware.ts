import type { RequestHandler } from "express";

import { AuthorizationError } from "../errors/index.js";

export const authorize: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new AuthorizationError("Authenticated user is required"));
    return;
  }

  next();
};

export function requirePermission(permission: string): RequestHandler {
  return (req, _res, next) => {
    const permissions = req.user?.permissions ?? [];

    if (permissions.includes("admin:*") || permissions.includes(permission)) {
      next();
      return;
    }

    next(new AuthorizationError(`Missing required permission: ${permission}`));
  };
}

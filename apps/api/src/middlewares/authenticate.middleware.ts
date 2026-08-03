import { verifyAccessToken } from "@forgeai/auth";
import type { RequestHandler } from "express";

import { AuthenticationError } from "../errors/index.js";
import { AuthService } from "../modules/auth/auth.service.js";

const authService = new AuthService();

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

    if (!token) {
      throw new AuthenticationError();
    }

    const payload = verifyAccessToken(token);
    req.user = await authService.validateSession(payload.sub, payload.sessionId);
    next();
  } catch (error) {
    next(
      error instanceof AuthenticationError ? error : new AuthenticationError("Invalid access token")
    );
  }
};

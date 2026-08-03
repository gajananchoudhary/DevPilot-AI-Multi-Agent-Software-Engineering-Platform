import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/index.js";
import { getValidatedBody } from "../../validators/index.js";

import type { LoginBody, LogoutBody, RefreshBody, RegisterBody } from "./auth.schemas.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

function requestContext(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip,
    userAgent: req.header("user-agent")
  };
}

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(
      getValidatedBody<RegisterBody>(req),
      requestContext(req)
    );
    sendSuccess(res, 201, "Registration successful", result);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(getValidatedBody<LoginBody>(req), requestContext(req));
    sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const body = getValidatedBody<RefreshBody>(req);
    const result = await authService.refresh(body.refreshToken, requestContext(req));
    sendSuccess(res, 200, "Token refreshed", result);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const body = getValidatedBody<LogoutBody>(req);
    await authService.logout(
      req.user!.id,
      req.user!.sessionId,
      body.refreshToken,
      requestContext(req)
    );
    sendSuccess(res, 200, "Logout successful", {});
  } catch (error) {
    next(error);
  }
};

export const logoutAll: RequestHandler = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user!.id, requestContext(req));
    sendSuccess(res, 200, "Logged out from all devices", {});
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.currentUser(req.user!.id, req.user!.sessionId);
    sendSuccess(res, 200, "Current user retrieved", result);
  } catch (error) {
    next(error);
  }
};

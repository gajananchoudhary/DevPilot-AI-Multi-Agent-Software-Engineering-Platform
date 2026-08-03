import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/index.js";

import { PermissionsService } from "./permissions.service.js";

const permissionsService = new PermissionsService();

export const listPermissions: RequestHandler = async (_req, res, next) => {
  try {
    sendSuccess(res, 200, "Permissions retrieved", await permissionsService.listPermissions());
  } catch (error) {
    next(error);
  }
};

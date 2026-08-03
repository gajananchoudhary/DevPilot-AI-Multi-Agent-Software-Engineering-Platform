import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/index.js";

import { RolesService } from "./roles.service.js";

const rolesService = new RolesService();

export const listRoles: RequestHandler = async (_req, res, next) => {
  try {
    sendSuccess(res, 200, "Roles retrieved", await rolesService.listRoles());
  } catch (error) {
    next(error);
  }
};

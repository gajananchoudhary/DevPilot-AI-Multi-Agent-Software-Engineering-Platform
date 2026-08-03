import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/index.js";
import { getValidatedParams } from "../../validators/index.js";

import type { UserIdParams } from "./users.schemas.js";
import { UsersService } from "./users.service.js";

const usersService = new UsersService();

export const listUsers: RequestHandler = async (_req, res, next) => {
  try {
    sendSuccess(res, 200, "Users retrieved", await usersService.listUsers());
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const params = getValidatedParams<UserIdParams>(req);
    sendSuccess(res, 200, "User retrieved", await usersService.getUser(params.id));
  } catch (error) {
    next(error);
  }
};

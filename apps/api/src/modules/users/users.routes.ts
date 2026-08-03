import { Router } from "express";

import { authenticate, requirePermission } from "../../middlewares/index.js";
import { validateRequest } from "../../validators/index.js";

import { getUser, listUsers } from "./users.controller.js";
import { userIdParamsSchema } from "./users.schemas.js";

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.get("/", requirePermission("user:view"), listUsers);
usersRouter.get(
  "/:id",
  requirePermission("user:view"),
  validateRequest({ params: userIdParamsSchema }),
  getUser
);

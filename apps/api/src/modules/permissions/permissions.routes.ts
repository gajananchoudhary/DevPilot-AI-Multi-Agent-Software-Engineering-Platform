import { Router } from "express";

import { authenticate, requirePermission } from "../../middlewares/index.js";

import { listPermissions } from "./permissions.controller.js";

export const permissionsRouter = Router();

permissionsRouter.use(authenticate);
permissionsRouter.get("/", requirePermission("admin:*"), listPermissions);

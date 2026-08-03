import { Router } from "express";

import { authenticate, requirePermission } from "../../middlewares/index.js";

import { listRoles } from "./roles.controller.js";

export const rolesRouter = Router();

rolesRouter.use(authenticate);
rolesRouter.get("/", requirePermission("admin:*"), listRoles);

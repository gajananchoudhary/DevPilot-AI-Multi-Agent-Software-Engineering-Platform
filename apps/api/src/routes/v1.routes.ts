import { Router } from "express";

import { authRouter } from "../modules/auth/index.js";
import { healthRouter } from "../modules/health/index.js";
import { permissionsRouter } from "../modules/permissions/index.js";
import { rolesRouter } from "../modules/roles/index.js";
import { usersRouter } from "../modules/users/index.js";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/health", healthRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/roles", rolesRouter);
v1Router.use("/permissions", permissionsRouter);

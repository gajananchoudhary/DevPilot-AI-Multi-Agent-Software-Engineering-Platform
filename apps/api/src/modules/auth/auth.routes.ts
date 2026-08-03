import { Router } from "express";

import { authenticate } from "../../middlewares/index.js";
import { validateRequest } from "../../validators/index.js";

import { login, logout, logoutAll, me, refresh, register } from "./auth.controller.js";
import {
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema
} from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validateRequest({ body: registerBodySchema }), register);
authRouter.post("/login", validateRequest({ body: loginBodySchema }), login);
authRouter.post("/refresh", validateRequest({ body: refreshBodySchema }), refresh);
authRouter.post("/logout", authenticate, validateRequest({ body: logoutBodySchema }), logout);
authRouter.post("/logout-all", authenticate, logoutAll);
authRouter.get("/me", authenticate, me);

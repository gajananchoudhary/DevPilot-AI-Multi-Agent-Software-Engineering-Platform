import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/index.js";

import { HealthService } from "./health.service.js";

const healthService = new HealthService();

export const getHealth: RequestHandler = async (_req, res, next) => {
  try {
    sendSuccess(res, 200, "Health check successful", await healthService.getHealth());
  } catch (error) {
    next(error);
  }
};

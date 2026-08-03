import express from "express";

import { registerOpenApi } from "./OpenAPI/index.js";
import { errorMiddleware } from "./errors/index.js";
import {
  notFoundMiddleware,
  registerSecurityMiddleware,
  requestIdMiddleware,
  requestLoggerMiddleware
} from "./middlewares/index.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  registerSecurityMiddleware(app);
  registerOpenApi(app);
  app.use(apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

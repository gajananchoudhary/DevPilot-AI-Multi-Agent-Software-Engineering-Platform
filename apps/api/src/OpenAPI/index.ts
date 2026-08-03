import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { apiConfig } from "../config/index.js";

import { openApiDocument } from "./openapi.document.js";

export function registerOpenApi(app: Express) {
  app.get("/api/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });
  app.use(apiConfig.docsPath, swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

import { apiEnv } from "@forgeai/config/api";
import { DEFAULT_API_VERSION } from "@forgeai/config/constants";

export const apiConfig = {
  apiVersion: DEFAULT_API_VERSION,
  docsPath: "/api/docs",
  port: apiEnv.API_PORT
} as const;

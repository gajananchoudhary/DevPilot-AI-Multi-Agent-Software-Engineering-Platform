import { DEFAULT_API_VERSION, env } from "@forgeai/config";

export const apiConfig = {
  apiVersion: DEFAULT_API_VERSION,
  docsPath: "/api/docs",
  port: env.API_PORT
} as const;

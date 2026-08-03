import { env } from "@forgeai/config";
import pino from "pino";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "forgeai"
  }
});

export type Logger = typeof logger;

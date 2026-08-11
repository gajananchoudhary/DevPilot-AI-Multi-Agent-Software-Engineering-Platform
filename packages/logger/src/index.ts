import { sharedEnv } from "@forgeai/config/shared";
import pino, { type LoggerOptions } from "pino";

export function createLogger(options: LoggerOptions = {}) {
  return pino({
    level: sharedEnv.LOG_LEVEL,
    base: {
      service: "forgeai"
    },
    transport:
      sharedEnv.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              singleLine: true,
              translateTime: "SYS:standard"
            }
          }
        : undefined,
    ...options
  });
}

export const logger = createLogger();

export type Logger = ReturnType<typeof createLogger>;

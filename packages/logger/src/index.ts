import { env } from "@forgeai/config";
import pino, { type LoggerOptions } from "pino";

export function createLogger(options: LoggerOptions = {}) {
  return pino({
    level: env.LOG_LEVEL,
    base: {
      service: "forgeai"
    },
    transport:
      env.NODE_ENV === "development"
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

import http from "node:http";

import { apiEnv } from "@forgeai/config/api";
import { prisma } from "@forgeai/database";
import { logger } from "@forgeai/logger";

import { createApp } from "./app.js";

const app = createApp();
const server = http.createServer(app);

server.listen(apiEnv.API_PORT, () => {
  logger.info({ port: apiEnv.API_PORT }, "ForgeAI API listening");
});

function shutdown(signal: NodeJS.Signals) {
  logger.info({ signal }, "Shutting down ForgeAI API");

  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "Error while closing HTTP server");
      process.exit(1);
    }

    void prisma.$disconnect().then(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

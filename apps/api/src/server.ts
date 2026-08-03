import http from "node:http";

import { env } from "@forgeai/config";
import { logger } from "@forgeai/logger";
import { Server } from "socket.io";

import { createApp } from "./app.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.CORS_ORIGIN }
});

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "Realtime client connected");
});

server.listen(env.API_PORT, () => {
  logger.info({ port: env.API_PORT }, "ForgeAI API listening");
});

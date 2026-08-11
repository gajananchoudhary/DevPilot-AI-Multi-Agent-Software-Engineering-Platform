import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { Socket } from "node:net";

import { databaseEnv } from "@forgeai/config/database";

const assertDatabaseReachable = async (databaseUrl: string): Promise<void> => {
  const url = new URL(databaseUrl);
  const port = Number(url.port || 5432);

  await new Promise<void>((resolve, reject) => {
    const socket = new Socket();

    socket.setTimeout(2000);

    socket.once("connect", () => {
      socket.destroy();
      resolve();
    });

    socket.once("error", reject);

    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error(`Timed out connecting to ${url.hostname}:${port}`));
    });

    socket.connect(port, url.hostname);
  }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown connection error";

    console.error(`Unable to reach Postgres at ${url.hostname}:${port}.`);
    console.error("Start the local database with: docker compose up -d postgres");
    console.error(`Connection check failed: ${message}`);
    process.exit(1);
  });
};

await assertDatabaseReachable(databaseEnv.DATABASE_URL);

const require = createRequire(import.meta.url);
const prismaCliPath = require.resolve("prisma/build/index.js");
const child = spawn(process.execPath, [prismaCliPath, "studio", ...process.argv.slice(2)], {
  env: {
    ...process.env,
    DATABASE_URL: databaseEnv.DATABASE_URL
  },
  stdio: "inherit"
});

child.on("error", (error: Error) => {
  throw error;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});

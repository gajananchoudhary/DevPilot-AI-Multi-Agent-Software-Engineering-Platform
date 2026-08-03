import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadDotenv } from "dotenv";

import { envSchema } from "./schema.js";

function findWorkspaceEnv(startDirectory: string) {
  let currentDirectory = startDirectory;

  while (true) {
    const candidate = join(currentDirectory, ".env");

    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory || currentDirectory === parse(currentDirectory).root) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
}

const packageDirectory = dirname(fileURLToPath(import.meta.url));
const envPath = findWorkspaceEnv(process.cwd()) ?? findWorkspaceEnv(packageDirectory);

if (envPath) {
  loadDotenv({ path: envPath });
}

export const env = envSchema.parse(process.env);

import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadDotenv } from "dotenv";

const loadEnvMarker = Symbol.for("forgeai.config.load-env");

function findWorkspaceEnv(startDirectory: string) {
  let currentDirectory = startDirectory;

  while (true) {
    const candidate = join(currentDirectory, ".env");

    if (existsSync(candidate)) return candidate;

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory || currentDirectory === parse(currentDirectory).root) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
}

if (!Reflect.get(globalThis, loadEnvMarker)) {
  const packageDirectory = dirname(fileURLToPath(import.meta.url));
  const envPath = findWorkspaceEnv(process.cwd()) ?? findWorkspaceEnv(packageDirectory);

  if (envPath) loadDotenv({ path: envPath });

  Reflect.set(globalThis, loadEnvMarker, true);
}

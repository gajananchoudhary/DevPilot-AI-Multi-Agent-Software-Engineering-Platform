import { databaseEnv } from "@forgeai/config/database";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  return new PrismaClient({
    log: databaseEnv.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (databaseEnv.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

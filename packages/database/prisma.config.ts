import { databaseEnv } from "@forgeai/config/database";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: databaseEnv.DATABASE_URL
  }
});

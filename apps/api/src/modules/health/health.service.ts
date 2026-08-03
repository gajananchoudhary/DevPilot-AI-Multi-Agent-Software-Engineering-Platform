import { prisma } from "@forgeai/database";

export class HealthService {
  async getHealth() {
    await prisma.$queryRaw`SELECT 1`;

    return {
      database: "connected",
      service: "api",
      status: "ok"
    };
  }
}

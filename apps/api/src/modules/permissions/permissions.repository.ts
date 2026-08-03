import { prisma } from "@forgeai/database";

export class PermissionsRepository {
  listPermissions() {
    return prisma.permission.findMany({
      orderBy: { key: "asc" },
      where: { deletedAt: null }
    });
  }
}

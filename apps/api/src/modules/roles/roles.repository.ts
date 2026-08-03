import { prisma } from "@forgeai/database";

export class RolesRepository {
  listRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { name: "asc" },
      where: { deletedAt: null }
    });
  }
}

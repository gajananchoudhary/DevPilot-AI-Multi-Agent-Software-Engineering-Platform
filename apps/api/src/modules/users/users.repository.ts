import { prisma } from "@forgeai/database";

export class UsersRepository {
  listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null }
    });
  }

  findUserById(id: string) {
    return prisma.user.findFirst({
      where: {
        deletedAt: null,
        id
      }
    });
  }
}

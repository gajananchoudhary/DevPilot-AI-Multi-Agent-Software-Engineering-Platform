import { hashPassword } from "@forgeai/auth";
import { authEnv } from "@forgeai/config/auth";

import { prisma } from "../src/index.js";

const defaultPermissions = [
  ["user:create", "Create users"],
  ["user:update", "Update users"],
  ["user:delete", "Delete users"],
  ["user:view", "View users"],
  ["project:create", "Create projects"],
  ["project:update", "Update projects"],
  ["project:delete", "Delete projects"],
  ["project:view", "View projects"],
  ["admin:*", "Administrative wildcard permission"]
] as const;

async function main() {
  const permissions = await Promise.all(
    defaultPermissions.map(([key, description]) =>
      prisma.permission.upsert({
        create: { description, key },
        update: { description, deletedAt: null },
        where: { key }
      })
    )
  );

  const administratorRole = await prisma.role.upsert({
    create: {
      description: "Full platform administrator",
      name: "administrator"
    },
    update: {
      description: "Full platform administrator",
      deletedAt: null
    },
    where: { name: "administrator" }
  });

  const memberRole = await prisma.role.upsert({
    create: {
      description: "Default authenticated user role",
      name: "member"
    },
    update: {
      description: "Default authenticated user role",
      deletedAt: null
    },
    where: { name: "member" }
  });

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      create: {
        permissionId: permission.id,
        roleId: administratorRole.id
      },
      update: {},
      where: {
        roleId_permissionId: {
          permissionId: permission.id,
          roleId: administratorRole.id
        }
      }
    });
  }

  const viewPermissions = permissions.filter((permission) => permission.key.endsWith(":view"));

  for (const permission of viewPermissions) {
    await prisma.rolePermission.upsert({
      create: {
        permissionId: permission.id,
        roleId: memberRole.id
      },
      update: {},
      where: {
        roleId_permissionId: {
          permissionId: permission.id,
          roleId: memberRole.id
        }
      }
    });
  }

  const administrator = await prisma.user.upsert({
    create: {
      email: authEnv.ADMIN_EMAIL.toLowerCase(),
      name: authEnv.ADMIN_NAME,
      passwordHash: await hashPassword(authEnv.ADMIN_PASSWORD)
    },
    update: {
      deletedAt: null,
      name: authEnv.ADMIN_NAME,
      status: "ACTIVE"
    },
    where: { email: authEnv.ADMIN_EMAIL.toLowerCase() }
  });

  await prisma.userRole.upsert({
    create: {
      roleId: administratorRole.id,
      userId: administrator.id
    },
    update: {},
    where: {
      userId_roleId: {
        roleId: administratorRole.id,
        userId: administrator.id
      }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    await prisma.$disconnect();
    throw error;
  });

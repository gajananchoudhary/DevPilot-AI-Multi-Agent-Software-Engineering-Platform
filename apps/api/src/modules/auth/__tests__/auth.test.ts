import { hashPassword } from "@forgeai/auth";
import { prisma } from "@forgeai/database";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../../../app.js";

const app = createApp();
const testEmailPrefix = "phase1";

async function ensureRbacSeed() {
  const userView = await prisma.permission.upsert({
    create: {
      description: "View users",
      key: "user:view"
    },
    update: { deletedAt: null },
    where: { key: "user:view" }
  });
  const adminPermission = await prisma.permission.upsert({
    create: {
      description: "Administrative wildcard permission",
      key: "admin:*"
    },
    update: { deletedAt: null },
    where: { key: "admin:*" }
  });
  const memberRole = await prisma.role.upsert({
    create: {
      description: "Default authenticated user role",
      name: "member"
    },
    update: { deletedAt: null },
    where: { name: "member" }
  });
  const administratorRole = await prisma.role.upsert({
    create: {
      description: "Full platform administrator",
      name: "administrator"
    },
    update: { deletedAt: null },
    where: { name: "administrator" }
  });

  await prisma.rolePermission.upsert({
    create: {
      permissionId: userView.id,
      roleId: memberRole.id
    },
    update: {},
    where: {
      roleId_permissionId: {
        permissionId: userView.id,
        roleId: memberRole.id
      }
    }
  });
  await prisma.rolePermission.upsert({
    create: {
      permissionId: adminPermission.id,
      roleId: administratorRole.id
    },
    update: {},
    where: {
      roleId_permissionId: {
        permissionId: adminPermission.id,
        roleId: administratorRole.id
      }
    }
  });

  return { administratorRole };
}

async function cleanupUsers() {
  const users = await prisma.user.findMany({
    select: { id: true },
    where: {
      email: {
        startsWith: testEmailPrefix
      }
    }
  });
  const userIds = users.map((user) => user.id);

  if (!userIds.length) {
    return;
  }

  await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.userSession.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.userRole.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

function registerUser(email: string) {
  return request(app).post("/api/v1/auth/register").send({
    email,
    name: "Phase One",
    password: "ChangeMe123!"
  });
}

beforeAll(async () => {
  await ensureRbacSeed();
});

beforeEach(async () => {
  await cleanupUsers();
});

describe("auth module", () => {
  it("rejects invalid registration payloads before controllers", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "not-an-email", password: "short" })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: expect.any(String)
        })
      ])
    );
  });

  it("registers a user and returns a token pair", async () => {
    const response = await registerUser(`${testEmailPrefix}-register@forgeai.local`).expect(201);

    expect(response.body).toMatchObject({
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          email: `${testEmailPrefix}-register@forgeai.local`
        }
      },
      errors: null,
      message: "Registration successful",
      success: true
    });
  });

  it("logs in a user", async () => {
    const email = `${testEmailPrefix}-login@forgeai.local`;
    await registerUser(email).expect(201);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "ChangeMe123!" })
      .expect(200);

    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
  });

  it("rotates refresh tokens", async () => {
    const email = `${testEmailPrefix}-refresh@forgeai.local`;
    const loginResponse = await registerUser(email).expect(201);
    const refreshToken = loginResponse.body.data.refreshToken as string;

    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).not.toBe(refreshToken);

    await request(app).post("/api/v1/auth/refresh").send({ refreshToken }).expect(401);
  });

  it("returns the current authenticated user", async () => {
    const email = `${testEmailPrefix}-me@forgeai.local`;
    const registerResponse = await registerUser(email).expect(201);

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${registerResponse.body.data.accessToken}`)
      .expect(200);

    expect(response.body.data.user).toMatchObject({
      email,
      permissions: expect.arrayContaining(["user:view"]),
      roles: expect.arrayContaining(["member"])
    });
  });

  it("enforces permission middleware", async () => {
    const email = `${testEmailPrefix}-forbidden@forgeai.local`;
    const registerResponse = await registerUser(email).expect(201);

    await request(app)
      .get("/api/v1/roles")
      .set("Authorization", `Bearer ${registerResponse.body.data.accessToken}`)
      .expect(403);
  });

  it("allows administrators through RBAC middleware", async () => {
    const { administratorRole } = await ensureRbacSeed();
    const email = `${testEmailPrefix}-admin@forgeai.local`;
    const user = await prisma.user.create({
      data: {
        email,
        name: "Phase Admin",
        passwordHash: await hashPassword("ChangeMe123!"),
        roles: {
          create: {
            roleId: administratorRole.id
          }
        }
      }
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: user.email, password: "ChangeMe123!" })
      .expect(200);

    await request(app)
      .get("/api/v1/roles")
      .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`)
      .expect(200);
  });
});

import type { Prisma } from "@forgeai/database";
import { prisma } from "@forgeai/database";

export class AuthRepository {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  findUserById(userId: string) {
    return prisma.user.findFirst({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      },
      where: {
        deletedAt: null,
        id: userId,
        status: "ACTIVE"
      }
    });
  }

  async findOrCreateMemberRole() {
    return prisma.role.upsert({
      create: {
        description: "Default authenticated user role",
        name: "member"
      },
      update: {
        deletedAt: null
      },
      where: { name: "member" }
    });
  }

  createUserWithRole(input: {
    email: string;
    name?: string;
    passwordHash: string;
    roleId: string;
  }) {
    return prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: input.passwordHash,
        roles: {
          create: {
            roleId: input.roleId
          }
        }
      }
    });
  }

  createSession(input: { ipAddress?: string; userAgent?: string; userId: string }) {
    return prisma.userSession.create({
      data: {
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        userId: input.userId
      }
    });
  }

  findSession(sessionId: string, userId: string) {
    return prisma.userSession.findFirst({
      where: {
        deletedAt: null,
        id: sessionId,
        revokedAt: null,
        userId
      }
    });
  }

  updateSessionActivity(sessionId: string) {
    return prisma.userSession.update({
      data: {
        lastActivityAt: new Date()
      },
      where: { id: sessionId }
    });
  }

  createRefreshToken(input: {
    expiresAt: Date;
    sessionId: string;
    tokenHash: string;
    userId: string;
  }) {
    return prisma.refreshToken.create({
      data: input
    });
  }

  findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      include: {
        session: true,
        user: true
      },
      where: { tokenHash }
    });
  }

  rotateRefreshToken(input: {
    currentTokenId: string;
    expiresAt: Date;
    newTokenHash: string;
    sessionId: string;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const nextToken = await tx.refreshToken.create({
        data: {
          expiresAt: input.expiresAt,
          sessionId: input.sessionId,
          tokenHash: input.newTokenHash,
          userId: input.userId
        }
      });

      await tx.refreshToken.update({
        data: {
          replacedBy: nextToken.id,
          revokedAt: new Date()
        },
        where: { id: input.currentTokenId }
      });

      await tx.userSession.update({
        data: {
          lastActivityAt: new Date()
        },
        where: { id: input.sessionId }
      });

      return nextToken;
    });
  }

  revokeRefreshToken(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      data: {
        revokedAt: new Date()
      },
      where: {
        revokedAt: null,
        tokenHash
      }
    });
  }

  revokeSession(sessionId: string, userId: string) {
    return prisma.userSession.updateMany({
      data: {
        revokedAt: new Date()
      },
      where: {
        id: sessionId,
        revokedAt: null,
        userId
      }
    });
  }

  revokeAllSessions(userId: string) {
    return prisma.$transaction([
      prisma.userSession.updateMany({
        data: {
          revokedAt: new Date()
        },
        where: {
          revokedAt: null,
          userId
        }
      }),
      prisma.refreshToken.updateMany({
        data: {
          revokedAt: new Date()
        },
        where: {
          revokedAt: null,
          userId
        }
      })
    ]);
  }

  createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
}

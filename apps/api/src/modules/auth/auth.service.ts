import {
  createOpaqueToken,
  hashPassword,
  hashToken,
  refreshTokenExpiresAt,
  signAccessToken,
  verifyPassword
} from "@forgeai/auth";
import type { AuthenticatedPrincipal, PublicUser } from "@forgeai/types";

import { AuthenticationError, ConflictError } from "../../errors/index.js";

import { AuthRepository } from "./auth.repository.js";
import type { LoginBody, RegisterBody } from "./auth.schemas.js";
import type { AuthResult, CurrentUserResult, RequestContext, TokenPair } from "./auth.types.js";

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async register(input: RegisterBody, context: RequestContext): Promise<AuthResult> {
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser && !existingUser.deletedAt) {
      throw new ConflictError("A user with this email already exists");
    }

    const memberRole = await this.authRepository.findOrCreateMemberRole();
    const passwordHash = await hashPassword(input.password);
    const user = await this.authRepository.createUserWithRole({
      email: input.email,
      name: input.name,
      passwordHash,
      roleId: memberRole.id
    });

    await this.authRepository.createAuditLog({
      action: "USER_REGISTERED",
      actorId: user.id,
      ipAddress: context.ipAddress,
      targetId: user.id,
      targetType: "User",
      userAgent: context.userAgent
    });

    const tokens = await this.issueTokenPair(user.id, context);

    return {
      ...tokens,
      user: this.toPublicUser(user)
    };
  }

  async login(input: LoginBody, context: RequestContext): Promise<AuthResult> {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user || user.deletedAt || user.status !== "ACTIVE") {
      throw new AuthenticationError("Invalid email or password");
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AuthenticationError("Invalid email or password");
    }

    await this.authRepository.createAuditLog({
      action: "USER_LOGIN",
      actorId: user.id,
      ipAddress: context.ipAddress,
      targetId: user.id,
      targetType: "User",
      userAgent: context.userAgent
    });

    const tokens = await this.issueTokenPair(user.id, context);

    return {
      ...tokens,
      user: this.toPublicUser(user)
    };
  }

  async refresh(refreshToken: string, context: RequestContext): Promise<TokenPair> {
    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshToken(tokenHash);

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date() ||
      storedToken.user.deletedAt ||
      storedToken.user.status !== "ACTIVE" ||
      storedToken.session.revokedAt ||
      storedToken.session.deletedAt
    ) {
      throw new AuthenticationError("Invalid refresh token");
    }

    const nextRefreshToken = createOpaqueToken();
    const nextRefreshTokenHash = hashToken(nextRefreshToken);

    await this.authRepository.rotateRefreshToken({
      currentTokenId: storedToken.id,
      expiresAt: refreshTokenExpiresAt(),
      newTokenHash: nextRefreshTokenHash,
      sessionId: storedToken.sessionId,
      userId: storedToken.userId
    });

    await this.authRepository.createAuditLog({
      action: "TOKEN_REFRESHED",
      actorId: storedToken.userId,
      ipAddress: context.ipAddress,
      targetId: storedToken.sessionId,
      targetType: "UserSession",
      userAgent: context.userAgent
    });

    return {
      accessToken: signAccessToken({
        sessionId: storedToken.sessionId,
        sub: storedToken.userId
      }),
      refreshToken: nextRefreshToken
    };
  }

  async logout(
    userId: string,
    sessionId: string,
    refreshToken?: string,
    context: RequestContext = {}
  ) {
    await this.authRepository.revokeSession(sessionId, userId);

    if (refreshToken) {
      await this.authRepository.revokeRefreshToken(hashToken(refreshToken));
    }

    await this.authRepository.createAuditLog({
      action: "USER_LOGOUT",
      actorId: userId,
      ipAddress: context.ipAddress,
      targetId: sessionId,
      targetType: "UserSession",
      userAgent: context.userAgent
    });
  }

  async logoutAll(userId: string, context: RequestContext = {}) {
    await this.authRepository.revokeAllSessions(userId);
    await this.authRepository.createAuditLog({
      action: "USER_LOGOUT_ALL",
      actorId: userId,
      ipAddress: context.ipAddress,
      targetId: userId,
      targetType: "User",
      userAgent: context.userAgent
    });
  }

  async currentUser(userId: string, sessionId: string): Promise<CurrentUserResult> {
    return {
      user: await this.validateSession(userId, sessionId)
    };
  }

  async validateSession(userId: string, sessionId: string): Promise<AuthenticatedPrincipal> {
    const [user, session] = await Promise.all([
      this.authRepository.findUserById(userId),
      this.authRepository.findSession(sessionId, userId)
    ]);

    if (!user || !session) {
      throw new AuthenticationError("Invalid session");
    }

    await this.authRepository.updateSessionActivity(sessionId);

    const roles = user.roles
      .filter((userRole) => !userRole.role.deletedAt)
      .map((userRole) => userRole.role.name);
    const permissions = [
      ...new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions
            .filter((rolePermission) => !rolePermission.permission.deletedAt)
            .map((rolePermission) => rolePermission.permission.key)
        )
      )
    ];

    return {
      email: user.email,
      id: user.id,
      name: user.name,
      permissions,
      roles,
      sessionId
    };
  }

  private async issueTokenPair(userId: string, context: RequestContext): Promise<TokenPair> {
    const session = await this.authRepository.createSession({
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      userId
    });
    const refreshToken = createOpaqueToken();
    const refreshTokenHash = hashToken(refreshToken);

    await this.authRepository.createRefreshToken({
      expiresAt: refreshTokenExpiresAt(),
      sessionId: session.id,
      tokenHash: refreshTokenHash,
      userId
    });

    return {
      accessToken: signAccessToken({
        sessionId: session.id,
        sub: userId
      }),
      refreshToken
    };
  }

  private toPublicUser(user: {
    createdAt: Date;
    email: string;
    id: string;
    name: string | null;
    updatedAt: Date;
  }): PublicUser {
    return {
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      id: user.id,
      name: user.name,
      updatedAt: user.updatedAt.toISOString()
    };
  }
}

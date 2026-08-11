import { createHash, randomBytes } from "node:crypto";

import { apiEnv } from "@forgeai/config/api";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

export type TokenType = "access" | "refresh";

export interface AuthTokenPayload {
  sub: string;
  sessionId: string;
  type: TokenType;
}

export interface VerifiedAuthToken extends AuthTokenPayload {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createOpaqueToken(byteLength = 48) {
  return randomBytes(byteLength).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(payload: Omit<AuthTokenPayload, "type">) {
  return jwt.sign({ ...payload, type: "access" }, apiEnv.JWT_ACCESS_SECRET, {
    audience: apiEnv.JWT_AUDIENCE,
    expiresIn: apiEnv.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: apiEnv.JWT_ISSUER
  });
}

export function signRefreshJwt(payload: Omit<AuthTokenPayload, "type">) {
  return jwt.sign({ ...payload, type: "refresh" }, apiEnv.JWT_REFRESH_SECRET, {
    audience: apiEnv.JWT_AUDIENCE,
    expiresIn: apiEnv.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: apiEnv.JWT_ISSUER
  });
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, apiEnv.JWT_ACCESS_SECRET, {
    audience: apiEnv.JWT_AUDIENCE,
    issuer: apiEnv.JWT_ISSUER
  }) as VerifiedAuthToken;

  if (payload.type !== "access") {
    throw new Error("Invalid access token type");
  }

  return payload;
}

export function verifyRefreshJwt(token: string) {
  const payload = jwt.verify(token, apiEnv.JWT_REFRESH_SECRET, {
    audience: apiEnv.JWT_AUDIENCE,
    issuer: apiEnv.JWT_ISSUER
  }) as VerifiedAuthToken;

  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }

  return payload;
}

export function refreshTokenExpiresAt(now = new Date()) {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt;
}

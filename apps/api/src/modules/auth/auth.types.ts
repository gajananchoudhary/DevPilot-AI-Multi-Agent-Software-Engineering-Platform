import type { AuthenticatedPrincipal, PublicUser } from "@forgeai/types";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  user: PublicUser;
}

export interface CurrentUserResult {
  user: AuthenticatedPrincipal;
}

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

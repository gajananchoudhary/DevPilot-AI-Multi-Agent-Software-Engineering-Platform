export type EntityId = string;

export interface ApiErrorDetail {
  code: string;
  message: string;
  path?: Array<string | number>;
}

export interface ApiResponse<TData = unknown, TMeta = Record<string, unknown>> {
  success: boolean;
  message: string;
  data: TData | null;
  meta: TMeta;
  errors: ApiErrorDetail[] | null;
}

export interface AuthenticatedPrincipal {
  id: EntityId;
  email: string;
  name: string | null;
  sessionId: EntityId;
  roles: string[];
  permissions: string[];
}

export interface PublicUser {
  id: EntityId;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleSummary {
  id: EntityId;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface PermissionSummary {
  id: EntityId;
  key: string;
  description: string | null;
}

export type PermissionKey =
  | "user:create"
  | "user:update"
  | "user:delete"
  | "user:view"
  | "project:create"
  | "project:update"
  | "project:delete"
  | "project:view"
  | "admin:*";

export type AgentKind = "architect" | "engineer" | "reviewer" | "documenter" | "devops";

export interface AgentMessage {
  id: EntityId;
  agentKind: AgentKind;
  content: string;
  createdAt: string;
}

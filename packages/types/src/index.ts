export type EntityId = string;

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceSummary {
  id: EntityId;
  name: string;
  slug: string;
  memberCount: number;
}

export interface ProjectSummary {
  id: EntityId;
  workspaceId: EntityId;
  name: string;
  repositoryUrl?: string;
  createdAt: string;
}

export type AgentKind = "architect" | "engineer" | "reviewer" | "documenter" | "devops";

export interface AgentMessage {
  id: EntityId;
  agentKind: AgentKind;
  content: string;
  createdAt: string;
}

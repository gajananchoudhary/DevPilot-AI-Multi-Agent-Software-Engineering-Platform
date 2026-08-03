import type { AgentKind, AgentMessage } from "@forgeai/types";

export interface AgentRunInput {
  projectId: string;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AgentRunResult {
  messages: AgentMessage[];
  artifacts: AgentArtifact[];
}

export interface AgentArtifact {
  path: string;
  kind: "architecture" | "code" | "documentation" | "review" | "workflow";
  content: string;
}

export interface ForgeAgent {
  kind: AgentKind;
  name: string;
  run(input: AgentRunInput): Promise<AgentRunResult>;
}

export const defaultAgentKinds: AgentKind[] = [
  "architect",
  "engineer",
  "reviewer",
  "documenter",
  "devops"
];

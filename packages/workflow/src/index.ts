import { env } from "@forgeai/config";
import { Queue } from "bullmq";

export const WORKFLOW_QUEUE_NAME = "forgeai.workflow";

export interface EnqueueWorkflowInput {
  projectId: string;
  workflowRunId: string;
  requestedByUserId: string;
}

export function createWorkflowQueue() {
  return new Queue<EnqueueWorkflowInput>(WORKFLOW_QUEUE_NAME, {
    connection: redisConnectionOptions(env.REDIS_URL)
  });
}

export function redisConnectionOptions(redisUrl: string) {
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    db: url.pathname ? Number(url.pathname.slice(1) || 0) : 0
  };
}

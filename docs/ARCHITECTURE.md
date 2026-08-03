# ForgeAI Architecture

ForgeAI is an enterprise SaaS platform for AI-assisted software engineering. The Phase 0 architecture establishes a modular monorepo that can grow into chat, multi-agent collaboration, repository analysis, architecture generation, documentation generation, workflows, project management, and team collaboration.

## System Boundaries

- `apps/web`: React, Vite, Mantine, TanStack Query, Zustand, and React Router client.
- `apps/api`: Express API, Socket.io realtime gateway, JWT authentication boundary, and service orchestration.
- `apps/worker`: BullMQ background processor for long-running workflows and agent jobs.
- `packages/database`: Prisma schema and database client.
- `packages/auth`: password hashing and token utilities.
- `packages/agents`: agent contracts and orchestration primitives for OpenAI-backed agents.
- `packages/workflow`: queue names and workflow enqueue helpers.
- `packages/ui`: shared Mantine-based UI primitives.
- `packages/sdk`: typed client for ForgeAI API consumers.
- `packages/config`: validated environment configuration.
- `packages/logger`: shared structured logger.
- `packages/types` and `packages/utils`: cross-cutting primitives.

## Runtime Architecture

The web app communicates with the API over HTTP and, later, Socket.io for realtime collaboration and agent progress. The API owns request validation, auth enforcement, persistence orchestration, and enqueueing durable jobs. Workers consume BullMQ jobs from Redis and execute long-running workflows, including repository analysis, agent collaboration, and documentation generation.

PostgreSQL is the system of record. Redis is used for queue transport and realtime coordination, not durable business state.

## Scalability Principles

- Keep user-facing requests short and move expensive work to queues.
- Make workflow runs resumable and observable.
- Treat agent outputs as artifacts with traceable project and conversation context.
- Enforce workspace boundaries in every API service and data query.
- Keep packages independently testable and avoid app-specific logic in shared packages.

## Security Baseline

- JWT access tokens are short lived.
- Refresh tokens are stored server-side as hashes.
- Passwords are hashed with bcrypt.
- Environment variables are validated at process start.
- Secrets are excluded from source control and documented in `.env.example`.

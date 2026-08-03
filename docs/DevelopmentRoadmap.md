# Development Roadmap

## Phase 0

Foundation workspace, docs, apps, packages, Docker Compose, and tooling.

## Phase 1

Backend identity foundation: users, roles, permissions, sessions, refresh tokens, audit logs, validation, error handling, logging, security middleware, and OpenAPI.

## Phase 1.1

Configuration and database architecture correction.

The goal is deterministic startup across every executable:

1. Load environment through `@forgeai/config`.
2. Validate environment with Zod.
3. Initialize logger.
4. Initialize Prisma.
5. Initialize auth-dependent modules.
6. Start the executable.

No feature work belongs in Phase 1.1. The only allowed work is configuration lifecycle, Prisma client architecture, seed reliability, documentation, and developer experience scripts.

## Phase 2

Reserved for future product functionality after the backend foundation is stable. Do not implement AI chat, agents, repository analysis, workflow engine, project management, or notifications before Phase 2 is explicitly requested.

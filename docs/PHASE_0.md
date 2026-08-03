# Phase 0 Foundation

Phase 0 creates the production foundation for ForgeAI. It intentionally avoids business feature implementation and focuses on architecture, workspace structure, tooling, and documentation.

## Completed Scope

- Turborepo monorepo initialized with pnpm workspaces.
- Apps created for web, API, and worker runtimes.
- Shared packages created for UI, types, utilities, database, auth, SDK, logger, config, agents, and workflows.
- Prisma schema created for users, workspaces, projects, conversations, messages, workflows, and refresh tokens.
- Docker Compose created for PostgreSQL and Redis.
- CI workflow added for lint, typecheck, tests, and builds.
- ESLint, Prettier, TypeScript, Vitest, and Husky configured.
- Environment contract documented in `.env.example`.

## Out Of Scope

- Production authentication flows.
- Repository ingestion.
- OpenAI agent execution.
- Workflow designer UI.
- Billing, audit logs, and enterprise administration.

## Next Phase

Phase 1 should implement the first vertical slice: authentication, workspace creation, API persistence, and a web shell connected to real API state.

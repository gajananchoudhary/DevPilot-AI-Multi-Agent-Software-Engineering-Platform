# ForgeAI

AI Powered Software Engineering Platform.

ForgeAI is an enterprise-grade SaaS platform that helps software engineers build software using multiple AI agents. It is designed for AI chat, multi-agent collaboration, architecture generation, documentation generation, repository analysis, workflows, project management, and team collaboration.

## Phase 0

This repository currently contains the Phase 0 foundation:

- Turborepo and pnpm monorepo setup
- React/Vite web app scaffold
- Express API scaffold
- BullMQ worker scaffold
- Shared TypeScript packages
- Prisma/PostgreSQL data model
- Redis and PostgreSQL Docker Compose services
- ESLint, Prettier, TypeScript, Vitest, Husky, and GitHub Actions CI
- Architecture and development documentation

## Getting Started

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm --filter @forgeai/database db:generate
pnpm dev
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Phase 0 Scope](docs/PHASE_0.md)

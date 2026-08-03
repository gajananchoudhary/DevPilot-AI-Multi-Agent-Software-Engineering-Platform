# Development Guide

## Prerequisites

- Node.js 20 or newer
- Corepack enabled
- Docker Desktop or compatible Docker runtime

Enable pnpm through Corepack:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

Install dependencies:

```bash
pnpm install
```

Start infrastructure:

```bash
docker compose up -d postgres redis
```

Create a local environment file:

```bash
cp .env.example .env
```

Generate the Prisma client:

```bash
pnpm --filter @forgeai/database db:generate
```

Run the monorepo in development:

```bash
pnpm dev
```

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The pre-commit hook runs linting and type checking.

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
pnpm db:generate
```

Apply migrations:

```bash
pnpm db:migrate
```

Seed default roles, permissions, and administrator:

```bash
pnpm db:seed
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

## Configuration

All executables load configuration through `@forgeai/config`. Do not import `dotenv` in apps, packages, Prisma scripts, tests, or seed files. Import the narrow domain module (for example, `@forgeai/config/database`) and add new variables to that module and `.env.example`. See [environment architecture](architecture/environment.md).

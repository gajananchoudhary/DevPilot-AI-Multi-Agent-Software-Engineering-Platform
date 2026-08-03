# Backend Architecture

ForgeAI uses a modular monolith backend for Phase 1. The API is a single deployable Express application, but the source code is organized by backend feature so each domain can evolve without leaking business rules into unrelated modules.

## Why Modular Monolith

A modular monolith keeps operational complexity low while the product is still establishing core identity, database, and authorization contracts. It avoids premature service boundaries, duplicated authentication logic, and distributed transactions. The internal module boundaries are strict enough that a future service extraction can be driven by real scale or ownership needs rather than guesses.

## Source Layout

`apps/api/src` is organized into platform folders and feature modules:

- `config`: API-specific runtime constants and integration with `@forgeai/config`.
- `controllers`: cross-module controller helpers.
- `services`: cross-module service helpers.
- `repositories`: cross-module repository helpers.
- `routes`: API router composition and version mounting.
- `middlewares`: authentication, authorization, validation, request logging, request IDs, and security concerns.
- `validators`: shared request validation helpers.
- `schemas`: shared response schemas.
- `errors`: typed application errors and global error middleware.
- `utils`: API-local utility functions.
- `logger`: API logger bindings.
- `lib`: external library adapters.
- `modules`: feature-first modules such as `auth`, `users`, `roles`, `permissions`, and `health`.
- `types`: Express request and response types.
- `OpenAPI`: OpenAPI document assembly and Swagger UI registration.

Each module owns its routes, controller, service, repository, schemas, validators, types, and tests. Controllers translate HTTP into service calls only. Services hold business rules. Repositories are the only layer that talks directly to Prisma.

## Request Flow

1. Request ID middleware assigns a correlation ID.
2. Security middleware applies Helmet, CORS, JSON limits, compression, cookies, and rate limiting.
3. API version router mounts `/api/v1`.
4. Validation middleware parses params, query, and body with Zod.
5. Authentication middleware resolves the current user from JWT when required.
6. Authorization middleware checks role permissions when required.
7. Controller calls service.
8. Service calls repositories and shared packages.
9. Response helper returns the standard API envelope.
10. Global error middleware logs and normalizes errors.

## Initialization Flow

Every executable follows the same initialization order:

1. Import `@forgeai/config`.
2. Load the workspace `.env` file exactly once.
3. Validate environment variables with Zod and export typed `env`.
4. Initialize the Pino logger from validated configuration.
5. Initialize Prisma through `@forgeai/database`.
6. Initialize auth, repositories, queues, and application modules.
7. Start the API, worker, seed script, or Prisma command.

No executable imports `dotenv` directly. This prevents differences between package-level commands, root commands, Prisma CLI execution, seed scripts, and long-running services.

## Shared Package Responsibilities

- `@forgeai/config`: only package allowed to load `.env` and read `process.env`; exports typed configuration.
- `@forgeai/database`: Prisma client, schema, migrations, and seed data.
- `@forgeai/auth`: password hashing, token signing, token verification, and token hashing.
- `@forgeai/logger`: Pino logger creation and request logger helpers.
- `@forgeai/types`: reusable API, auth, and RBAC types.
- `@forgeai/utils`: generic helpers with no app-specific dependencies.
- `@forgeai/sdk`: typed client for public API consumers.

## Non-Goals

Phase 1 does not implement AI chat, agent orchestration, repository analysis, workflow execution, project management, or notifications. Backend folders may reserve clear boundaries for future modules, but no future business functionality is implemented.

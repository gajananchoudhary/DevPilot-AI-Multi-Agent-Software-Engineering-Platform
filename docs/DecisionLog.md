# Decision Log

## 0001 - Use A Modular Monolith For Phase 1

Decision: Keep the backend as a single Express deployable with strict internal module boundaries.

Reason: Identity, RBAC, sessions, and audit logging are shared platform concerns. Keeping them in one process avoids premature distributed systems complexity while still allowing clear feature ownership.

## 0002 - Use Database-Backed RBAC

Decision: Model roles and permissions in PostgreSQL instead of hard-coding role checks.

Reason: Enterprise SaaS products need auditable, extensible authorization. Database-backed RBAC allows new modules to define permissions without rewriting controllers.

## 0003 - Hash Refresh Tokens

Decision: Store only SHA-256 hashes of refresh tokens.

Reason: Refresh tokens are bearer credentials. Hashing them limits blast radius if database contents are exposed.

## 0004 - Rotate Refresh Tokens

Decision: Revoke and replace refresh tokens on every refresh.

Reason: Rotation reduces replay risk and creates a server-side signal for suspicious token reuse.

## 0005 - Use Zod At API Boundaries

Decision: Validate params, query, and body with Zod before controllers.

Reason: Controllers and services should receive typed, trusted input. This keeps error handling consistent and reduces duplicated validation logic.

## 0006 - Standardize API Responses

Decision: Every API response uses `success`, `message`, `data`, `meta`, and `errors`.

Reason: A stable envelope gives web, SDK, and future integrations predictable behavior across modules.

## 0007 - Centralize Configuration Loading

Decision: `@forgeai/config` is the only package allowed to load `.env` files and validate environment variables. Executables, Prisma config, seed scripts, database client, auth helpers, logger, API, and worker all import the typed `env` object from this package instead of calling `dotenv` directly.

Reason: The previous configuration path loaded environment variables in multiple places and with different assumptions about the current working directory. That caused Prisma commands, seed scripts, and runtime services to disagree about `DATABASE_URL`. Centralizing loading makes initialization deterministic: load environment, validate environment, initialize logger, initialize Prisma, initialize auth-dependent code, then start the executable.

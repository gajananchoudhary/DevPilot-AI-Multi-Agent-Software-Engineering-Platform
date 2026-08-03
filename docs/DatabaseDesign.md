# Database Design

Phase 1 uses PostgreSQL with Prisma. The schema focuses on identity, RBAC, sessions, refresh tokens, and audit logs.

## Entities

- `User`: account identity and password hash.
- `Role`: assignable RBAC role.
- `Permission`: granular permission string.
- `UserRole`: user-to-role assignment.
- `RolePermission`: role-to-permission assignment.
- `RefreshToken`: hashed refresh token with rotation and revocation state.
- `UserSession`: server-side authenticated device/session.
- `AuditLog`: append-only security and identity event log.

## Table Standards

Every table uses a UUID primary key and has `createdAt` and `updatedAt`. Soft delete is represented with nullable `deletedAt` on user-facing or administratively managed records. Join tables retain timestamps for auditability.

## Important Constraints

- User emails are unique.
- Role names are unique.
- Permission keys are unique.
- Role and permission joins are unique per pair.
- Refresh token hashes are unique and never store plain token values.
- Sessions can be revoked without deleting historical records.

## Migration Strategy

Prisma migrations are the source of database structure. Local development uses Docker PostgreSQL and `pnpm --filter @forgeai/database db:migrate`. Seed data creates default roles, permissions, and an administrator account.

Root scripts are provided so developers do not need to remember package filters:

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm db:reset`
- `pnpm db:studio`

## Configuration Lifecycle

Prisma commands, the seed script, the API, tests, and worker all import validated configuration from `@forgeai/config`. The Prisma config reads `env.DATABASE_URL` from that package and does not load dotenv itself. This avoids hard-coded local ports and ensures the same database URL is used by migrations, seed data, and runtime code.

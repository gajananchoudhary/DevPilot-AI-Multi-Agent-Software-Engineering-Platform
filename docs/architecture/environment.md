# Environment configuration

Environment validation is split by domain so a package only requires the values it owns. This prevents infrastructure tooling and reusable packages from being coupled to API-only secrets and integrations.

`@forgeai/config/load-env` is internal to the package. It searches upward from the current working directory (and then from the config package) for the workspace `.env` file, and loads it once per process. No application, package, Prisma script, or test should load dotenv directly.

## Dependency graph

```text
@forgeai/config/database  -> database client, Prisma config
@forgeai/config/auth      -> database seed/admin bootstrap
@forgeai/config/api       -> API server and JWT helpers
@forgeai/config/worker    -> worker and workflow queues
@forgeai/config/shared    -> logger and cross-cutting runtime settings
@forgeai/config/ai        -> AI services
@forgeai/config/web       -> Vite/web tooling
```

The root `@forgeai/config` entry point is retained for backwards compatibility. New code must import a domain subpath, because importing the root retains the legacy aggregate environment contract.

## Usage

```ts
import { databaseEnv } from "@forgeai/config/database";
import { apiEnv } from "@forgeai/config/api";
import { workerEnv } from "@forgeai/config/worker";

const databaseUrl = databaseEnv.DATABASE_URL;
const port = apiEnv.API_PORT;
const redisUrl = workerEnv.REDIS_URL;
```

Use `authEnv` for administrator bootstrap credentials, `aiEnv` for OpenAI configuration, `webEnv` for web tooling, and `sharedEnv` for `NODE_ENV` and `LOG_LEVEL`.

## CI and GitHub Actions

CI jobs should provide only the variables required by the command they run. A Prisma generation, migration, deployment, or Studio job needs `DATABASE_URL` (and optionally `NODE_ENV`); it does not need JWT secrets, Redis, OpenAI, SMTP, or administrator credentials. API integration jobs should provide the `apiEnv` contract, while worker jobs should provide the `workerEnv` contract.

This also applies to GitHub Actions: set environment variables at the job or step that consumes them instead of adding a complete application secret set to every workflow. This reduces accidental secret exposure and allows database-only checks to run independently.

## Prisma

`packages/database/prisma.config.ts` imports `databaseEnv` directly. Prisma Generate, Migrate, Deploy, and Reset therefore validate only `DATABASE_URL` and `NODE_ENV`. The Studio launcher imports the same module before starting Prisma, which forwards `DATABASE_URL` to Studio's embedded Prisma Client; this is necessary because Prisma 6 skips its own `.env` loading when a Prisma config file is present. The seed command additionally imports `authEnv`, because it creates the initial administrator, so it may use the administrator defaults or explicit `ADMIN_*` values.

When adding a new variable, add it to the narrowest domain module and update `.env.example`. Do not add it to the legacy aggregate schema unless compatibility requires it.

# API Guidelines

ForgeAI APIs are versioned under `/api/v1` and return a consistent response envelope.

## Response Envelope

```json
{
  "success": true,
  "message": "Request completed",
  "data": {},
  "meta": {},
  "errors": null
}
```

Errors use the same shape with `success: false`, `data: null`, and structured error details.

## Validation

Every endpoint validates body, query, and params with Zod before reaching controllers. Controllers should not perform raw request parsing.

## Controllers

Controllers are thin. They receive validated input, call services, and return response envelopes.

## Services

Services own business rules, transaction boundaries, security-sensitive workflows, and orchestration between repositories.

## Repositories

Repositories are the only module layer that talks directly to Prisma. They return typed domain data and hide persistence details from services.

## Authentication

Protected endpoints use `authenticate()` and permission-aware endpoints also use `requirePermission()`.

## OpenAPI

Swagger UI is available at `/api/docs`. The OpenAPI document is generated from centralized endpoint metadata and schema definitions owned by the API.

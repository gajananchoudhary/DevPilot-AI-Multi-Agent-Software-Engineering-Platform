# Authorization

ForgeAI uses role-based access control with permission strings.

## Data Model

- `Role`: named role such as `administrator` or `member`.
- `Permission`: action string such as `user:view` or `admin:*`.
- `RolePermission`: join table assigning permissions to roles.
- `UserRole`: join table assigning roles to users.

## Default Permissions

- `user:create`
- `user:update`
- `user:delete`
- `user:view`
- `project:create`
- `project:update`
- `project:delete`
- `project:view`
- `admin:*`

`admin:*` is treated as a wildcard for administrative capabilities.

## Middleware

- `authenticate()` verifies the access token and loads the current user.
- `authorize()` requires a valid authenticated principal.
- `requirePermission(permission)` checks the resolved permission set and supports `admin:*`.

## Decision

RBAC is implemented in the API as middleware backed by database roles and permissions instead of hard-coded role checks. This keeps future modules independent from identity implementation details and allows enterprise administration later without changing controller code.

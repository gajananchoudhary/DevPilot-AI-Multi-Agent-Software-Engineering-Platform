# Authentication

ForgeAI authentication is JWT-based with rotating refresh tokens backed by server-side sessions.

## Flows

### Register

`POST /api/v1/auth/register`

The API validates the request body, normalizes the email address, hashes the password with bcrypt, creates the user, assigns the default member role, creates a user session, stores a hashed refresh token, and returns an access token plus refresh token.

### Login

`POST /api/v1/auth/login`

The API validates credentials, rejects deleted users, verifies the password hash, creates a new user session, stores a hashed refresh token, and returns a token pair.

### Refresh Token

`POST /api/v1/auth/refresh`

Refresh tokens are never stored in plain text. The submitted refresh token is hashed and looked up. If valid, the old refresh token is revoked and replaced with a new token in the same session. This rotation limits replay risk and gives the backend a revocation point.

### Logout

`POST /api/v1/auth/logout`

The authenticated session is revoked and the presented refresh token is revoked when provided.

### Logout From All Devices

`POST /api/v1/auth/logout-all`

All sessions and refresh tokens for the current user are revoked.

### Current User

`GET /api/v1/auth/me`

Returns the authenticated user, roles, and permissions derived from the access token subject.

## Token Design

Access tokens are short lived and signed with `JWT_ACCESS_SECRET`. Refresh tokens are longer lived, opaque random strings, and stored only as SHA-256 hashes. JWT payloads include the user ID as `sub`, session ID, token type, issuer, and audience.

## Security Decisions

- Passwords are hashed with bcrypt.
- Refresh tokens are rotated on every refresh.
- Refresh tokens are hashed before storage.
- Sessions are stored server-side for logout and device invalidation.
- Authentication state is module-owned and not mixed into controllers.

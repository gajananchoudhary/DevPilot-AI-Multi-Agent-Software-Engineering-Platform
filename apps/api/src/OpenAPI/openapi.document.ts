import { apiEnv } from "@forgeai/config/api";

export const openApiDocument = {
  components: {
    securitySchemes: {
      bearerAuth: {
        bearerFormat: "JWT",
        scheme: "bearer",
        type: "http"
      }
    },
    schemas: {
      ApiError: {
        properties: {
          code: { example: "VALIDATION_ERROR", type: "string" },
          message: { example: "Validation failed", type: "string" },
          path: {
            items: { oneOf: [{ type: "string" }, { type: "number" }] },
            type: "array"
          }
        },
        required: ["code", "message"],
        type: "object"
      },
      ApiResponse: {
        properties: {
          data: { nullable: true },
          errors: {
            items: { $ref: "#/components/schemas/ApiError" },
            nullable: true,
            type: "array"
          },
          message: { type: "string" },
          meta: { type: "object" },
          success: { type: "boolean" }
        },
        required: ["success", "message", "data", "meta", "errors"],
        type: "object"
      },
      LoginRequest: {
        properties: {
          email: { example: "admin@forgeai.local", format: "email", type: "string" },
          password: { example: "ChangeMe123!", type: "string" }
        },
        required: ["email", "password"],
        type: "object"
      },
      RegisterRequest: {
        properties: {
          email: { example: "engineer@forgeai.local", format: "email", type: "string" },
          name: { example: "Forge Engineer", type: "string" },
          password: { example: "ChangeMe123!", minLength: 8, type: "string" }
        },
        required: ["email", "password"],
        type: "object"
      },
      RefreshRequest: {
        properties: {
          refreshToken: { example: "opaque-refresh-token", type: "string" }
        },
        required: ["refreshToken"],
        type: "object"
      }
    }
  },
  info: {
    description: "ForgeAI backend foundation API for identity, sessions, and RBAC.",
    title: "ForgeAI API",
    version: apiEnv.APP_VERSION
  },
  openapi: "3.0.3",
  paths: {
    "/api/v1/auth/login": {
      post: {
        description: "Authenticate a user and create a server-side session.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          },
          required: true
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid email or password" }
        },
        summary: "Login"
      }
    },
    "/api/v1/auth/logout": {
      post: {
        description: "Revoke the current user session and optional refresh token.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Logout successful" },
          "401": { description: "Authentication required" }
        },
        security: [{ bearerAuth: [] }],
        summary: "Logout"
      }
    },
    "/api/v1/auth/logout-all": {
      post: {
        description: "Revoke all active sessions and refresh tokens for the authenticated user.",
        responses: {
          "200": { description: "Logged out from all devices" },
          "401": { description: "Authentication required" }
        },
        security: [{ bearerAuth: [] }],
        summary: "Logout from all devices"
      }
    },
    "/api/v1/auth/me": {
      get: {
        description: "Return the authenticated user with resolved roles and permissions.",
        responses: {
          "200": { description: "Current user retrieved" },
          "401": { description: "Authentication required" }
        },
        security: [{ bearerAuth: [] }],
        summary: "Current user"
      }
    },
    "/api/v1/auth/refresh": {
      post: {
        description: "Rotate a refresh token and issue a new access token.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" }
            }
          },
          required: true
        },
        responses: {
          "200": { description: "Token refreshed" },
          "401": { description: "Invalid refresh token" }
        },
        summary: "Refresh token"
      }
    },
    "/api/v1/auth/register": {
      post: {
        description: "Register a user, assign the default member role, and issue tokens.",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          },
          required: true
        },
        responses: {
          "201": { description: "Registration successful" },
          "409": { description: "User already exists" }
        },
        summary: "Register"
      }
    },
    "/api/v1/health": {
      get: {
        description: "Check API and PostgreSQL connectivity.",
        responses: {
          "200": { description: "Health check successful" }
        },
        summary: "Health check"
      }
    },
    "/api/v1/permissions": {
      get: {
        description: "List permissions. Requires administrative permission.",
        responses: {
          "200": { description: "Permissions retrieved" },
          "403": { description: "Permission denied" }
        },
        security: [{ bearerAuth: [] }],
        summary: "List permissions"
      }
    },
    "/api/v1/roles": {
      get: {
        description: "List roles with permissions. Requires administrative permission.",
        responses: {
          "200": { description: "Roles retrieved" },
          "403": { description: "Permission denied" }
        },
        security: [{ bearerAuth: [] }],
        summary: "List roles"
      }
    },
    "/api/v1/users": {
      get: {
        description: "List users. Requires user:view.",
        responses: {
          "200": { description: "Users retrieved" },
          "403": { description: "Permission denied" }
        },
        security: [{ bearerAuth: [] }],
        summary: "List users"
      }
    },
    "/api/v1/users/{id}": {
      get: {
        description: "Get a user by ID. Requires user:view.",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { format: "uuid", type: "string" }
          }
        ],
        responses: {
          "200": { description: "User retrieved" },
          "404": { description: "User not found" }
        },
        security: [{ bearerAuth: [] }],
        summary: "Get user"
      }
    }
  },
  servers: [
    {
      url: apiEnv.API_URL
    }
  ]
} as const;

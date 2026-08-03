import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../../app.js";

describe("health module", () => {
  it("returns the API health envelope", async () => {
    const response = await request(createApp()).get("/api/v1/health").expect(200);

    expect(response.body).toMatchObject({
      data: {
        database: "connected",
        service: "api",
        status: "ok"
      },
      errors: null,
      message: "Health check successful",
      success: true
    });
  });
});

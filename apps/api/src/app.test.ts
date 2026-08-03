import request from "supertest";
import { describe, it } from "vitest";

import { createApp } from "./app.js";

describe("createApp", () => {
  it("exposes a health endpoint", async () => {
    await request(createApp()).get("/api/health").expect(200).expect({ ok: true, service: "api" });
  });
});

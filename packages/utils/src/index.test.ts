import { describe, expect, it } from "vitest";

import { toSlug } from "./index.js";

describe("toSlug", () => {
  it("normalizes names for stable URLs", () => {
    expect(toSlug("Forge AI Platform")).toBe("forge-ai-platform");
  });
});

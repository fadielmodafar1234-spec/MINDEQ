import { afterEach, describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("fails clearly when the approved site origin is not configured", () => {
    vi.stubEnv("MINDEQ_SITE_URL", "");

    expect(() => sitemap()).toThrowError(/MINDEQ_SITE_URL/);
  });

  it("contains static routes without development machine slugs", () => {
    vi.stubEnv("MINDEQ_SITE_URL", "https://mindeq.example");

    expect(sitemap()).toEqual([
      { url: "https://mindeq.example/" },
      { url: "https://mindeq.example/machines" },
    ]);
    expect(JSON.stringify(sitemap())).not.toContain("development-machine");
  });
});

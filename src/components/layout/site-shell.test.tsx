import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

describe("site shell", () => {
  it("exposes every approved route on desktop and mobile", () => {
    const markup = renderToStaticMarkup(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );

    for (const route of ["/", "/machines", "/expertise", "/contact"]) {
      expect(markup).toContain(`href="${route}"`);
    }

    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain("Moroccan industrial machine manufacturer");
  });

  it("uses literal typed destinations for the supporting routes", () => {
    for (const file of [
      "src/components/layout/site-header.tsx",
      "src/components/layout/site-footer.tsx",
      "src/app/not-found.tsx",
    ]) {
      const source = readFileSync(file, "utf8");

      expect(source).not.toMatch(new RegExp(["as", "Route"].join("\\s+")));
      expect(source).not.toContain('import type { Route } from "next"');
    }
  });
});

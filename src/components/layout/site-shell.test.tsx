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
});

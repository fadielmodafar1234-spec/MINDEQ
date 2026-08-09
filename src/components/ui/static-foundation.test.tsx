import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ActionLink } from "./action-link";
import { Container } from "./container";
import { Section } from "./section";

describe("static design foundation", () => {
  it("exposes semantic layout primitives", () => {
    const markup = renderToStaticMarkup(
      <Section id="engineering" index="02" label="Engineering" tone="dark">
        <Container size="wide">
          <ActionLink href="/machines" variant="primary">
            Explore machines
          </ActionLink>
        </Container>
      </Section>,
    );

    expect(markup).toContain('id="engineering"');
    expect(markup).toContain('data-section-index="02"');
    expect(markup).toContain('href="/machines"');
  });

  it("defines the semantic token and resilience contract", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    for (const token of [
      "--color-canvas",
      "--color-ink",
      "--color-brand",
      "--color-focus",
      "--section-space",
      "--grid-columns",
    ]) {
      expect(css).toContain(token);
    }
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("overflow-x: clip");
  });
});

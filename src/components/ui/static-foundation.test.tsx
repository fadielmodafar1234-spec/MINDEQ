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
    for (const declaration of [
      "--color-canvas: #e7e5de;",
      "--color-ink: #111713;",
      "--color-brand: #174a5b;",
      "--color-focus: #0b6f8a;",
      "--section-space: clamp(var(--space-8), 8vw, var(--space-10));",
      "--grid-columns: 12;",
    ]) {
      expect(css).toContain(declaration);
    }
    expect(css).toMatch(
      /:focus-visible\s*\{\s*outline: 3px solid var\(--color-focus\);\s*outline-offset: 3px;/,
    );
    expect(css).toMatch(
      /@media \(max-width: 48rem\) \{[\s\S]*?:root \{[\s\S]*?--grid-columns: 4;/,
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?animation: none !important;[\s\S]*?transition: none !important;/,
    );
    expect(css).toMatch(
      /@media \(hover: hover\) \{[\s\S]*?\.action-link:hover[\s\S]*?text-decoration-line: underline;/,
    );
    expect(css).toMatch(/html\s*\{[\s\S]*?overflow-x: clip;/);
    expect(css).not.toMatch(/\.machine-card\s*\{[^}]*overflow: hidden;/);
  });
});

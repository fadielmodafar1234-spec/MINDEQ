import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ContactPage from "./contact/page";
import ExpertisePage from "./expertise/page";

function countHeadings(markup: string, level: number) {
  return markup.match(new RegExp(`<h${level}(?:\\s|>)`, "g"))?.length ?? 0;
}

describe("static routes", () => {
  it("composes the dynamic machine route from reusable presenter contracts", () => {
    const source = readFileSync("src/app/machines/[slug]/page.tsx", "utf8");

    expect(source).toContain("MachineDetailPage");
    expect(source).toContain("toMachineDetailPageModel");
    expect(source).toContain("createMachineViewerConfig(machine)");
    expect(source).not.toContain('"development-machine"');
    expect(source).not.toMatch(/slug\s*===/);
    expect(source).not.toMatch(/switch\s*\(\s*slug\s*\)/);
  });

  it("presents approved expertise positioning with useful cross-links", () => {
    const markup = renderToStaticMarkup(<ExpertisePage />);

    expect(countHeadings(markup, 1)).toBe(1);
    expect(markup).toContain("Moroccan industrial machine manufacturer");
    for (const industry of [
      "Textile",
      "Confection",
      "Agro-food",
      "Construction",
      "Custom engineering",
    ]) {
      expect(markup).toContain(industry);
    }
    expect(markup).toContain('href="/machines"');
    expect(markup).toContain('href="/contact"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("mailto:");
    expect(markup).not.toContain("tel:");
  });

  it("frames inquiries without inventing a submission channel", () => {
    const markup = renderToStaticMarkup(<ContactPage />);

    expect(countHeadings(markup, 1)).toBe(1);
    expect(markup).toContain("production delivery");
    expect(markup).toContain("privacy handling");
    expect(markup).toContain('href="/machines"');
    expect(markup).toContain('href="/expertise"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("mailto:");
    expect(markup).not.toContain("tel:");
  });
});

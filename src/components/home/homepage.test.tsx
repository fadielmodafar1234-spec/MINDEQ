import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { developmentMachine } from "@/content/machines/development-machine";

import { Homepage } from "./homepage";

describe("homepage", () => {
  it("renders the seven approved chapters in order", () => {
    const markup = renderToStaticMarkup(<Homepage featuredMachines={[]} />);
    const ids = [
      "hero",
      "engineering",
      "industries",
      "featured-machines",
      "custom-engineering",
      "company-proof",
      "contact",
    ];

    ids.reduce((position, id) => {
      const next = markup.indexOf(`id="${id}"`);
      expect(next).toBeGreaterThan(position);
      return next;
    }, -1);

    expect(markup).toContain("DESIGNED.");
    expect(markup).toContain("ENGINEERED.");
    expect(markup).toContain("MANUFACTURED.");
    expect(markup).toContain("IN MOROCCO.");

    for (const industry of [
      "Textile",
      "Confection",
      "Agro-food",
      "Construction",
      "Custom engineering",
    ]) {
      expect(markup).toContain(industry);
    }
  });

  it("uses honest actions and an empty featured state", () => {
    const unpublishedMachine = {
      slug: developmentMachine.slug,
      name: developmentMachine.name,
      shortName: developmentMachine.shortName,
      category: developmentMachine.category,
      tagline: developmentMachine.tagline,
      heroImage: developmentMachine.heroImage,
      publicationStatus: developmentMachine.publicationStatus,
    };
    const markup = renderToStaticMarkup(
      <Homepage featuredMachines={[unpublishedMachine]} />,
    );

    expect(markup).toContain('href="/machines"');
    expect(markup).toContain('href="/expertise"');
    expect(markup).toContain('href="/contact"');
    expect(markup).toContain(
      "No verified featured machines are published yet.",
    );
    expect(markup).not.toContain("development-machine");
  });
});

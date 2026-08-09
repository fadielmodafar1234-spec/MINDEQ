import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { developmentMachine } from "@/content/machines/development-machine";

import { Homepage } from "./homepage";

const publishedMachine = {
  slug: "published-test-machine",
  name: "Published test machine",
  shortName: "Published test machine",
  category: developmentMachine.category,
  tagline: "Published test tagline",
  heroImage: {
    ...developmentMachine.heroImage,
    id: "published-test-machine-hero",
    alt: "Published test machine poster.",
    publicationStatus: "published" as const,
  },
  publicationStatus: "published" as const,
};

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

    for (const index of ["01", "02", "03", "04", "05", "06", "07"]) {
      expect(markup).toContain(`data-section-index="${index}"`);
    }

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

  it("renders a supplied published machine with section-level heading hierarchy", () => {
    const markup = renderToStaticMarkup(
      <Homepage featuredMachines={[publishedMachine]} />,
    );

    expect(markup).toContain('href="/machines/published-test-machine"');
    expect(markup).toContain(
      '<h3><a href="/machines/published-test-machine">Published test machine</a></h3>',
    );
    expect(markup).not.toContain(
      "No verified featured machines are published yet.",
    );
  });

  it("hides the decorative machine stage from assistive technology", () => {
    const markup = renderToStaticMarkup(<Homepage featuredMachines={[]} />);

    expect(markup).toContain(
      '<div aria-hidden="true" class="machine-stage">',
    );
  });

  it("uses neutral reference labels in the decorative machine stage", () => {
    const markup = renderToStaticMarkup(<Homepage featuredMachines={[]} />);

    expect(markup).toContain("REF: STATIC-DATUM");
    expect(markup).toContain("DATUM X // REFERENCE");
    expect(markup).toContain("DATUM Y // REFERENCE");
    expect(markup).not.toContain("MINDEQ-TCM1600");
    expect(markup).not.toMatch(/\b\d+\s*mm\b/i);
  });
});

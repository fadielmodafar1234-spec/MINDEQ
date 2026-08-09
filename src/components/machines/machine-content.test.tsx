import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DEVELOPMENT_PLACEHOLDER_LABEL } from "@/lib/machines/constants";
import { getMachinePreviewBySlug } from "@/lib/machines/repository";

import { DevelopmentPlaceholderNotice } from "./development-placeholder-notice";
import { MachineCard } from "./machine-card";
import { MachineTechnicalContent } from "./machine-technical-content";

const machine = getMachinePreviewBySlug("development-machine");

if (!machine) {
  throw new Error("The development machine fixture is unavailable in tests.");
}

describe("machine content components", () => {
  it("renders the exact development warning", () => {
    const markup = renderToStaticMarkup(
      <DevelopmentPlaceholderNotice />,
    );

    expect(markup).toContain(DEVELOPMENT_PLACEHOLDER_LABEL);
    expect(markup).toContain("not a real MINDEQ product");
  });

  it("renders catalogue-safe identity without loading a model", () => {
    const markup = renderToStaticMarkup(
      <MachineCard
        machine={{
          slug: machine.slug,
          name: machine.name,
          shortName: machine.shortName,
          category: machine.category,
          tagline: machine.tagline,
          heroImage: machine.heroImage,
          publicationStatus: machine.publicationStatus,
        }}
      />,
    );

    expect(markup).toContain("/machines/development-machine");
    expect(markup).toContain(
      '<h2><a href="/machines/development-machine">Development Machine</a></h2>',
    );
    expect(markup).toContain(DEVELOPMENT_PLACEHOLDER_LABEL);
    expect(markup).toContain(machine.heroImage.alt);
    expect(markup).not.toContain(".glb");
  });

  it("omits empty technical groups", () => {
    const markup = renderToStaticMarkup(
      <MachineTechnicalContent
        machine={{
          applications: machine.applications,
          features: machine.features,
          specifications: machine.specifications,
          dimensions: machine.dimensions,
          hotspots: machine.hotspots,
          documentation: machine.documentation,
        }}
      />,
    );

    expect(markup).toBe("");
  });

  it("omits specification and dimension groups with no values", () => {
    const markup = renderToStaticMarkup(
      <MachineTechnicalContent
        machine={{
          applications: [],
          features: [],
          specifications: [
            {
              id: "empty-specifications",
              label: "Empty specifications",
              items: [],
            },
          ],
          dimensions: [
            { id: "empty-dimensions", label: "Empty dimensions", items: [] },
          ],
          hotspots: [],
          documentation: [],
        }}
      />,
    );

    expect(markup).toBe("");
  });

  it("never presents rejected technical values", () => {
    const markup = renderToStaticMarkup(
      <MachineTechnicalContent
        machine={{
          applications: [],
          features: [],
          specifications: [
            {
              id: "review-specifications",
              label: "Review specifications",
              items: [
                {
                  id: "rejected-value",
                  label: "Rejected value",
                  value: "Must not render",
                  verificationStatus: "rejected-or-superseded",
                },
                {
                  id: "development-value",
                  label: "Development value",
                  value: "Not verified",
                  verificationStatus: "development-placeholder",
                },
              ],
            },
          ],
          dimensions: [],
          hotspots: [],
          documentation: [],
        }}
      />,
    );

    expect(markup).toContain("Development value");
    expect(markup).not.toContain("Rejected value");
    expect(markup).not.toContain("Must not render");
  });

  it("renders hotspot technical values as accessible page content", () => {
    const markup = renderToStaticMarkup(
      <MachineTechnicalContent
        machine={{
          applications: [],
          features: [],
          specifications: [],
          dimensions: [],
          hotspots: [
            {
              id: "test-hotspot",
              label: "Test hotspot",
              description: "Test hotspot description.",
              position: [0, 0, 0],
              technicalValues: [
                {
                  id: "visible-hotspot-value",
                  label: "Visible hotspot value",
                  value: "1",
                  unit: "test-unit",
                  verificationStatus: "verified",
                },
                {
                  id: "rejected-hotspot-value",
                  label: "Rejected hotspot value",
                  value: "Must not render",
                  verificationStatus: "rejected-or-superseded",
                },
              ],
            },
          ],
          documentation: [],
        }}
      />,
    );

    expect(markup).toContain("Visible hotspot value");
    expect(markup).toContain("1 test-unit");
    expect(markup).not.toContain("Rejected hotspot value");
  });
});

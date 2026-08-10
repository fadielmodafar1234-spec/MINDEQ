import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DEVELOPMENT_PLACEHOLDER_LABEL } from "@/lib/machines/constants";
import type { MachineDetailPageModel } from "@/lib/machines/detail-page";
import { toMachineDetailPageModel } from "@/lib/machines/detail-page";
import { getMachinePreviewBySlug } from "@/lib/machines/repository";

import { DevelopmentPlaceholderNotice } from "./development-placeholder-notice";
import { MachineCard } from "./machine-card";
import { MachineDetailPage } from "./machine-detail-page";
import { MachineTechnicalContent } from "./machine-technical-content";

const machine = getMachinePreviewBySlug("development-machine");

if (!machine) {
  throw new Error("The development machine fixture is unavailable in tests.");
}

const emptyDetailMachine: MachineDetailPageModel = {
  ...toMachineDetailPageModel(machine),
  applications: [],
  features: [],
  specificationGroups: [],
  dimensionGroups: [],
  hotspots: [],
  gallery: [],
  documentation: [],
};

const populatedDetailMachine: MachineDetailPageModel = {
  ...emptyDetailMachine,
  identity: {
    slug: "development-machine",
    name: "Development Machine",
    category: "Development category",
    tagline: "Development tagline",
    publicationStatus: "development",
  },
  overview: "Development overview.",
  applications: [
    {
      id: "test-application",
      title: "Test application",
      description: "Test application description.",
    },
  ],
  features: [
    {
      id: "test-feature",
      title: "Test feature",
      description: "Test feature description.",
    },
  ],
  specificationGroups: [
    {
      id: "test-specifications",
      label: "Test specifications",
      items: [
        {
          id: "test-capacity",
          label: "Test capacity",
          value: "Test value",
          unit: "test-unit",
          note: "Test note.",
          verificationStatus: "development-placeholder",
        },
        {
          id: "rejected-value",
          label: "Rejected value",
          value: "Must not render",
          verificationStatus: "rejected-or-superseded",
        },
      ],
    },
  ],
  dimensionGroups: [
    {
      id: "test-dimensions",
      label: "Test dimensions",
      items: [
        {
          id: "test-width",
          label: "Test width",
          value: "Test dimension",
          verificationStatus: "development-placeholder",
        },
      ],
      drawing: machine.heroImage,
    },
  ],
  hotspots: [
    {
      id: "test-hotspot",
      label: "Test hotspot",
      description: "Test hotspot description.",
      position: [0, 0, 0],
      technicalValues: [
        {
          id: "hotspot-value",
          label: "Hotspot value",
          value: "Hotspot test value",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
  gallery: [machine.heroImage],
  documentation: [
    {
      id: "test-document",
      title: "Test documentation",
      type: "manual",
      language: "en",
      file: "/development-assets/test-document.txt",
    },
  ],
};

const collisionDetailMachine: MachineDetailPageModel = {
  ...populatedDetailMachine,
  specificationGroups: [
    {
      id: "applications",
      label: "Collision specification A",
      items: [
        {
          id: "collision-specification-a",
          label: "Collision specification value A",
          value: "A",
          verificationStatus: "development-placeholder",
        },
      ],
    },
    {
      id: "shared-technical-values",
      label: "Collision specification B",
      items: [
        {
          id: "collision-specification-b",
          label: "Collision specification value B",
          value: "B",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
  dimensionGroups: [
    {
      id: "features",
      label: "Collision dimension A",
      items: [
        {
          id: "collision-dimension-a",
          label: "Collision dimension value A",
          value: "A",
          verificationStatus: "development-placeholder",
        },
      ],
    },
    {
      id: "hotspots",
      label: "Collision dimension B",
      items: [
        {
          id: "collision-dimension-b",
          label: "Collision dimension value B",
          value: "B",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
  hotspots: [
    {
      id: "shared",
      label: "Collision hotspot",
      description: "Collision hotspot description.",
      position: [0, 0, 0],
      technicalValues: [
        {
          id: "collision-hotspot-value",
          label: "Collision hotspot value",
          value: "C",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
};

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

  it("omits every empty optional section from the reusable page", () => {
    const markup = renderToStaticMarkup(
      <MachineDetailPage machine={emptyDetailMachine} viewerConfig={null} />,
    );

    expect(markup).not.toContain("Applications");
    expect(markup).not.toContain("Features");
    expect(markup).not.toContain("Machine details");
    expect(markup).not.toContain("Gallery");
    expect(markup).not.toContain("Documentation");
  });

  it("preserves the current route input until route composition is wired", () => {
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

    expect(markup).toContain("Machine details");
  });

  it("omits empty and rejected-only technical groups", () => {
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
            {
              id: "rejected-specifications",
              label: "Rejected specifications",
              items: [
                {
                  id: "rejected-specification-value",
                  label: "Rejected specification value",
                  value: "Must not render",
                  verificationStatus: "rejected-or-superseded",
                },
              ],
            },
          ],
          dimensions: [
            {
              id: "empty-dimensions",
              label: "Empty dimensions",
              items: [],
            },
            {
              id: "rejected-dimensions",
              label: "Rejected dimensions",
              items: [
                {
                  id: "rejected-dimension-value",
                  label: "Rejected dimension value",
                  value: "Must not render",
                  verificationStatus: "rejected-or-superseded",
                },
              ],
            },
          ],
          hotspots: [],
          documentation: [],
        }}
      />,
    );

    expect(markup).toBe("");
    expect(markup).not.toContain("Empty specifications");
    expect(markup).not.toContain("Rejected specifications");
    expect(markup).not.toContain("Empty dimensions");
    expect(markup).not.toContain("Rejected dimensions");
    expect(markup).not.toContain("Must not render");
  });

  it("uses unique heading ids and uniquely resolved labels", () => {
    const markup = renderToStaticMarkup(
      <MachineDetailPage machine={collisionDetailMachine} viewerConfig={null} />,
    );
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(
      ([, id]) => id,
    );
    const labelledByIds = [
      ...markup.matchAll(/\saria-labelledby="([^"]+)"/g),
    ].map(([, id]) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const labelledById of labelledByIds) {
      expect(ids.filter((id) => id === labelledById)).toHaveLength(1);
    }
  });

  it("renders the complete reusable detail page from one model", () => {
    const markup = renderToStaticMarkup(
      <MachineDetailPage machine={populatedDetailMachine} viewerConfig={null} />,
    );

    expect(markup).toContain("<h1>Development Machine</h1>");
    expect(markup).toContain('aria-labelledby="applications-heading"');
    expect(markup).toContain("<table>");
    expect(markup).toContain('<th scope="row">Test capacity</th>');
    expect(markup).toContain("Test value test-unit");
    expect(markup).toContain("Test note.");
    expect(markup).toContain("Machine details");
    expect(markup).toContain("Gallery");
    expect(markup).toContain("Documentation");
    expect(markup).toContain(
      "/contact?intent=quotation&amp;machine=development-machine",
    );
    expect(markup).not.toContain("Rejected value");
  });
});

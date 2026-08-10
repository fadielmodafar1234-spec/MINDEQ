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

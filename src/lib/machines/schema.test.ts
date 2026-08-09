import { describe, expect, it } from "vitest";

import { parseMachineCatalogue } from "./schema";
import type { MachineInput } from "./types";

const validDevelopmentMachine: MachineInput = {
  slug: "development-machine",
  name: "Development Machine",
  shortName: "Development Machine",
  category: {
    id: "custom-engineering",
    label: "Custom engineering",
    order: 50,
  },
  tagline: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
  description:
    "DEVELOPMENT PLACEHOLDER — NOT VERIFIED. This record exercises the machine schema.",
  applications: [
    {
      id: "development-application",
      title: "Development application",
      description: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
      industryId: "development",
    },
  ],
  features: [
    {
      id: "development-feature",
      title: "Development feature",
      description: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
    },
  ],
  specifications: [
    {
      id: "development-specifications",
      label: "Development specifications",
      items: [
        {
          id: "development-value",
          label: "Development value",
          value: "NOT VERIFIED",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
  dimensions: [
    {
      id: "development-dimensions",
      label: "Development dimensions",
      items: [
        {
          id: "development-dimension",
          label: "Development dimension",
          value: "NOT VERIFIED",
          unit: "NOT VERIFIED",
          verificationStatus: "development-placeholder",
        },
      ],
    },
  ],
  heroImage: {
    id: "development-poster",
    src: "/placeholders/machine-poster.svg",
    alt: "Development placeholder graphic; not a real MINDEQ machine.",
    width: 1600,
    height: 900,
    publicationStatus: "development",
  },
  gallery: [
    {
      id: "development-gallery-image",
      src: "/placeholders/machine-poster.svg",
      alt: "Development placeholder graphic; not a real MINDEQ machine.",
      width: 1600,
      height: 900,
      publicationStatus: "development",
    },
  ],
  model: null,
  modelMobile: null,
  modelPoster: null,
  hotspots: [
    {
      id: "development-hotspot",
      label: "Development hotspot",
      description: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
      position: [0, 0, 0],
      technicalValues: [],
    },
  ],
  documentation: [
    {
      id: "development-document",
      title: "Development document",
      type: "other",
      language: "en",
      file: "/placeholders/development-document.pdf",
      publicationStatus: "development",
    },
  ],
  seo: {
    title: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
    description:
      "Development-only machine record used to validate the MINDEQ page architecture.",
    canonicalPath: "/machines/development-machine",
    noIndex: true,
  },
  publicationStatus: "development",
  featured: false,
  sourceReferences: [
    {
      id: "development-source",
      type: "development-placeholder",
      title: "Development fixture",
      location: "src/lib/machines/schema.test.ts",
      approvalState: "development",
      approvalNote: "Test fixture only.",
    },
  ],
};

function createPublishedMachineFixture() {
  const machine = structuredClone(validDevelopmentMachine);

  machine.name = "Test Machine";
  machine.shortName = "Test Machine";
  machine.tagline = "Schema test fixture";
  machine.description = "Schema test fixture.";
  machine.applications[0]!.description = "Schema test fixture.";
  machine.features[0]!.description = "Schema test fixture.";
  machine.specifications[0]!.items[0]!.value = "1";
  machine.specifications[0]!.items[0]!.sourceReferenceId =
    "development-source";
  machine.specifications[0]!.items[0]!.verificationStatus = "verified";
  machine.dimensions[0]!.items[0]!.value = "1";
  machine.dimensions[0]!.items[0]!.unit = "test-unit";
  machine.dimensions[0]!.items[0]!.sourceReferenceId = "development-source";
  machine.dimensions[0]!.items[0]!.verificationStatus = "verified";
  machine.heroImage.alt = "Schema test fixture graphic.";
  machine.heroImage.publicationStatus = "published";
  machine.gallery[0]!.alt = "Schema test fixture graphic.";
  machine.gallery[0]!.publicationStatus = "published";
  machine.hotspots[0]!.description = "Schema test fixture.";
  machine.documentation[0]!.publicationStatus = "published";
  machine.seo.title = "Test Machine";
  machine.seo.description = "Schema test fixture.";
  machine.seo.noIndex = false;
  machine.publicationStatus = "published";
  machine.sourceReferences[0]!.type = "human-approval";
  machine.sourceReferences[0]!.title = "Test approval";
  machine.sourceReferences[0]!.location = "schema test fixture";
  machine.sourceReferences[0]!.approvalState = "approved";
  machine.sourceReferences[0]!.approvalNote = "Schema test fixture.";

  return machine;
}

describe("parseMachineCatalogue", () => {
  it("accepts a complete development record", () => {
    const result = parseMachineCatalogue([validDevelopmentMachine]);

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("development-machine");
  });

  it("rejects a non-canonical machine slug", () => {
    const machine = {
      ...validDevelopmentMachine,
      slug: "Development Machine",
      seo: {
        ...validDevelopmentMachine.seo,
        canonicalPath: "/machines/Development Machine",
      },
    };

    expect(() => parseMachineCatalogue([machine])).toThrowError(/slug/i);
  });

  it("rejects a category outside the central registry", () => {
    const machine = structuredClone(validDevelopmentMachine);
    machine.category = {
      id: "unregistered-category",
      label: "Unregistered category",
      order: 999,
    };

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /registered machine category/i,
    );
  });

  it("rejects duplicate machine slugs", () => {
    expect(() =>
      parseMachineCatalogue([
        validDevelopmentMachine,
        structuredClone(validDevelopmentMachine),
      ]),
    ).toThrowError(/duplicate machine slug/i);
  });

  it("rejects duplicate identifiers inside one machine", () => {
    const machine = structuredClone(validDevelopmentMachine);
    machine.features[0]!.id = machine.applications[0]!.id;

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /duplicate machine-local id/i,
    );
  });

  it("rejects a published machine without an approved source", () => {
    const machine = createPublishedMachineFixture();
    machine.sourceReferences = [];

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine requires an approved source/i,
    );
  });

  it("rejects a development-placeholder source approved for publication", () => {
    const machine = createPublishedMachineFixture();
    machine.sourceReferences[0]!.type = "development-placeholder";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine requires an approved source/i,
    );
  });

  it("rejects a featured machine that is not published", () => {
    const machine = {
      ...validDevelopmentMachine,
      featured: true,
    };

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /featured machine must be published/i,
    );
  });

  it("rejects a model-backed machine without a poster", () => {
    const machine = {
      ...validDevelopmentMachine,
      model: {
        id: "development-viewer-model",
        src: "/placeholders/development-machine.viewer.glb",
        variant: "viewer",
        fileBytes: 1,
        componentIds: ["development-component"],
        componentMapVersion: "development-v1",
        publicationStatus: "development",
      },
    };

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /model-backed machine requires a poster/i,
    );
  });

  it("rejects a hotspot that targets an unknown model component", () => {
    const machine = structuredClone(validDevelopmentMachine);
    machine.model = {
      id: "development-viewer-model",
      src: "/placeholders/development-machine.viewer.glb",
      variant: "viewer",
      fileBytes: 1,
      componentIds: ["known-component"],
      componentMapVersion: "development-v1",
      publicationStatus: "development",
    };
    machine.modelPoster = {
      id: "development-model-poster",
      src: "/placeholders/machine-poster.svg",
      alt: "Development placeholder graphic; not a real MINDEQ machine.",
      width: 1600,
      height: 900,
      publicationStatus: "development",
    };
    machine.hotspots[0]!.componentId = "missing-component";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /unknown model component/i,
    );
  });

  it("rejects metadata whose canonical path does not match the slug", () => {
    const machine = {
      ...validDevelopmentMachine,
      seo: {
        ...validDevelopmentMachine.seo,
        canonicalPath: "/machines/different-machine",
      },
    };

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /canonical path must match machine slug/i,
    );
  });

  it("rejects a published machine marked no-index", () => {
    const machine = createPublishedMachineFixture();
    machine.seo.noIndex = true;

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine must be indexable/i,
    );
  });

  it("rejects development technical values inside a published machine", () => {
    const machine = createPublishedMachineFixture();
    machine.specifications[0]!.items[0]!.verificationStatus =
      "development-placeholder";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine cannot contain development technical values/i,
    );
  });

  it("rejects a published technical value without a source reference", () => {
    const machine = createPublishedMachineFixture();
    delete machine.specifications[0]!.items[0]!.sourceReferenceId;

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published technical value requires an approved source reference/i,
    );
  });

  it("rejects a published technical value with an unknown source reference", () => {
    const machine = createPublishedMachineFixture();
    machine.specifications[0]!.items[0]!.sourceReferenceId = "missing-source";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published technical value requires an approved source reference/i,
    );
  });

  it("rejects development media inside a published machine", () => {
    const machine = createPublishedMachineFixture();
    machine.heroImage.publicationStatus = "development";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine requires published media/i,
    );
  });

  it("rejects an invalid documentation language tag", () => {
    const machine = structuredClone(validDevelopmentMachine);
    machine.documentation[0]!.language = "not_a_language";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /valid language tag/i,
    );
  });

  it("rejects an invalid documentation calendar date", () => {
    const machine = structuredClone(validDevelopmentMachine);
    machine.documentation[0]!.date = "2026-02-31";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /ISO calendar date/i,
    );
  });

  it("rejects the development warning inside published content", () => {
    const machine = createPublishedMachineFixture();
    machine.description = "DEVELOPMENT PLACEHOLDER — NOT VERIFIED";

    expect(() => parseMachineCatalogue([machine])).toThrowError(
      /published machine cannot contain the development placeholder label/i,
    );
  });
});

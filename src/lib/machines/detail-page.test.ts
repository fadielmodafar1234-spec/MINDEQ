import { describe, expect, it } from "vitest";

import { getMachinePreviewBySlug } from "./repository";
import type { MachineDetailPageModel } from "./detail-page";
import { toMachineDetailPageModel } from "./detail-page";

const previewMachine = getMachinePreviewBySlug("development-machine");

if (!previewMachine) {
  throw new Error("Development machine fixture is unavailable.");
}

declare const detailModel: MachineDetailPageModel;

if (false) {
  // @ts-expect-error Detail applications are a readonly public collection.
  detailModel.applications.push(previewMachine.applications[0]!);
  // @ts-expect-error Detail features are a readonly public collection.
  detailModel.features.push(previewMachine.features[0]!);
  // @ts-expect-error Detail gallery items are a readonly public collection.
  detailModel.gallery.push(previewMachine.gallery[0]!);
  // @ts-expect-error Detail documentation is a readonly public collection.
  detailModel.documentation.push(previewMachine.documentation[0]!);
}

describe("toMachineDetailPageModel", () => {
  it("projects public detail content without source references", () => {
    const detail = toMachineDetailPageModel(previewMachine);

    expect(detail.identity.slug).toBe("development-machine");
    expect(detail.quotationHref).toEqual({
      pathname: "/contact",
      query: { intent: "quotation", machine: "development-machine" },
    });
    expect("sourceReferences" in detail).toBe(false);
  });

  it("filters rejected technical values and omits empty groups without changing order", () => {
    const machine = {
      ...previewMachine,
      specifications: [
        {
          id: "visible-group",
          label: "Visible group",
          items: [
            {
              id: "visible-value-second",
              label: "Visible value second",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              sourceReferenceId: "internal-source-reference",
              verificationStatus: "development-placeholder" as const,
            },
            {
              id: "visible-value-first",
              label: "Visible value first",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              verificationStatus: "verified" as const,
            },
            {
              id: "rejected-value",
              label: "Rejected value",
              value: "rejected-value",
              verificationStatus: "rejected-or-superseded" as const,
            },
          ],
        },
        {
          id: "empty-group",
          label: "Empty group",
          items: [
            {
              id: "rejected-only-value",
              label: "Rejected only value",
              value: "rejected-only-value",
              verificationStatus: "rejected-or-superseded" as const,
            },
          ],
        },
        {
          id: "second-visible-group",
          label: "Second visible group",
          items: [
            {
              id: "second-group-value-second",
              label: "Second group value second",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              verificationStatus: "development-placeholder" as const,
            },
            {
              id: "second-group-value-first",
              label: "Second group value first",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              verificationStatus: "verified" as const,
            },
          ],
        },
      ],
      dimensions: [],
      hotspots: [
        {
          ...previewMachine.hotspots[0]!,
          technicalValues: [
            {
              id: "hotspot-visible-value",
              label: "Hotspot visible value",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              verificationStatus: "development-placeholder" as const,
            },
            {
              id: "hotspot-rejected-value",
              label: "Hotspot rejected value",
              value: "rejected-value",
              verificationStatus: "rejected-or-superseded" as const,
            },
          ],
        },
      ],
      documentation: [
        {
          id: "undated-document",
          title: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
          type: "datasheet" as const,
          language: "en",
          file: "/api/development-assets/undated-document.txt",
          publicationStatus: "development" as const,
        },
      ],
    };

    const detail = toMachineDetailPageModel(machine);

    expect(detail.specificationGroups.map((group) => group.id)).toEqual([
      "visible-group",
      "second-visible-group",
    ]);
    expect(detail.specificationGroups[0]?.items.map((item) => item.id)).toEqual([
      "visible-value-second",
      "visible-value-first",
    ]);
    expect(detail.specificationGroups[1]?.items.map((item) => item.id)).toEqual([
      "second-group-value-second",
      "second-group-value-first",
    ]);
    expect(detail.specificationGroups[0]?.items).toEqual([
      expect.objectContaining({ id: "visible-value-second" }),
      expect.objectContaining({ id: "visible-value-first" }),
    ]);
    expect(detail.specificationGroups[0]?.items[0]).not.toHaveProperty(
      "sourceReferenceId",
    );
    expect(detail.hotspots[0]?.technicalValues).toEqual([
      expect.objectContaining({ id: "hotspot-visible-value" }),
    ]);
    expect(JSON.stringify(detail)).not.toContain("rejected-value");
    expect(detail.documentation[0]).not.toHaveProperty("revision");
    expect(detail.documentation[0]).not.toHaveProperty("date");
  });
});

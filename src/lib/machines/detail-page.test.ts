import { describe, expect, it } from "vitest";

import { getMachinePreviewBySlug } from "./repository";
import { toMachineDetailPageModel } from "./detail-page";

const previewMachine = getMachinePreviewBySlug("development-machine");

if (!previewMachine) {
  throw new Error("Development machine fixture is unavailable.");
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
              id: "visible-value",
              label: "Visible value",
              value: "DEVELOPMENT PLACEHOLDER — NOT VERIFIED",
              verificationStatus: "development-placeholder" as const,
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

    expect(detail.specificationGroups).toHaveLength(1);
    expect(detail.specificationGroups[0]?.items).toEqual([
      expect.objectContaining({ id: "visible-value" }),
    ]);
    expect(detail.hotspots[0]?.technicalValues).toEqual([
      expect.objectContaining({ id: "hotspot-visible-value" }),
    ]);
    expect(JSON.stringify(detail)).not.toContain("rejected-value");
    expect(detail.documentation[0]).not.toHaveProperty("revision");
    expect(detail.documentation[0]).not.toHaveProperty("date");
  });
});

import { describe, expect, it } from "vitest";

import { machineRecords } from "@/content/machines/records";

import { toMachineCardSummary } from "./card-summary";

const machine = machineRecords[0];

if (!machine) {
  throw new Error("The machine catalogue fixture is unavailable in tests.");
}

describe("machine card summary", () => {
  it("projects only the fields rendered by machine cards", () => {
    const summary = toMachineCardSummary(machine);

    expect(Object.keys(summary)).toEqual([
      "slug",
      "name",
      "shortName",
      "category",
      "tagline",
      "heroImage",
      "publicationStatus",
    ]);
    expect(summary).toEqual({
      slug: machine.slug,
      name: machine.name,
      shortName: machine.shortName,
      category: machine.category,
      tagline: machine.tagline,
      heroImage: machine.heroImage,
      publicationStatus: machine.publicationStatus,
    });
  });
});

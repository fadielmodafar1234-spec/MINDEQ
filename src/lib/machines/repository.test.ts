import { afterEach, describe, expect, it, vi } from "vitest";

import { DEVELOPMENT_PLACEHOLDER_LABEL } from "./constants";
import {
  getFeaturedMachines,
  getMachineBySlug,
  getMachineForEnvironment,
  getMachinePreviewBySlug,
  getMachines,
  getMachinesForEnvironment,
  getPublishedMachineSlugs,
} from "./repository";
import { sortMachinesForCatalogue } from "./sorting";

const developmentSlug = "development-machine";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("machine repository publication boundaries", () => {
  it("excludes development records from published queries", () => {
    expect(getMachines()).toEqual([]);
    expect(getFeaturedMachines()).toEqual([]);
    expect(getMachineBySlug(developmentSlug)).toBeNull();
    expect(getPublishedMachineSlugs()).toEqual([]);
  });

  it("returns the development record through preview access in tests", () => {
    const machine = getMachinePreviewBySlug(developmentSlug);

    expect(machine?.slug).toBe(developmentSlug);
    expect(machine?.tagline).toBe(DEVELOPMENT_PLACEHOLDER_LABEL);
    expect(getMachineForEnvironment(developmentSlug)).toBe(machine);
    expect(getMachinesForEnvironment()).toEqual([machine]);
  });

  it("returns null for an unknown slug", () => {
    expect(getMachineBySlug("missing-machine")).toBeNull();
    expect(getMachinePreviewBySlug("missing-machine")).toBeNull();
    expect(getMachineForEnvironment("missing-machine")).toBeNull();
  });

  it("disables preview access in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getMachinePreviewBySlug(developmentSlug)).toBeNull();
    expect(getMachineForEnvironment(developmentSlug)).toBeNull();
    expect(getMachinesForEnvironment()).toEqual([]);
  });

  it("fails closed for an unknown runtime environment", () => {
    vi.stubEnv("NODE_ENV", "staging");

    expect(getMachinePreviewBySlug(developmentSlug)).toBeNull();
    expect(getMachineForEnvironment(developmentSlug)).toBeNull();
    expect(getMachinesForEnvironment()).toEqual([]);
  });

  it("returns immutable records and collections", () => {
    const machines = getMachinesForEnvironment();
    const machine = machines[0];

    expect(Object.isFrozen(machines)).toBe(true);
    expect(Object.isFrozen(machine)).toBe(true);
    expect(Object.isFrozen(machine?.heroImage)).toBe(true);
  });

  it("sorts by category order and then machine name without mutating input", () => {
    const fixture = getMachinePreviewBySlug(developmentSlug);
    expect(fixture).not.toBeNull();

    const categoryTwentyB = structuredClone(fixture!);
    categoryTwentyB.slug = "category-twenty-b";
    categoryTwentyB.name = "B Machine";
    categoryTwentyB.category.order = 20;

    const categoryTen = structuredClone(fixture!);
    categoryTen.slug = "category-ten";
    categoryTen.name = "Z Machine";
    categoryTen.category.order = 10;

    const categoryTwentyA = structuredClone(fixture!);
    categoryTwentyA.slug = "category-twenty-a";
    categoryTwentyA.name = "A Machine";
    categoryTwentyA.category.order = 20;

    const input = [categoryTwentyB, categoryTen, categoryTwentyA];
    const result = sortMachinesForCatalogue(input);

    expect(result.map((machine) => machine.slug)).toEqual([
      "category-ten",
      "category-twenty-a",
      "category-twenty-b",
    ]);
    expect(input[0]?.slug).toBe("category-twenty-b");
  });
});

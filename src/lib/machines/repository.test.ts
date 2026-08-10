import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEVELOPMENT_PLACEHOLDER_LABEL } from "./constants";
import { GET as getDevelopmentAsset } from "@/app/api/development-assets/[asset]/route";
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

const { notFoundMock, readFileMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error("not found");
  }),
  readFileMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({ readFile: readFileMock }));
vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

afterEach(() => {
  notFoundMock.mockClear();
  readFileMock.mockReset();
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

  it("populates every optional detail section with explicit development proof content", () => {
    const machine = getMachinePreviewBySlug(developmentSlug);

    expect(machine).not.toBeNull();
    expect(machine?.applications[0]?.description).toContain(
      DEVELOPMENT_PLACEHOLDER_LABEL,
    );
    expect(machine?.features[0]).toMatchObject({
      componentId: "inspection-head",
    });
    expect(machine?.features[0]?.description).toContain(
      DEVELOPMENT_PLACEHOLDER_LABEL,
    );
    expect(machine?.specifications[0]?.items[0]?.value).toBe(
      DEVELOPMENT_PLACEHOLDER_LABEL,
    );
    expect(machine?.dimensions[0]?.items[0]?.value).toBe(
      DEVELOPMENT_PLACEHOLDER_LABEL,
    );
    expect(machine?.dimensions[0]?.drawing?.src).toBe(
      "/placeholders/machine-poster.svg",
    );
    expect(
      machine?.hotspots.find(
        (hotspot) => hotspot.componentId === "inspection-head",
      )?.technicalValues?.[0]?.value,
    ).toBe(DEVELOPMENT_PLACEHOLDER_LABEL);
    expect(machine?.gallery[0]?.src).toBe(
      "/placeholders/machine-poster.svg",
    );
    expect(machine?.documentation[0]).toMatchObject({
      file: "/api/development-assets/development-machine.documentation.txt",
      publicationStatus: "development",
    });
    expect(machine?.documentation[0]).not.toHaveProperty("revision");
    expect(machine?.documentation[0]).not.toHaveProperty("date");
  });

  it("returns null for an unknown slug", () => {
    expect(getMachineBySlug("missing-machine")).toBeNull();
    expect(getMachinePreviewBySlug("missing-machine")).toBeNull();
    expect(getMachineForEnvironment("missing-machine")).toBeNull();
  });

  it("disables preview access in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getMachineBySlug(developmentSlug)).toBeNull();
    expect(getMachinePreviewBySlug(developmentSlug)).toBeNull();
    expect(getMachineForEnvironment(developmentSlug)).toBeNull();
    expect(getMachinesForEnvironment()).toEqual([]);
    expect(getPublishedMachineSlugs()).toEqual([]);
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

describe("development asset publication boundary", () => {
  it("serves only the registered development documentation fixture in tests", async () => {
    readFileMock.mockResolvedValue(
      Buffer.from(`${DEVELOPMENT_PLACEHOLDER_LABEL}\nSynthetic documentation fixture.\n`),
    );

    const response = await getDevelopmentAsset(
      new Request(
        "http://localhost/api/development-assets/development-machine.documentation.txt",
      ),
      {
        params: Promise.resolve({
          asset: "development-machine.documentation.txt",
        }),
      },
    );

    expect(await response.text()).toContain(DEVELOPMENT_PLACEHOLDER_LABEL);
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(readFileMock).toHaveBeenCalledWith(
      join(
        process.cwd(),
        ".mindeq-development-assets",
        "development-machine.documentation.txt",
      ),
    );
  });

  it("rejects unregistered asset input before reading the filesystem", async () => {
    await expect(
      getDevelopmentAsset(
        new Request("http://localhost/api/development-assets/unknown.txt"),
        { params: Promise.resolve({ asset: "../unknown.txt" }) },
      ),
    ).rejects.toThrow("not found");

    expect(readFileMock).not.toHaveBeenCalled();
  });

  it("returns not found for registered development assets in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await expect(
      getDevelopmentAsset(
        new Request(
          "http://localhost/api/development-assets/development-machine.documentation.txt",
        ),
        {
          params: Promise.resolve({
            asset: "development-machine.documentation.txt",
          }),
        },
      ),
    ).rejects.toThrow("not found");

    expect(readFileMock).not.toHaveBeenCalled();
  });
});

import { machineRecords } from "@/content/machines/records";

import { sortMachinesForCatalogue } from "./sorting";
import type { Machine } from "./types";

function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) {
    return value;
  }

  Object.values(value).forEach((nestedValue) => {
    deepFreeze(nestedValue);
  });

  return Object.freeze(value);
}

const allMachines: readonly Machine[] = deepFreeze(
  sortMachinesForCatalogue(machineRecords),
);
const publishedMachines: readonly Machine[] = deepFreeze(
  allMachines.filter((machine) => machine.publicationStatus === "published"),
);
const featuredMachines: readonly Machine[] = deepFreeze(
  publishedMachines.filter((machine) => machine.featured),
);
const publishedMachineSlugs: readonly string[] = deepFreeze(
  publishedMachines.map((machine) => machine.slug),
);
const allMachinesBySlug = new Map(
  allMachines.map((machine) => [machine.slug, machine] as const),
);
const publishedMachinesBySlug = new Map(
  publishedMachines.map((machine) => [machine.slug, machine] as const),
);

function isContentPreviewEnabled() {
  return (
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
  );
}

export function getMachines(): readonly Machine[] {
  return publishedMachines;
}

export function getFeaturedMachines(): readonly Machine[] {
  return featuredMachines;
}

export function getMachineBySlug(slug: string): Machine | null {
  return publishedMachinesBySlug.get(slug) ?? null;
}

export function getMachinePreviewBySlug(slug: string): Machine | null {
  if (!isContentPreviewEnabled()) {
    return null;
  }

  const machine = allMachinesBySlug.get(slug);

  return machine?.publicationStatus !== "published" ? (machine ?? null) : null;
}

export function getPublishedMachineSlugs(): readonly string[] {
  return publishedMachineSlugs;
}

export function getMachinesForEnvironment(): readonly Machine[] {
  return isContentPreviewEnabled() ? allMachines : publishedMachines;
}

export function getMachineForEnvironment(slug: string): Machine | null {
  return getMachineBySlug(slug) ?? getMachinePreviewBySlug(slug);
}

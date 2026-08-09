import type { Machine } from "./types";

export type MachineCardSummary = Pick<
  Machine,
  | "slug"
  | "name"
  | "shortName"
  | "category"
  | "tagline"
  | "heroImage"
  | "publicationStatus"
>;

export function toMachineCardSummary(
  machine: Machine,
): MachineCardSummary {
  return {
    slug: machine.slug,
    name: machine.name,
    shortName: machine.shortName,
    category: machine.category,
    tagline: machine.tagline,
    heroImage: machine.heroImage,
    publicationStatus: machine.publicationStatus,
  };
}

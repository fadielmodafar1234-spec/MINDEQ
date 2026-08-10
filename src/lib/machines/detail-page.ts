import type { Machine } from "./types";

type MachineTechnicalItem =
  Machine["specifications"][number]["items"][number];

export type MachineDetailTechnicalItem = Readonly<
  Omit<MachineTechnicalItem, "sourceReferenceId">
>;

export type MachineDetailTechnicalGroup = Readonly<{
  id: string;
  label: string;
  items: readonly MachineDetailTechnicalItem[];
}>;

export type MachineDetailDimensionGroup = MachineDetailTechnicalGroup &
  Readonly<{
    drawing?: Machine["dimensions"][number]["drawing"];
  }>;

export type MachineDetailHotspot = Readonly<
  Omit<Machine["hotspots"][number], "technicalValues">
> &
  Readonly<{
    technicalValues?: readonly MachineDetailTechnicalItem[];
  }>;

export type MachineDetailDocumentation = Readonly<
  Pick<
    Machine["documentation"][number],
    "id" | "title" | "type" | "language" | "file" | "revision" | "date"
  >
>;

export type MachineDetailPageModel = Readonly<{
  identity: Readonly<{
    slug: string;
    name: string;
    category: string;
    tagline?: string;
    publicationStatus: Machine["publicationStatus"];
  }>;
  overview: string;
  poster: Machine["heroImage"];
  applications: Machine["applications"];
  features: Machine["features"];
  specificationGroups: readonly MachineDetailTechnicalGroup[];
  dimensionGroups: readonly MachineDetailDimensionGroup[];
  hotspots: readonly MachineDetailHotspot[];
  gallery: Machine["gallery"];
  documentation: readonly MachineDetailDocumentation[];
  quotationHref: Readonly<{
    pathname: "/contact";
    query: Readonly<{
      intent: "quotation";
      machine: string;
    }>;
  }>;
}>;

function isPresentableTechnicalItem(item: MachineTechnicalItem): boolean {
  return item.verificationStatus !== "rejected-or-superseded";
}

function toMachineDetailTechnicalItem(
  item: MachineTechnicalItem,
): MachineDetailTechnicalItem {
  const { sourceReferenceId, ...publicItem } = item;

  void sourceReferenceId;

  return publicItem;
}

function filterGroups(
  groups: Machine["specifications"] | Machine["dimensions"],
): readonly MachineDetailDimensionGroup[] {
  return groups.flatMap((group) => {
    const items = group.items
      .filter(isPresentableTechnicalItem)
      .map(toMachineDetailTechnicalItem);

    return items.length > 0
      ? [
          {
            id: group.id,
            label: group.label,
            items,
            ...("drawing" in group && group.drawing
              ? { drawing: group.drawing }
              : {}),
          },
        ]
      : [];
  });
}

function filterHotspotValues(
  hotspot: Machine["hotspots"][number],
): MachineDetailHotspot {
  const { technicalValues, ...publicHotspot } = hotspot;

  return {
    ...publicHotspot,
    ...(technicalValues
      ? {
          technicalValues: technicalValues
            .filter(isPresentableTechnicalItem)
            .map(toMachineDetailTechnicalItem),
        }
      : {}),
  };
}

function toMachineDetailDocumentation(
  documentation: Machine["documentation"][number],
): MachineDetailDocumentation {
  const { id, title, type, language, file, revision, date } = documentation;

  return {
    id,
    title,
    type,
    language,
    file,
    ...(revision ? { revision } : {}),
    ...(date ? { date } : {}),
  };
}

export function toMachineDetailPageModel(
  machine: Machine,
): MachineDetailPageModel {
  return {
    identity: {
      slug: machine.slug,
      name: machine.name,
      category: machine.category.label,
      ...(machine.tagline ? { tagline: machine.tagline } : {}),
      publicationStatus: machine.publicationStatus,
    },
    overview: machine.description,
    poster: machine.modelPoster ?? machine.heroImage,
    applications: machine.applications,
    features: machine.features,
    specificationGroups: filterGroups(machine.specifications),
    dimensionGroups: filterGroups(machine.dimensions),
    hotspots: machine.hotspots.map(filterHotspotValues),
    gallery: machine.gallery,
    documentation: machine.documentation.map(toMachineDetailDocumentation),
    quotationHref: {
      pathname: "/contact",
      query: { intent: "quotation", machine: machine.slug },
    },
  };
}

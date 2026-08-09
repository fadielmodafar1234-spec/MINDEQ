import { machineCategories } from "@/content/machines/categories";
import { DEVELOPMENT_PLACEHOLDER_LABEL } from "@/lib/machines/constants";
import type { MachineInput } from "@/lib/machines/types";

export const developmentMachine = {
  slug: "development-machine",
  name: "Development Machine",
  shortName: "Development Machine",
  category: machineCategories.customEngineering,
  tagline: DEVELOPMENT_PLACEHOLDER_LABEL,
  description: `${DEVELOPMENT_PLACEHOLDER_LABEL}. This synthetic record validates the reusable machine page and data architecture. It is not a real MINDEQ product.`,
  applications: [],
  features: [],
  specifications: [],
  dimensions: [],
  heroImage: {
    id: "development-machine-hero",
    src: "/placeholders/machine-poster.svg",
    alt: "Development placeholder graphic; not a real MINDEQ machine.",
    width: 1600,
    height: 900,
    publicationStatus: "development",
  },
  gallery: [],
  model: null,
  modelMobile: null,
  modelPoster: null,
  hotspots: [],
  documentation: [],
  seo: {
    title: DEVELOPMENT_PLACEHOLDER_LABEL,
    description:
      "Development-only record used to validate the MINDEQ machine page architecture.",
    canonicalPath: "/machines/development-machine",
    noIndex: true,
  },
  publicationStatus: "development",
  featured: false,
  sourceReferences: [
    {
      id: "development-machine-source",
      type: "development-placeholder",
      title: "Task 03 development fixture",
      location: "src/content/machines/development-machine.ts",
      approvalState: "development",
      approvalNote: "Synthetic architecture fixture; not publication content.",
    },
  ],
} as const satisfies MachineInput;

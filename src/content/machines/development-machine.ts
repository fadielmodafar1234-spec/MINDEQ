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
  model: {
    id: "development-machine-viewer-model",
    src: "/api/development-assets/development-machine.viewer.glb",
    variant: "viewer",
    fileBytes: 14212,
    componentIds: ["base", "tower", "inspection-head", "side-guard"],
    componentMapVersion: "development-v1",
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    cameraPreset: {
      position: [4, 2.8, 5],
      target: [0, 0.9, 0],
      fov: 36,
    },
    qualityNotes:
      "Synthetic local GLB generated only for the Task 07 development pipeline.",
    publicationStatus: "development",
  },
  modelMobile: null,
  modelPoster: {
    id: "development-machine-model-poster",
    src: "/placeholders/machine-poster.svg",
    alt: "Development placeholder graphic shown while the synthetic 3D model loads.",
    width: 1600,
    height: 900,
    publicationStatus: "development",
  },
  hotspots: [
    {
      id: "development-inspection-head-hotspot",
      label: "Development component A",
      description:
        "DEVELOPMENT PLACEHOLDER — NOT VERIFIED. Synthetic hotspot used to verify component selection.",
      position: [0.4, 1.45, 0.15],
      componentId: "inspection-head",
    },
    {
      id: "development-base-hotspot",
      label: "Development component B",
      description:
        "DEVELOPMENT PLACEHOLDER — NOT VERIFIED. Synthetic hotspot used to verify model-local positioning.",
      position: [-0.7, 0.35, 0.5],
      componentId: "base",
    },
  ],
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

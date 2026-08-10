import type { HomepageSceneConfig } from "@/components/homepage-scene/types";

import { DEFAULT_VIEWER_LIGHTING } from "./viewer-config";
import { getMachinePreviewBySlug } from "./repository";
import type { Machine } from "./types";

const DEVELOPMENT_COMPONENTS = {
  base: {
    initialVisible: true,
  },
  tower: {
    initialVisible: true,
    explosion: { direction: [-1, 0.15, 0], distance: 0.45 },
  },
  "inspection-head": {
    initialVisible: true,
    explosion: { direction: [0.8, 0.25, 0], distance: 0.65 },
    materialStates: {
      approved: {
        color: "#9a5228",
        emissive: "#30160a",
        emissiveIntensity: 0.15,
      },
    },
  },
  "side-guard": {
    initialVisible: true,
    explosion: { direction: [1, 0, 0], distance: 0.55 },
  },
} as const;

type DevelopmentComponentId = keyof typeof DEVELOPMENT_COMPONENTS;

export function createDevelopmentHomepageSceneConfig(
  machine: Machine | null,
  environment: string | undefined = process.env.NODE_ENV,
): HomepageSceneConfig<DevelopmentComponentId> | null {
  if (
    environment === "production" ||
    !machine?.model ||
    machine.publicationStatus !== "development"
  ) {
    return null;
  }

  const componentIds = machine.model.componentIds;
  const requiredComponentIds = Object.keys(
    DEVELOPMENT_COMPONENTS,
  ) as DevelopmentComponentId[];

  if (
    requiredComponentIds.some(
      (componentId) => !componentIds.includes(componentId),
    )
  ) {
    return null;
  }

  const cameraPreset = machine.model.cameraPreset ?? {
    position: [4.6, 3.4, 5.8],
    target: [0, 1.05, 0],
    fov: 34,
  };
  const transform = machine.model.transform ?? {
    position: [0.3, -0.1, 0],
    rotation: [0, 0.38, 0],
    scale: [1.08, 1.08, 1.08],
  };

  return {
    id: "development-homepage-scene",
    ariaLabel: "Development-only homepage 3D control-system preview",
    model: {
      src: machine.model.src,
      ...(machine.modelMobile ? { mobileSrc: machine.modelMobile.src } : {}),
      componentMap: Object.fromEntries(
        requiredComponentIds.map((componentId) => [componentId, componentId]),
      ) as Record<DevelopmentComponentId, string>,
    },
    camera: {
      position: cameraPreset.position,
      target: cameraPreset.target,
      fov: cameraPreset.fov,
      near: 0.1,
      far: 100,
    },
    machine: {
      position: transform.position,
      rotation: transform.rotation,
      scale: transform.scale,
    },
    lighting: DEFAULT_VIEWER_LIGHTING,
    components: DEVELOPMENT_COMPONENTS,
    initialState: {
      explosionProgress: 0,
      highlightedComponentId: null,
      materialStates: {
        base: null,
        tower: null,
        "inspection-head": null,
        "side-guard": null,
      },
    },
    highlighting: {
      color: "#c2672e",
      strength: 0.5,
    },
    quality: {
      mode: "auto",
      desktopDpr: [1, 1.75],
      mobileDpr: [1, 1.25],
      desktopShadows: true,
      mobileShadows: false,
      mobileBehavior: "reduced",
    },
    reducedMotion: {
      behavior: "poster",
    },
  };
}

export function getDevelopmentHomepageSceneConfig(): HomepageSceneConfig | null {
  return createDevelopmentHomepageSceneConfig(
    getMachinePreviewBySlug("development-machine"),
  );
}

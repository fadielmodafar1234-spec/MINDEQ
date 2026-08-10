import type {
  MachineViewerConfig,
  ViewerCameraConfig,
  ViewerLightingConfig,
} from "@/components/machine-viewer/types";

import type { Machine } from "./types";

const DEFAULT_CAMERA: ViewerCameraConfig = {
  position: [4, 2.8, 5],
  target: [0, 1, 0],
  fov: 38,
  near: 0.1,
  far: 100,
};

export const DEFAULT_VIEWER_LIGHTING: ViewerLightingConfig = {
  ambient: {
    color: "#ffffff",
    intensity: 0.75,
  },
  hemisphere: {
    skyColor: "#dce7e9",
    groundColor: "#464a46",
    intensity: 1.1,
  },
  directional: [
    {
      id: "viewer-key",
      color: "#ffffff",
      intensity: 3.2,
      position: [4, 6, 5],
      castShadow: true,
    },
    {
      id: "viewer-fill",
      color: "#b9d3d8",
      intensity: 1.4,
      position: [-4, 3, -2],
    },
  ],
};

type ViewerConfigOverrides = Readonly<{
  lighting?: ViewerLightingConfig;
  qualityMode?: "auto" | "desktop" | "mobile";
}>;

export function createMachineViewerConfig(
  machine: Machine,
  overrides: ViewerConfigOverrides = {},
): MachineViewerConfig | null {
  if (!machine.model || !machine.modelPoster) {
    return null;
  }

  const transform = machine.model.transform ?? {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  };
  const cameraPreset = machine.model.cameraPreset ?? DEFAULT_CAMERA;

  return {
    id: `${machine.slug}-viewer`,
    ariaLabel: `Interactive 3D viewer for ${machine.name}`,
    instructions:
      "Drag to rotate. Use the wheel or pinch gesture to zoom. Use Reset view to restore the starting camera.",
    model: {
      src: machine.model.src,
      ...(machine.modelMobile ? { mobileSrc: machine.modelMobile.src } : {}),
      position: transform.position,
      rotation: transform.rotation,
      scale: transform.scale,
      componentMap: Object.fromEntries(
        machine.model.componentIds.map((componentId) => [
          componentId,
          componentId,
        ]),
      ),
    },
    poster: {
      src: machine.modelPoster.src,
      alt: machine.modelPoster.alt,
      width: machine.modelPoster.width,
      height: machine.modelPoster.height,
      priority: true,
    },
    camera: {
      position: cameraPreset.position,
      target: cameraPreset.target,
      fov: cameraPreset.fov,
      near: DEFAULT_CAMERA.near,
      far: DEFAULT_CAMERA.far,
    },
    controls: {
      minDistance: 2.8,
      maxDistance: 9,
      minPolarAngle: Math.PI * 0.12,
      maxPolarAngle: Math.PI * 0.48,
      minAzimuthAngle: -Infinity,
      maxAzimuthAngle: Infinity,
      rotateSpeed: 0.65,
      zoomSpeed: 0.8,
      enablePan: false,
    },
    lighting: overrides.lighting ?? DEFAULT_VIEWER_LIGHTING,
    hotspots: machine.hotspots.map((hotspot) => ({
      id: hotspot.id,
      label: hotspot.label,
      description: hotspot.description,
      position: hotspot.position,
      ...(hotspot.componentId ? { componentId: hotspot.componentId } : {}),
    })),
    quality: {
      mode: overrides.qualityMode ?? "auto",
      desktopDpr: [1, 1.75],
      mobileDpr: [1, 1.25],
      desktopShadows: true,
      mobileShadows: false,
    },
    highlighting: {
      enabled: true,
      color: "#c2672e",
      strength: 0.5,
    },
    wireframe: {
      enabled: true,
    },
    explodedView: {
      enabled: true,
      parts: [],
    },
    fullscreen: {
      enabled: true,
    },
  };
}

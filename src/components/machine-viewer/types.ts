export type ViewerVector3 = readonly [number, number, number];

export type ViewerCameraConfig = Readonly<{
  position: ViewerVector3;
  target: ViewerVector3;
  fov: number;
  near: number;
  far: number;
}>;

export type ViewerControlsConfig = Readonly<{
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  rotateSpeed: number;
  zoomSpeed: number;
  enablePan: boolean;
}>;

export type ViewerDirectionalLightConfig = Readonly<{
  id: string;
  color: string;
  intensity: number;
  position: ViewerVector3;
  castShadow?: boolean;
}>;

export type ViewerLightingConfig = Readonly<{
  ambient?: Readonly<{
    color: string;
    intensity: number;
  }>;
  hemisphere?: Readonly<{
    skyColor: string;
    groundColor: string;
    intensity: number;
  }>;
  directional: readonly ViewerDirectionalLightConfig[];
}>;

export type ViewerHotspotConfig = Readonly<{
  id: string;
  label: string;
  description: string;
  position: ViewerVector3;
  componentId?: string;
}>;

export type ViewerExplodedPartConfig = Readonly<{
  componentId: string;
  direction: ViewerVector3;
  distance: number;
}>;

export type ViewerDpr = number | readonly [number, number];

export type MachineViewerConfig = Readonly<{
  id: string;
  ariaLabel: string;
  instructions: string;
  model: Readonly<{
    src: string;
    mobileSrc?: string;
    dracoDecoderPath?: string;
    useMeshopt?: boolean;
    position: ViewerVector3;
    rotation: ViewerVector3;
    scale: ViewerVector3;
    componentMap?: Readonly<Record<string, string>>;
  }>;
  poster: Readonly<{
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
  }>;
  camera: ViewerCameraConfig;
  controls: ViewerControlsConfig;
  lighting: ViewerLightingConfig;
  hotspots: readonly ViewerHotspotConfig[];
  quality: Readonly<{
    mode: "auto" | "desktop" | "mobile";
    desktopDpr: ViewerDpr;
    mobileDpr: ViewerDpr;
    desktopShadows: boolean;
    mobileShadows: boolean;
  }>;
  highlighting?: Readonly<{
    enabled: boolean;
    color: string;
    strength: number;
  }>;
  wireframe?: Readonly<{
    enabled: boolean;
  }>;
  explodedView?: Readonly<{
    enabled: boolean;
    parts: readonly ViewerExplodedPartConfig[];
  }>;
  fullscreen?: Readonly<{
    enabled: boolean;
  }>;
}>;

export type MachineViewerProps = Readonly<{
  config: MachineViewerConfig;
  className?: string;
  highlightedComponentId?: string | null;
  mode?: "standard" | "wireframe";
  explosionProgress?: number;
}>;

import type {
  ViewerCameraConfig,
  ViewerDpr,
  ViewerLightingConfig,
  ViewerVector3,
} from "@/components/machine-viewer/types";

export type HomepageMaterialState = Readonly<{
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  opacity?: number;
  roughness?: number;
}>;

export type HomepageSceneComponentConfig = Readonly<{
  initialVisible: boolean;
  explosion?: Readonly<{
    direction: ViewerVector3;
    distance: number;
  }>;
  materialStates?: Readonly<Record<string, HomepageMaterialState>>;
}>;

export type HomepageSceneConfig<ComponentId extends string = string> = Readonly<{
  id: string;
  ariaLabel: string;
  model: Readonly<{
    src: string;
    mobileSrc?: string;
    dracoDecoderPath?: string;
    useMeshopt?: boolean;
    componentMap: Readonly<Record<ComponentId, string>>;
  }>;
  camera: ViewerCameraConfig;
  machine: Readonly<{
    position: ViewerVector3;
    rotation: ViewerVector3;
    scale: ViewerVector3;
  }>;
  lighting: ViewerLightingConfig;
  components: Readonly<Record<ComponentId, HomepageSceneComponentConfig>>;
  initialState: Readonly<{
    explosionProgress: number;
    highlightedComponentId: ComponentId | null;
    materialStates: Readonly<Partial<Record<ComponentId, string | null>>>;
  }>;
  highlighting: Readonly<{
    color: string;
    strength: number;
  }>;
  quality: Readonly<{
    mode: "auto" | "desktop" | "mobile";
    desktopDpr: ViewerDpr;
    mobileDpr: ViewerDpr;
    desktopShadows: boolean;
    mobileShadows: boolean;
    mobileBehavior: "reduced" | "poster";
  }>;
  reducedMotion: Readonly<{
    behavior: "stable-scene" | "poster";
  }>;
}>;

export interface HomepageSceneController<ComponentId extends string = string> {
  setCameraPosition(position: ViewerVector3): void;
  setCameraTarget(target: ViewerVector3): void;
  setMachinePosition(position: ViewerVector3): void;
  setMachineRotation(rotation: ViewerVector3): void;
  setMachineScale(scale: ViewerVector3): void;
  setExplosionProgress(progress: number): void;
  setComponentVisibility(componentId: ComponentId, visible: boolean): boolean;
  setHighlightedComponent(componentId: ComponentId | null): boolean;
  setMaterialState(componentId: ComponentId, state: string | null): boolean;
  reset(): void;
}

export type HomepageSceneStageProps = Readonly<{
  config: HomepageSceneConfig | null;
  className?: string;
}>;

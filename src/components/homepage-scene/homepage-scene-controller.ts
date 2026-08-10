import {
  Color,
  Material,
  Mesh,
  Object3D,
  Vector3,
} from "three";
import type { Group, PerspectiveCamera } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import { clampExplosionProgress, disposeOwnedMaterials } from "@/components/machine-viewer/resource-lifecycle";

import type {
  HomepageMaterialState,
  HomepageSceneConfig,
  HomepageSceneController,
} from "./types";

type AdjustableMaterial = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
  opacity?: number;
  roughness?: number;
  transparent?: boolean;
};

type MaterialSnapshot = Readonly<{
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
  opacity?: number;
  roughness?: number;
  transparent?: boolean;
}>;

type RuntimeInput<ComponentId extends string> = Readonly<{
  camera: PerspectiveCamera;
  config: HomepageSceneConfig<ComponentId>;
  invalidate: () => void;
  source: Group;
}>;

export type HomepageSceneRuntime<ComponentId extends string = string> = Readonly<{
  cameraTarget: Vector3;
  controller: HomepageSceneController<ComponentId>;
  dispose: () => void;
  scene: Group;
}>;

function snapshotMaterial(material: AdjustableMaterial): MaterialSnapshot {
  return {
    ...(material.color instanceof Color ? { color: material.color.clone() } : {}),
    ...(material.emissive instanceof Color
      ? { emissive: material.emissive.clone() }
      : {}),
    ...(typeof material.emissiveIntensity === "number"
      ? { emissiveIntensity: material.emissiveIntensity }
      : {}),
    ...(typeof material.metalness === "number"
      ? { metalness: material.metalness }
      : {}),
    ...(typeof material.opacity === "number" ? { opacity: material.opacity } : {}),
    ...(typeof material.roughness === "number"
      ? { roughness: material.roughness }
      : {}),
    ...(typeof material.transparent === "boolean"
      ? { transparent: material.transparent }
      : {}),
  };
}

function restoreMaterial(
  material: AdjustableMaterial,
  snapshot: MaterialSnapshot,
): void {
  if (material.color && snapshot.color) material.color.copy(snapshot.color);
  if (material.emissive && snapshot.emissive) {
    material.emissive.copy(snapshot.emissive);
  }
  if (snapshot.emissiveIntensity !== undefined) {
    material.emissiveIntensity = snapshot.emissiveIntensity;
  }
  if (snapshot.metalness !== undefined) material.metalness = snapshot.metalness;
  if (snapshot.opacity !== undefined) material.opacity = snapshot.opacity;
  if (snapshot.roughness !== undefined) material.roughness = snapshot.roughness;
  if (snapshot.transparent !== undefined) {
    material.transparent = snapshot.transparent;
  }
}

function applyMaterialState(
  material: AdjustableMaterial,
  state: HomepageMaterialState,
): void {
  if (state.color && material.color) material.color.set(state.color);
  if (state.emissive && material.emissive) material.emissive.set(state.emissive);
  if (state.emissiveIntensity !== undefined) {
    material.emissiveIntensity = state.emissiveIntensity;
  }
  if (state.metalness !== undefined && material.metalness !== undefined) {
    material.metalness = state.metalness;
  }
  if (state.opacity !== undefined && material.opacity !== undefined) {
    material.opacity = state.opacity;
    material.transparent = state.opacity < 1;
  }
  if (state.roughness !== undefined && material.roughness !== undefined) {
    material.roughness = state.roughness;
  }
}

function visitMaterials(node: Object3D, visit: (material: AdjustableMaterial) => void) {
  node.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => visit(material as AdjustableMaterial));
  });
}

export function createHomepageSceneRuntime<ComponentId extends string>({
  camera,
  config,
  invalidate,
  source,
}: RuntimeInput<ComponentId>): HomepageSceneRuntime<ComponentId> {
  const scene = cloneSkeleton(source) as Group;
  const nodesByName = new Map<string, Object3D>();
  const ownedMaterials = new Set<Material>();
  const materialSnapshots = new Map<AdjustableMaterial, MaterialSnapshot>();
  const basePositions = new Map<ComponentId, Vector3>();
  const componentNodes = new Map<ComponentId, Object3D>();
  const materialStates = new Map<ComponentId, string | null>();
  const cameraTarget = new Vector3();
  let highlightedComponentId: ComponentId | null = null;
  let disposed = false;

  scene.traverse((node) => {
    if (node.name) nodesByName.set(node.name, node);
    if (!(node instanceof Mesh)) return;

    const sourceMaterials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    const clonedMaterials = sourceMaterials.map((sourceMaterial) => {
      const material = sourceMaterial.clone() as AdjustableMaterial;
      ownedMaterials.add(material);
      materialSnapshots.set(material, snapshotMaterial(material));
      return material;
    });
    node.material = Array.isArray(node.material)
      ? clonedMaterials
      : clonedMaterials[0]!;
  });

  for (const componentId of Object.keys(config.components) as ComponentId[]) {
    const node = nodesByName.get(config.model.componentMap[componentId]);
    if (!node) continue;
    componentNodes.set(componentId, node);
    basePositions.set(componentId, node.position.clone());
  }

  const invalidateIfMounted = () => {
    if (!disposed) invalidate();
  };

  const updateCamera = () => {
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld();
    invalidateIfMounted();
  };

  const refreshMaterials = () => {
    materialSnapshots.forEach((snapshot, material) => {
      restoreMaterial(material, snapshot);
    });

    materialStates.forEach((stateName, componentId) => {
      if (!stateName) return;
      const component = config.components[componentId];
      const node = componentNodes.get(componentId);
      const state = component.materialStates?.[stateName];
      if (!node || !state) return;
      visitMaterials(node, (material) => applyMaterialState(material, state));
    });

    if (highlightedComponentId) {
      const highlightedNode = componentNodes.get(highlightedComponentId);
      if (highlightedNode) {
        const highlightColor = new Color(config.highlighting.color);
        visitMaterials(highlightedNode, (material) => {
          material.color?.lerp(highlightColor, config.highlighting.strength);
          if (material.emissive) {
            material.emissive.copy(highlightColor);
            material.emissiveIntensity = config.highlighting.strength;
          }
        });
      }
    }

    invalidateIfMounted();
  };

  const setExplosionProgress = (progress: number) => {
    const clampedProgress = clampExplosionProgress(progress);
    for (const componentId of Object.keys(config.components) as ComponentId[]) {
      const node = componentNodes.get(componentId);
      const basePosition = basePositions.get(componentId);
      const explosion = config.components[componentId].explosion;
      if (!node || !basePosition) continue;

      node.position.copy(basePosition);
      if (explosion) {
        node.position.addScaledVector(
          new Vector3(...explosion.direction).normalize(),
          explosion.distance * clampedProgress,
        );
      }
    }
    invalidateIfMounted();
  };

  const reset = () => {
    camera.position.set(...config.camera.position);
    camera.fov = config.camera.fov;
    camera.near = config.camera.near;
    camera.far = config.camera.far;
    camera.updateProjectionMatrix();
    cameraTarget.set(...config.camera.target);
    camera.lookAt(cameraTarget);

    scene.position.set(...config.machine.position);
    scene.rotation.set(...config.machine.rotation);
    scene.scale.set(...config.machine.scale);

    materialStates.clear();
    for (const componentId of Object.keys(config.components) as ComponentId[]) {
      const node = componentNodes.get(componentId);
      if (node) node.visible = config.components[componentId].initialVisible;
      materialStates.set(
        componentId,
        config.initialState.materialStates[componentId] ?? null,
      );
    }
    highlightedComponentId = config.initialState.highlightedComponentId;
    setExplosionProgress(config.initialState.explosionProgress);
    refreshMaterials();
    camera.updateMatrixWorld();
    invalidateIfMounted();
  };

  const controller: HomepageSceneController<ComponentId> = {
    setCameraPosition(position) {
      camera.position.set(...position);
      updateCamera();
    },
    setCameraTarget(target) {
      cameraTarget.set(...target);
      updateCamera();
    },
    setMachinePosition(position) {
      scene.position.set(...position);
      invalidateIfMounted();
    },
    setMachineRotation(rotation) {
      scene.rotation.set(...rotation);
      invalidateIfMounted();
    },
    setMachineScale(scale) {
      scene.scale.set(...scale);
      invalidateIfMounted();
    },
    setExplosionProgress,
    setComponentVisibility(componentId, visible) {
      const node = componentNodes.get(componentId);
      if (!node) return false;
      node.visible = visible;
      invalidateIfMounted();
      return true;
    },
    setHighlightedComponent(componentId) {
      if (componentId !== null && !componentNodes.has(componentId)) return false;
      highlightedComponentId = componentId;
      refreshMaterials();
      return true;
    },
    setMaterialState(componentId, state) {
      const component = config.components[componentId];
      if (!componentNodes.has(componentId)) return false;
      if (state !== null && !component.materialStates?.[state]) return false;
      materialStates.set(componentId, state);
      refreshMaterials();
      return true;
    },
    reset,
  };

  reset();

  return {
    cameraTarget,
    controller,
    dispose() {
      if (disposed) return;
      disposed = true;
      disposeOwnedMaterials(ownedMaterials);
    },
    scene,
  };
}

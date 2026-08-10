"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { memo, Suspense, useEffect, useMemo, useRef } from "react";
import type { ComponentRef } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  Material,
  Mesh,
  Object3D,
  Vector3,
} from "three";
import type { Group } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import {
  clampExplosionProgress,
  disposeOwnedMaterials,
  limitViewerDpr,
} from "./resource-lifecycle";
import type { MachineViewerConfig } from "./types";

type MachineViewerCanvasProps = Readonly<{
  active: boolean;
  config: MachineViewerConfig;
  explosionProgress: number;
  highlightedComponentId: string | null;
  isMobileQuality: boolean;
  mode: "standard" | "wireframe";
  modelSrc: string;
  onContextFailure: () => void;
  onHotspotSelect: (hotspotId: string) => void;
  onReady: () => void;
  prefersReducedMotion: boolean;
  resetSignal: number;
}>;

type AdjustableMaterial = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  wireframe?: boolean;
};

type MaterialSnapshot = Readonly<{
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  wireframe?: boolean;
}>;

type ModelInstance = Readonly<{
  scene: Group;
  nodesByName: ReadonlyMap<string, Object3D>;
  ownedMaterials: ReadonlySet<Material>;
  snapshots: ReadonlyMap<AdjustableMaterial, MaterialSnapshot>;
  basePositions: ReadonlyMap<Object3D, Vector3>;
}>;

function cloneModelScene(source: Group): ModelInstance {
  const scene = cloneSkeleton(source) as Group;
  const nodesByName = new Map<string, Object3D>();
  const ownedMaterials = new Set<Material>();
  const snapshots = new Map<AdjustableMaterial, MaterialSnapshot>();
  const basePositions = new Map<Object3D, Vector3>();

  scene.traverse((node) => {
    if (node.name) {
      nodesByName.set(node.name, node);
      basePositions.set(node, node.position.clone());
    }

    if (!(node instanceof Mesh)) {
      return;
    }

    const sourceMaterials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    const clonedMaterials = sourceMaterials.map((sourceMaterial) => {
      const material = sourceMaterial.clone() as AdjustableMaterial;
      const snapshot: {
        color?: Color;
        emissive?: Color;
        emissiveIntensity?: number;
        wireframe?: boolean;
      } = {};

      if (material.color instanceof Color) {
        snapshot.color = material.color.clone();
      }
      if (material.emissive instanceof Color) {
        snapshot.emissive = material.emissive.clone();
      }
      if (typeof material.emissiveIntensity === "number") {
        snapshot.emissiveIntensity = material.emissiveIntensity;
      }
      if (typeof material.wireframe === "boolean") {
        snapshot.wireframe = material.wireframe;
      }

      ownedMaterials.add(material);
      snapshots.set(material, snapshot);

      return material;
    });

    node.material = Array.isArray(node.material)
      ? clonedMaterials
      : clonedMaterials[0]!;
  });

  return {
    scene,
    nodesByName,
    ownedMaterials,
    snapshots,
    basePositions,
  };
}

function resolveComponentNode(
  instance: ModelInstance,
  config: MachineViewerConfig,
  componentId: string,
): Object3D | undefined {
  const nodeName = config.model.componentMap?.[componentId] ?? componentId;

  return instance.nodesByName.get(nodeName);
}

function restoreMaterial(
  material: AdjustableMaterial,
  snapshot: MaterialSnapshot,
) {
  if (material.color && snapshot.color) {
    material.color.copy(snapshot.color);
  }
  if (material.emissive && snapshot.emissive) {
    material.emissive.copy(snapshot.emissive);
  }
  if (
    typeof material.emissiveIntensity === "number" &&
    typeof snapshot.emissiveIntensity === "number"
  ) {
    material.emissiveIntensity = snapshot.emissiveIntensity;
  }
  if (
    typeof material.wireframe === "boolean" &&
    typeof snapshot.wireframe === "boolean"
  ) {
    const wireframeChanged = material.wireframe !== snapshot.wireframe;
    material.wireframe = snapshot.wireframe;
    material.needsUpdate = material.needsUpdate || wireframeChanged;
  }
}

function ModelScene({
  config,
  explosionProgress,
  highlightedComponentId,
  mode,
  modelSrc,
  onHotspotSelect,
  onReady,
}: Pick<
  MachineViewerCanvasProps,
  | "config"
  | "explosionProgress"
  | "highlightedComponentId"
  | "mode"
  | "modelSrc"
  | "onHotspotSelect"
  | "onReady"
>) {
  const gltf = useGLTF(
    modelSrc,
    config.model.dracoDecoderPath ?? false,
    config.model.useMeshopt ?? true,
  );
  const instance = useMemo(() => cloneModelScene(gltf.scene), [gltf.scene]);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(
    () => () => {
      disposeOwnedMaterials(instance.ownedMaterials);
    },
    [instance.ownedMaterials],
  );

  useEffect(() => {
    instance.snapshots.forEach((snapshot, material) => {
      restoreMaterial(material, snapshot);
      if (mode === "wireframe" && config.wireframe?.enabled) {
        material.wireframe = true;
        material.needsUpdate = true;
      }
    });

    if (highlightedComponentId && config.highlighting?.enabled) {
      const component = resolveComponentNode(
        instance,
        config,
        highlightedComponentId,
      );
      const highlightColor = new Color(config.highlighting.color);

      component?.traverse((node) => {
        if (!(node instanceof Mesh)) {
          return;
        }

        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        materials.forEach((sourceMaterial) => {
          const material = sourceMaterial as AdjustableMaterial;

          material.color?.lerp(highlightColor, config.highlighting!.strength);
          if (material.emissive) {
            material.emissive.copy(highlightColor);
            material.emissiveIntensity = config.highlighting!.strength;
          }
        });
      });
    }

    invalidate();
  }, [config, highlightedComponentId, instance, invalidate, mode]);

  useEffect(() => {
    config.explodedView?.parts.forEach((part) => {
      const component = resolveComponentNode(instance, config, part.componentId);
      const basePosition = component
        ? instance.basePositions.get(component)
        : undefined;

      if (!component || !basePosition) {
        return;
      }

      component.position
        .copy(basePosition)
        .addScaledVector(
          new Vector3(...part.direction).normalize(),
          part.distance * clampExplosionProgress(explosionProgress),
        );
    });
    invalidate();
  }, [config, explosionProgress, instance, invalidate]);

  return (
    <group
      position={[...config.model.position]}
      rotation={[...config.model.rotation]}
      scale={[...config.model.scale]}
    >
      <primitive dispose={null} object={instance.scene} />
      {config.hotspots.map((hotspot, index) => (
        <Html center key={hotspot.id} position={[...hotspot.position]}>
          <button
            aria-label={`${hotspot.label}: ${hotspot.description}`}
            className="machine-viewer__hotspot-marker"
            onClick={() => onHotspotSelect(hotspot.id)}
            type="button"
          >
            {index + 1}
          </button>
        </Html>
      ))}
    </group>
  );
}

function CameraControls({
  config,
  prefersReducedMotion,
  resetSignal,
}: Pick<
  MachineViewerCanvasProps,
  "config" | "prefersReducedMotion" | "resetSignal"
>) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    camera.position.set(...config.camera.position);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(...config.camera.target);
    controlsRef.current?.update();
    invalidate();
  }, [camera, config.camera, invalidate, resetSignal]);

  return (
    <OrbitControls
      enableDamping={!prefersReducedMotion}
      enablePan={config.controls.enablePan}
      makeDefault
      {...(config.controls.maxAzimuthAngle === undefined
        ? {}
        : { maxAzimuthAngle: config.controls.maxAzimuthAngle })}
      maxDistance={config.controls.maxDistance}
      maxPolarAngle={config.controls.maxPolarAngle}
      {...(config.controls.minAzimuthAngle === undefined
        ? {}
        : { minAzimuthAngle: config.controls.minAzimuthAngle })}
      minDistance={config.controls.minDistance}
      minPolarAngle={config.controls.minPolarAngle}
      ref={controlsRef}
      rotateSpeed={config.controls.rotateSpeed}
      target={[...config.camera.target]}
      zoomSpeed={config.controls.zoomSpeed}
    />
  );
}

function ContextLifecycle({
  onContextFailure,
}: Pick<MachineViewerCanvasProps, "onContextFailure">) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextFailure();
    };
    const handleContextRestored = () => invalidate();

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, invalidate, onContextFailure]);

  return null;
}

function MachineViewerCanvasComponent({
  active,
  config,
  explosionProgress,
  highlightedComponentId,
  isMobileQuality,
  mode,
  modelSrc,
  onContextFailure,
  onHotspotSelect,
  onReady,
  prefersReducedMotion,
  resetSignal,
}: MachineViewerCanvasProps) {
  const shadows = isMobileQuality
    ? config.quality.mobileShadows
    : config.quality.desktopShadows;
  const dpr = limitViewerDpr(
    isMobileQuality ? config.quality.mobileDpr : config.quality.desktopDpr,
  );
  const canvasDpr: number | [number, number] =
    typeof dpr === "number" ? dpr : [dpr[0], dpr[1]];

  return (
    <Canvas
      aria-label={config.ariaLabel}
      camera={{
        far: config.camera.far,
        fov: config.camera.fov,
        near: config.camera.near,
        position: [...config.camera.position],
      }}
      className="machine-viewer__canvas"
      dpr={canvasDpr}
      frameloop={active ? "demand" : "never"}
      gl={{ antialias: !isMobileQuality, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
      }}
      role="img"
      shadows={shadows}
    >
      {config.lighting.ambient ? (
        <ambientLight
          color={config.lighting.ambient.color}
          intensity={config.lighting.ambient.intensity}
        />
      ) : null}
      {config.lighting.hemisphere ? (
        <hemisphereLight
          color={config.lighting.hemisphere.skyColor}
          groundColor={config.lighting.hemisphere.groundColor}
          intensity={config.lighting.hemisphere.intensity}
        />
      ) : null}
      {config.lighting.directional.map((light) => (
        <directionalLight
          castShadow={shadows && Boolean(light.castShadow)}
          color={light.color}
          intensity={light.intensity}
          key={light.id}
          position={[...light.position]}
        />
      ))}

      <Suspense fallback={null}>
        <ModelScene
          config={config}
          explosionProgress={explosionProgress}
          highlightedComponentId={highlightedComponentId}
          mode={mode}
          modelSrc={modelSrc}
          onHotspotSelect={onHotspotSelect}
          onReady={onReady}
        />
      </Suspense>
      <CameraControls
        config={config}
        prefersReducedMotion={prefersReducedMotion}
        resetSignal={resetSignal}
      />
      <ContextLifecycle onContextFailure={onContextFailure} />
    </Canvas>
  );
}

export const MachineViewerCanvas = memo(MachineViewerCanvasComponent);

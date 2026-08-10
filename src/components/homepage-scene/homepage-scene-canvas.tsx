"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { memo, Suspense, useEffect, useMemo } from "react";
import {
  ACESFilmicToneMapping,
} from "three";
import type { PerspectiveCamera } from "three";

import { limitViewerDpr } from "@/components/machine-viewer/resource-lifecycle";

import { createHomepageSceneRuntime } from "./homepage-scene-controller";
import type { HomepageSceneConfig, HomepageSceneController } from "./types";

type HomepageSceneCanvasProps = Readonly<{
  active: boolean;
  config: HomepageSceneConfig;
  modelSrc: string;
  onContextFailure: () => void;
  onControllerReady: (controller: HomepageSceneController | null) => void;
  onReady: () => void;
  quality: "desktop" | "mobile";
}>;

function HomepageModelScene({
  config,
  modelSrc,
  onControllerReady,
  onReady,
}: Pick<
  HomepageSceneCanvasProps,
  "config" | "modelSrc" | "onControllerReady" | "onReady"
>) {
  const gltf = useGLTF(
    modelSrc,
    config.model.dracoDecoderPath ?? false,
    config.model.useMeshopt ?? true,
  );
  const { camera, invalidate } = useThree();
  const runtime = useMemo(
    () =>
      createHomepageSceneRuntime({
        camera: camera as PerspectiveCamera,
        config,
        invalidate,
        source: gltf.scene,
      }),
    [camera, config, gltf.scene, invalidate],
  );

  useEffect(() => {
    onControllerReady(runtime.controller);
    onReady();

    return () => {
      onControllerReady(null);
      runtime.dispose();
    };
  }, [onControllerReady, onReady, runtime]);

  return <primitive dispose={null} object={runtime.scene} />;
}

function ContextLifecycle({
  active,
  onContextFailure,
}: Pick<HomepageSceneCanvasProps, "active" | "onContextFailure">) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

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

function HomepageSceneCanvasComponent({
  active,
  config,
  modelSrc,
  onContextFailure,
  onControllerReady,
  onReady,
  quality,
}: HomepageSceneCanvasProps) {
  const isMobile = quality === "mobile";
  const dpr = limitViewerDpr(
    isMobile ? config.quality.mobileDpr : config.quality.desktopDpr,
  );
  const canvasDpr: number | [number, number] =
    typeof dpr === "number" ? dpr : [dpr[0], dpr[1]];
  const shadows = isMobile
    ? config.quality.mobileShadows
    : config.quality.desktopShadows;

  return (
    <Canvas
      aria-label={config.ariaLabel}
      camera={{
        far: config.camera.far,
        fov: config.camera.fov,
        near: config.camera.near,
        position: [...config.camera.position],
      }}
      className="homepage-scene__canvas"
      dpr={canvasDpr}
      frameloop={active ? "demand" : "never"}
      gl={{
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      }}
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
        <HomepageModelScene
          config={config}
          modelSrc={modelSrc}
          onControllerReady={onControllerReady}
          onReady={onReady}
        />
      </Suspense>
      <ContextLifecycle
        active={active}
        onContextFailure={onContextFailure}
      />
    </Canvas>
  );
}

export const HomepageSceneCanvas = memo(HomepageSceneCanvasComponent);

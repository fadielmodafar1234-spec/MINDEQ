import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HomepageSceneStage } from "./homepage-scene";
import type { HomepageSceneConfig } from "./types";
import { resolveHomepageScenePolicy } from "./runtime-policy";

const config = {
  id: "homepage-scene-test",
  ariaLabel: "Homepage scene test",
  model: { src: "/development/test.glb", componentMap: {} },
  camera: {
    position: [4, 3, 5],
    target: [0, 1, 0],
    fov: 36,
    near: 0.1,
    far: 100,
  },
  machine: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  lighting: { directional: [] },
  components: {},
  initialState: {
    explosionProgress: 0,
    highlightedComponentId: null,
    materialStates: {},
  },
  highlighting: { color: "#c2672e", strength: 0.5 },
  quality: {
    mode: "auto",
    desktopDpr: [1, 1.75],
    mobileDpr: [1, 1.25],
    desktopShadows: true,
    mobileShadows: false,
    mobileBehavior: "reduced",
  },
  reducedMotion: { behavior: "poster" },
} as const satisfies HomepageSceneConfig;

describe("HomepageSceneStage", () => {
  it("server-renders the intentional MachineStage poster without a canvas", () => {
    const markup = renderToStaticMarkup(<HomepageSceneStage config={config} />);

    expect(markup).toContain('data-homepage-scene-state="poster"');
    expect(markup).toContain("CAD STAGE // MODEL PREVIEW");
    expect(markup).toContain("REF: STATIC-DATUM");
    expect(markup).not.toContain("<canvas");
  });

  it("chooses stable reduced-motion and deliberately reduced mobile behavior", () => {
    expect(
      resolveHomepageScenePolicy({
        config,
        isMobile: false,
        prefersReducedMotion: true,
        webglSupported: true,
      }),
    ).toEqual({ mountCanvas: false, quality: "desktop", reason: "reduced-motion" });

    expect(
      resolveHomepageScenePolicy({
        config,
        isMobile: true,
        prefersReducedMotion: false,
        webglSupported: true,
      }),
    ).toEqual({ mountCanvas: true, quality: "mobile", reason: "ready" });
  });

  it("degrades safely when WebGL is unavailable", () => {
    expect(
      resolveHomepageScenePolicy({
        config,
        isMobile: false,
        prefersReducedMotion: false,
        webglSupported: false,
      }),
    ).toEqual({ mountCanvas: false, quality: "desktop", reason: "unsupported" });
  });

  it("keeps frame-sensitive values outside React state and owns lifecycle cleanup", () => {
    const controllerSource = readFileSync(
      new URL("./homepage-scene-controller.ts", import.meta.url),
      "utf8",
    );
    const canvasSource = readFileSync(
      new URL("./homepage-scene-canvas.tsx", import.meta.url),
      "utf8",
    );
    const shellSource = readFileSync(
      new URL("./homepage-scene.tsx", import.meta.url),
      "utf8",
    );

    expect(controllerSource).not.toContain("useState");
    expect(canvasSource).not.toContain("useFrame");
    expect(shellSource).toContain("observer.disconnect()");
    expect(shellSource).toContain(
      "active={isInViewport && isDocumentVisible}",
    );
    expect(canvasSource).toContain(
      'frameloop={active ? "demand" : "never"}',
    );
    expect(shellSource).toContain('removeEventListener("visibilitychange"');
    expect(shellSource).toContain('removeEventListener("change"');
  });
});

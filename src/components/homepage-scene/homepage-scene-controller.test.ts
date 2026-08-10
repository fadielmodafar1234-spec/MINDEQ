import {
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  BoxGeometry,
} from "three";
import { describe, expect, it, vi } from "vitest";

import type { HomepageSceneConfig } from "./types";
import { createHomepageSceneRuntime } from "./homepage-scene-controller";

const sceneConfig = {
  id: "controller-test-scene",
  ariaLabel: "Controller test scene",
  model: {
    src: "/development/controller-test.glb",
    componentMap: {
      head: "inspection-head",
      guard: "side-guard",
    },
  },
  camera: {
    position: [4, 3, 5],
    target: [0, 1, 0],
    fov: 36,
    near: 0.1,
    far: 100,
  },
  machine: {
    position: [0, 0, 0],
    rotation: [0, 0.2, 0],
    scale: [1, 1, 1],
  },
  lighting: {
    directional: [],
  },
  components: {
    head: {
      initialVisible: true,
      explosion: {
        direction: [1, 0, 0],
        distance: 2,
      },
      materialStates: {
        approved: {
          color: "#345a68",
          emissive: "#102028",
          emissiveIntensity: 0.25,
        },
      },
    },
    guard: {
      initialVisible: false,
    },
  },
  initialState: {
    explosionProgress: 0.25,
    highlightedComponentId: null,
    materialStates: {
      head: null,
      guard: null,
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
} as const satisfies HomepageSceneConfig<"head" | "guard">;

function createSourceScene() {
  const sharedMaterial = new MeshStandardMaterial({ color: "#777777" });
  const source = new Group();
  const head = new Mesh(new BoxGeometry(1, 1, 1), sharedMaterial);
  const guard = new Mesh(new BoxGeometry(1, 1, 1), sharedMaterial);

  head.name = "inspection-head";
  head.position.set(1, 2, 3);
  guard.name = "side-guard";
  guard.position.set(-1, 0, 0);
  source.add(head, guard);

  return { source, sharedMaterial };
}

describe("homepage scene imperative controller", () => {
  it("updates the configured camera and machine values and invalidates", () => {
    const { source } = createSourceScene();
    const camera = new PerspectiveCamera();
    const invalidate = vi.fn();
    const runtime = createHomepageSceneRuntime({
      camera,
      config: sceneConfig,
      invalidate,
      source,
    });
    invalidate.mockClear();

    runtime.controller.setCameraPosition([8, 7, 6]);
    runtime.controller.setCameraTarget([1, 2, 3]);
    runtime.controller.setMachinePosition([3, 2, 1]);
    runtime.controller.setMachineRotation([0.1, 0.2, 0.3]);
    runtime.controller.setMachineScale([1.5, 1.25, 0.75]);

    expect(camera.position.toArray()).toEqual([8, 7, 6]);
    expect(runtime.cameraTarget.toArray()).toEqual([1, 2, 3]);
    expect(runtime.scene.position.toArray()).toEqual([3, 2, 1]);
    expect(runtime.scene.rotation.toArray().slice(0, 3)).toEqual([
      0.1,
      0.2,
      0.3,
    ]);
    expect(runtime.scene.scale.toArray()).toEqual([1.5, 1.25, 0.75]);
    expect(invalidate).toHaveBeenCalledTimes(5);

    runtime.dispose();
  });

  it("clamps explosion progress and repeats calls deterministically", () => {
    const { source } = createSourceScene();
    const runtime = createHomepageSceneRuntime({
      camera: new PerspectiveCamera(),
      config: sceneConfig,
      invalidate: vi.fn(),
      source,
    });
    const head = runtime.scene.getObjectByName("inspection-head");

    runtime.controller.setExplosionProgress(4);
    runtime.controller.setExplosionProgress(4);
    expect(head?.position.toArray()).toEqual([3, 2, 3]);

    runtime.controller.setExplosionProgress(-2);
    expect(head?.position.toArray()).toEqual([1, 2, 3]);

    runtime.dispose();
  });

  it("handles visibility, highlighting, material states, and unknown IDs safely", () => {
    const { source, sharedMaterial } = createSourceScene();
    const runtime = createHomepageSceneRuntime({
      camera: new PerspectiveCamera(),
      config: sceneConfig,
      invalidate: vi.fn(),
      source,
    });
    const head = runtime.scene.getObjectByName("inspection-head") as Mesh;
    const guard = runtime.scene.getObjectByName("side-guard") as Mesh;
    const headMaterial = head.material as MeshStandardMaterial;

    expect(guard.visible).toBe(false);
    expect(runtime.controller.setComponentVisibility("guard", true)).toBe(true);
    expect(guard.visible).toBe(true);
    expect(
      runtime.controller.setComponentVisibility(
        "missing" as "head" | "guard",
        false,
      ),
    ).toBe(false);

    expect(runtime.controller.setMaterialState("head", "approved")).toBe(true);
    expect(headMaterial.color.getHexString()).toBe("345a68");
    expect(sharedMaterial.color.getHexString()).toBe("777777");
    expect(headMaterial).not.toBe(sharedMaterial);
    expect(runtime.controller.setMaterialState("head", "missing")).toBe(false);

    expect(runtime.controller.setHighlightedComponent("head")).toBe(true);
    expect(headMaterial.emissive.getHex()).not.toBe(0);
    expect(
      runtime.controller.setHighlightedComponent(
        "missing" as "head" | "guard",
      ),
    ).toBe(false);
    expect(runtime.controller.setHighlightedComponent(null)).toBe(true);

    const dispose = vi.spyOn(headMaterial, "dispose");
    runtime.dispose();
    runtime.dispose();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("reset restores the exact configured initial state", () => {
    const { source } = createSourceScene();
    const camera = new PerspectiveCamera();
    const runtime = createHomepageSceneRuntime({
      camera,
      config: sceneConfig,
      invalidate: vi.fn(),
      source,
    });
    const head = runtime.scene.getObjectByName("inspection-head");
    const guard = runtime.scene.getObjectByName("side-guard");

    runtime.controller.setCameraPosition([9, 9, 9]);
    runtime.controller.setMachinePosition([4, 4, 4]);
    runtime.controller.setExplosionProgress(1);
    runtime.controller.setComponentVisibility("guard", true);
    runtime.controller.setHighlightedComponent("head");
    runtime.controller.setMaterialState("head", "approved");
    runtime.controller.reset();

    expect(camera.position.toArray()).toEqual([4, 3, 5]);
    expect(runtime.cameraTarget.toArray()).toEqual([0, 1, 0]);
    expect(runtime.scene.position.toArray()).toEqual([0, 0, 0]);
    expect(runtime.scene.rotation.toArray().slice(0, 3)).toEqual([0, 0.2, 0]);
    expect(runtime.scene.scale.toArray()).toEqual([1, 1, 1]);
    expect(head?.position.toArray()).toEqual([1.5, 2, 3]);
    expect(head?.visible).toBe(true);
    expect(guard?.visible).toBe(false);
    const resetMaterial = (head as Mesh).material as MeshStandardMaterial;
    expect(resetMaterial.color.getHexString()).toBe("777777");
    expect(resetMaterial.emissive.getHex()).toBe(0);

    runtime.dispose();
  });
});

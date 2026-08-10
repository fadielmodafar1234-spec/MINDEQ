import { describe, expect, it } from "vitest";

import { getMachinePreviewBySlug } from "./repository";
import { createMachineViewerConfig } from "./viewer-config";

describe("createMachineViewerConfig", () => {
  it("returns no viewer when a machine has no model contract", () => {
    const machine = getMachinePreviewBySlug("development-machine");

    if (!machine) {
      throw new Error("Development machine fixture is unavailable.");
    }

    const withoutModel = {
      ...machine,
      model: null,
      modelMobile: null,
      modelPoster: null,
    };

    expect(createMachineViewerConfig(withoutModel)).toBeNull();
  });

  it("projects machine data into a reusable viewer contract", () => {
    const machine = getMachinePreviewBySlug("development-machine");

    if (!machine) {
      throw new Error("Development machine fixture is unavailable.");
    }

    const config = createMachineViewerConfig(machine);

    expect(config?.model.src).toBe(
      "/api/development-assets/development-machine.viewer.glb",
    );
    expect(config?.camera.fov).toBe(36);
    expect(config?.hotspots.map((hotspot) => hotspot.componentId)).toEqual([
      "inspection-head",
      "base",
    ]);
    expect(config?.quality.mobileDpr).toEqual([1, 1.25]);
  });
});

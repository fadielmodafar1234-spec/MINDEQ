import { describe, expect, it } from "vitest";

import { developmentMachine } from "@/content/machines/development-machine";
import { getMachinePreviewBySlug } from "./repository";

import { createDevelopmentHomepageSceneConfig } from "./homepage-scene-config";

describe("development homepage scene configuration", () => {
  it("uses the one existing representative model only in development", () => {
    const config = createDevelopmentHomepageSceneConfig(
      getMachinePreviewBySlug(developmentMachine.slug),
      "development",
    );

    expect(config?.model.src).toBe(
      "/api/development-assets/development-machine.viewer.glb",
    );
    expect(Object.keys(config?.components ?? {})).toEqual([
      "base",
      "tower",
      "inspection-head",
      "side-guard",
    ]);
    expect(
      createDevelopmentHomepageSceneConfig(
        getMachinePreviewBySlug(developmentMachine.slug),
        "production",
      ),
    ).toBeNull();
  });
});

import type { Material } from "three";

import type { ViewerDpr } from "./types";

export function disposeOwnedMaterials(
  materials: ReadonlySet<Material>,
): void {
  materials.forEach((material) => {
    material.dispose();
  });
}

export function clampExplosionProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

export function limitViewerDpr(dpr: ViewerDpr): ViewerDpr {
  if (typeof dpr === "number") {
    return Math.min(2, Math.max(0.5, dpr));
  }

  const minimum = Math.min(2, Math.max(0.5, dpr[0]));
  const maximum = Math.min(2, Math.max(minimum, dpr[1]));

  return [minimum, maximum];
}

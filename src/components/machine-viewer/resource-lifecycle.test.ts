import { MeshStandardMaterial } from "three";
import { describe, expect, it, vi } from "vitest";

import {
  clampExplosionProgress,
  disposeOwnedMaterials,
  limitViewerDpr,
} from "./resource-lifecycle";

describe("machine viewer resource lifecycle", () => {
  it("disposes every instance-owned material", () => {
    const first = new MeshStandardMaterial();
    const second = new MeshStandardMaterial();
    const firstDispose = vi.spyOn(first, "dispose");
    const secondDispose = vi.spyOn(second, "dispose");

    disposeOwnedMaterials(new Set([first, second]));

    expect(firstDispose).toHaveBeenCalledOnce();
    expect(secondDispose).toHaveBeenCalledOnce();
  });

  it("keeps exploded-view progression deterministic and bounded", () => {
    expect(clampExplosionProgress(-1)).toBe(0);
    expect(clampExplosionProgress(0.4)).toBe(0.4);
    expect(clampExplosionProgress(2)).toBe(1);
    expect(clampExplosionProgress(Number.NaN)).toBe(0);
  });

  it("caps desktop and mobile device-pixel ratios", () => {
    expect(limitViewerDpr(4)).toBe(2);
    expect(limitViewerDpr([1, 4])).toEqual([1, 2]);
    expect(limitViewerDpr([0, 1.25])).toEqual([0.5, 1.25]);
  });
});

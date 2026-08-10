import type { HomepageSceneConfig } from "./types";

export type HomepageScenePolicy = Readonly<{
  mountCanvas: boolean;
  quality: "desktop" | "mobile";
  reason: "ready" | "mobile-fallback" | "reduced-motion" | "unsupported";
}>;

type HomepageScenePolicyInput = Readonly<{
  config: HomepageSceneConfig;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  webglSupported: boolean;
}>;

export function resolveHomepageScenePolicy({
  config,
  isMobile,
  prefersReducedMotion,
  webglSupported,
}: HomepageScenePolicyInput): HomepageScenePolicy {
  const quality =
    config.quality.mode === "mobile" ||
    (config.quality.mode === "auto" && isMobile)
      ? "mobile"
      : "desktop";

  if (!webglSupported) {
    return { mountCanvas: false, quality, reason: "unsupported" };
  }

  if (prefersReducedMotion && config.reducedMotion.behavior === "poster") {
    return { mountCanvas: false, quality, reason: "reduced-motion" };
  }

  if (quality === "mobile" && config.quality.mobileBehavior === "poster") {
    return { mountCanvas: false, quality, reason: "mobile-fallback" };
  }

  return { mountCanvas: true, quality, reason: "ready" };
}

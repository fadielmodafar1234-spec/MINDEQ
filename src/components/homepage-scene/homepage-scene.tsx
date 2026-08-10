"use client";

import {
  Component,
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { MachineStage } from "@/components/home/machine-stage";

import { resolveHomepageScenePolicy } from "./runtime-policy";
import type {
  HomepageSceneController,
  HomepageSceneStageProps,
} from "./types";

const LazyHomepageSceneCanvas = lazy(async () => {
  const canvasModule = await import("./homepage-scene-canvas");
  return { default: canvasModule.HomepageSceneCanvas };
});

type SceneAvailability = "checking" | "supported" | "unsupported";
type SceneStatus = "error" | "loading" | "poster" | "ready";

type SceneErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onError: () => void;
}>;

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  Readonly<{ hasError: boolean }>
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const HomepageSceneStage = forwardRef<
  HomepageSceneController,
  HomepageSceneStageProps
>(function HomepageSceneStage({ config, className }, forwardedRef) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HomepageSceneController | null>(null);
  const [availability, setAvailability] = useState<SceneAvailability>("checking");
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [readyModelSrc, setReadyModelSrc] = useState<string | null>(null);
  const [failedModelSrc, setFailedModelSrc] = useState<string | null>(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 48rem), (pointer: coarse)");

  useImperativeHandle(
    forwardedRef,
    () => ({
      setCameraPosition: (position) =>
        controllerRef.current?.setCameraPosition(position),
      setCameraTarget: (target) =>
        controllerRef.current?.setCameraTarget(target),
      setMachinePosition: (position) =>
        controllerRef.current?.setMachinePosition(position),
      setMachineRotation: (rotation) =>
        controllerRef.current?.setMachineRotation(rotation),
      setMachineScale: (scale) =>
        controllerRef.current?.setMachineScale(scale),
      setExplosionProgress: (progress) =>
        controllerRef.current?.setExplosionProgress(progress),
      setComponentVisibility: (componentId, visible) =>
        controllerRef.current?.setComponentVisibility(componentId, visible) ??
        false,
      setHighlightedComponent: (componentId) =>
        controllerRef.current?.setHighlightedComponent(componentId) ?? false,
      setMaterialState: (componentId, state) =>
        controllerRef.current?.setMaterialState(componentId, state) ?? false,
      reset: () => controllerRef.current?.reset(),
    }),
    [],
  );

  useEffect(() => {
    if (!config) return;
    const timer = globalThis.setTimeout(() => {
      setAvailability(hasWebGLSupport() ? "supported" : "unsupported");
    }, 0);
    return () => globalThis.clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    const root = rootRef.current;
    if (!config || !root) return;

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => {
        setHasEnteredViewport(true);
        setIsInViewport(true);
      }, 0);
      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersects = entries.some((entry) => entry.isIntersecting);
        setIsInViewport(intersects);
        if (intersects) setHasEnteredViewport(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [config]);

  useEffect(() => {
    if (!config) return;
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, [config]);

  const policy = useMemo(
    () =>
      config
        ? resolveHomepageScenePolicy({
            config,
            isMobile,
            prefersReducedMotion,
            webglSupported: availability === "supported",
          })
        : null,
    [availability, config, isMobile, prefersReducedMotion],
  );
  const modelSrc =
    policy?.quality === "mobile" && config?.model.mobileSrc
      ? config.model.mobileSrc
      : config?.model.src;
  const shouldMountCanvas = Boolean(
    config &&
      modelSrc &&
      policy?.mountCanvas &&
      hasEnteredViewport &&
      failedModelSrc !== modelSrc,
  );
  const status: SceneStatus =
    modelSrc && failedModelSrc === modelSrc
      ? "error"
      : modelSrc && readyModelSrc === modelSrc
        ? "ready"
        : shouldMountCanvas
          ? "loading"
          : "poster";
  const rootClassName = ["homepage-scene-stage", className]
    .filter(Boolean)
    .join(" ");

  const handleReady = useCallback(() => {
    if (!modelSrc) return;
    setFailedModelSrc(null);
    setReadyModelSrc(modelSrc);
  }, [modelSrc]);

  const handleFailure = useCallback(() => {
    if (!modelSrc) return;
    controllerRef.current = null;
    setReadyModelSrc(null);
    setFailedModelSrc(modelSrc);
  }, [modelSrc]);

  const handleControllerReady = useCallback(
    (controller: HomepageSceneController | null) => {
      controllerRef.current = controller;
    },
    [],
  );

  return (
    <div
      className={rootClassName}
      data-homepage-scene-active={
        shouldMountCanvas && isInViewport && isDocumentVisible ? "true" : "false"
      }
      data-homepage-scene-quality={policy?.quality ?? "poster"}
      data-homepage-scene-reason={policy?.reason ?? "not-configured"}
      data-homepage-scene-state={status}
      ref={rootRef}
    >
      <MachineStage />
      {shouldMountCanvas && config && modelSrc ? (
        <div aria-hidden={status !== "ready"} className="homepage-scene__webgl">
          <SceneErrorBoundary key={modelSrc} onError={handleFailure}>
            <Suspense fallback={null}>
              <LazyHomepageSceneCanvas
                active={isInViewport && isDocumentVisible}
                config={config}
                modelSrc={modelSrc}
                onContextFailure={handleFailure}
                onControllerReady={handleControllerReady}
                onReady={handleReady}
                quality={policy?.quality ?? "desktop"}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      ) : null}
      <span aria-live="polite" className="homepage-scene__status">
        {status === "ready"
          ? "Homepage 3D scene ready."
          : status === "loading"
            ? "Loading homepage 3D scene."
            : "Static machine illustration ready."}
      </span>
    </div>
  );
});

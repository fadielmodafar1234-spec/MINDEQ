"use client";

import Image from "next/image";
import {
  Component,
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { MachineViewerProps } from "./types";

const LazyMachineViewerCanvas = lazy(async () => {
  const canvasModule = await import("./machine-viewer-canvas");

  return { default: canvasModule.MachineViewerCanvas };
});

type ViewerAvailability = "checking" | "supported" | "unsupported";
type ViewerStatus = "poster" | "loading" | "ready" | "error";

type ViewerErrorBoundaryProps = Readonly<{
  children: ReactNode;
  onError: () => void;
}>;

type ViewerErrorBoundaryState = Readonly<{
  hasError: boolean;
}>;

class ViewerErrorBoundary extends Component<
  ViewerErrorBoundaryProps,
  ViewerErrorBoundaryState
> {
  state: ViewerErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
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

function MachineViewerComponent({
  config,
  className,
  highlightedComponentId,
  mode = "standard",
  explosionProgress = 0,
}: MachineViewerProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [availability, setAvailability] =
    useState<ViewerAvailability>("checking");
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [readyModelSrc, setReadyModelSrc] = useState<string | null>(null);
  const [failedModelSrc, setFailedModelSrc] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const mobileMedia = useMediaQuery("(max-width: 48rem), (pointer: coarse)");
  const isMobileQuality =
    config.quality.mode === "mobile" ||
    (config.quality.mode === "auto" && mobileMedia);
  const modelSrc =
    isMobileQuality && config.model.mobileSrc
      ? config.model.mobileSrc
      : config.model.src;
  const activeHighlightedComponentId =
    highlightedComponentId ?? selectedComponentId;
  const rootClassName = ["machine-viewer", className]
    .filter(Boolean)
    .join(" ");
  const aspectRatio = `${config.poster.width} / ${config.poster.height}`;
  const shouldMountCanvas =
    availability === "supported" && hasEnteredViewport;
  const status: ViewerStatus =
    failedModelSrc === modelSrc
      ? "error"
      : readyModelSrc === modelSrc
        ? "ready"
        : shouldMountCanvas
          ? "loading"
          : "poster";

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setAvailability(hasWebGLSupport() ? "supported" : "unsupported");
    }, 0);

    return () => globalThis.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || hasEnteredViewport) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => {
        setHasEnteredViewport(true);
      }, 0);

      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, [hasEnteredViewport]);

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState !== "hidden");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreen);

    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  const handleModelReady = useCallback(() => {
    setFailedModelSrc(null);
    setReadyModelSrc(modelSrc);
  }, [modelSrc]);

  const handleModelError = useCallback(() => {
    setReadyModelSrc(null);
    setFailedModelSrc(modelSrc);
  }, [modelSrc]);

  const handleHotspotSelect = useCallback(
    (hotspotId: string) => {
      const hotspot = config.hotspots.find((item) => item.id === hotspotId);

      if (config.highlighting?.enabled && hotspot?.componentId) {
        setSelectedComponentId((current) =>
          current === hotspot.componentId ? null : (hotspot.componentId ?? null),
        );
      }
    },
    [config.highlighting?.enabled, config.hotspots],
  );

  const handleFullscreen = useCallback(async () => {
    const root = rootRef.current;

    if (!root || !config.fullscreen?.enabled) {
      return;
    }

    try {
      if (document.fullscreenElement === root) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled) {
        await root.requestFullscreen();
      }
    } catch {
      // The poster and inline viewer remain fully usable when fullscreen is denied.
    }
  }, [config.fullscreen?.enabled]);

  const statusMessage = useMemo(() => {
    if (availability === "unsupported") {
      return "Interactive 3D is unavailable. The machine poster remains available.";
    }

    if (status === "loading") {
      return "Loading interactive 3D model…";
    }

    if (status === "error") {
      return "The interactive model could not be loaded. The machine poster remains available.";
    }

    if (status === "ready") {
      return "Interactive 3D model ready.";
    }

    return "Machine poster ready.";
  }, [availability, status]);

  return (
    <section
      aria-label={config.ariaLabel}
      className={rootClassName}
      data-quality-mode={isMobileQuality ? "mobile" : "desktop"}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      data-viewer-state={availability === "unsupported" ? "unsupported" : status}
      ref={rootRef}
    >
      <p className="machine-viewer__instructions" id={`${config.id}-instructions`}>
        {config.instructions}
      </p>

      <div
        aria-describedby={`${config.id}-instructions`}
        className="machine-viewer__viewport"
        style={{ aspectRatio }}
      >
        {status !== "ready" ? (
          <Image
            alt={config.poster.alt}
            className="machine-viewer__poster"
            height={config.poster.height}
            priority={config.poster.priority ?? false}
            sizes="(max-width: 72rem) 100vw, 72rem"
            src={config.poster.src}
            width={config.poster.width}
          />
        ) : null}

        {shouldMountCanvas && failedModelSrc !== modelSrc ? (
          <ViewerErrorBoundary key={modelSrc} onError={handleModelError}>
            <Suspense fallback={null}>
              <LazyMachineViewerCanvas
                active={isPageVisible}
                config={config}
                explosionProgress={explosionProgress}
                highlightedComponentId={activeHighlightedComponentId}
                isMobileQuality={isMobileQuality}
                mode={mode}
                modelSrc={modelSrc}
                onContextFailure={handleModelError}
                onHotspotSelect={handleHotspotSelect}
                onReady={handleModelReady}
                prefersReducedMotion={prefersReducedMotion}
                resetSignal={resetSignal}
              />
            </Suspense>
          </ViewerErrorBoundary>
        ) : null}

        <p aria-live="polite" className="machine-viewer__status">
          {statusMessage}
        </p>
      </div>

      <div aria-label="3D viewer controls" className="machine-viewer__toolbar" role="group">
        <button
          disabled={status !== "ready"}
          onClick={() => setResetSignal((current) => current + 1)}
          type="button"
        >
          Reset view
        </button>
        {config.fullscreen?.enabled ? (
          <button
            aria-pressed={isFullscreen}
            disabled={!isFullscreen && status !== "ready"}
            onClick={() => void handleFullscreen()}
            type="button"
          >
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
        ) : null}
      </div>

      {config.hotspots.length > 0 ? (
        <ol aria-label="Machine viewer hotspots" className="machine-viewer__hotspot-list">
          {config.hotspots.map((hotspot) => (
            <li key={hotspot.id}>
              <button
                aria-pressed={
                  Boolean(hotspot.componentId) &&
                  hotspot.componentId === activeHighlightedComponentId
                }
                onClick={() => handleHotspotSelect(hotspot.id)}
                type="button"
              >
                <strong>{hotspot.label}</strong>
                <span>{hotspot.description}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

export const MachineViewer = memo(MachineViewerComponent);

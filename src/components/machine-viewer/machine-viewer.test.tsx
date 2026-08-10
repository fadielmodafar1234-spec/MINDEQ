import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getMachinePreviewBySlug } from "@/lib/machines/repository";
import { createMachineViewerConfig } from "@/lib/machines/viewer-config";

import { MachineViewer } from "./machine-viewer";

describe("MachineViewer", () => {
  it("server-renders the poster, instructions, controls, and hotspot equivalents", () => {
    const machine = getMachinePreviewBySlug("development-machine");

    if (!machine) {
      throw new Error("Development machine fixture is unavailable.");
    }

    const config = createMachineViewerConfig(machine);

    if (!config) {
      throw new Error("Development viewer configuration is unavailable.");
    }

    const markup = renderToStaticMarkup(<MachineViewer config={config} />);

    expect(markup).toContain(config.poster.alt);
    expect(markup).toContain("Drag to rotate");
    expect(markup).toContain("Reset view");
    expect(markup).toContain("Fullscreen");
    expect(markup).toContain("Development component A");
    expect(markup).toContain("data-viewer-state=\"poster\"");
    expect(markup).not.toContain("<canvas");
  });
});

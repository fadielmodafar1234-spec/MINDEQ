import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { attachMobileNavigationBehavior } from "./mobile-navigation";

describe("site shell", () => {
  it("exposes every approved route in each navigation region", () => {
    const headerMarkup = renderToStaticMarkup(<SiteHeader />);
    const footerMarkup = renderToStaticMarkup(<SiteFooter />);

    for (const route of ["/", "/machines", "/expertise", "/contact"]) {
      expect(headerMarkup).toContain(`href="${route}"`);
      expect(footerMarkup).toContain(`href="${route}"`);
    }

    expect(headerMarkup).toContain('aria-label="Primary"');
    expect(headerMarkup).toContain('aria-label="Mobile"');
    expect(headerMarkup).toContain("<details");
    expect(headerMarkup).toContain("<summary");
    expect(footerMarkup).toContain('aria-label="Footer"');
    expect(footerMarkup).toContain("Moroccan industrial machine manufacturer");
  });

  it("closes the mobile menu on Escape, restores focus, and releases scroll", () => {
    const details = new EventTarget() as EventTarget & {
      open: boolean;
      querySelector: () => { focus: () => void };
    };
    const documentTarget = new EventTarget() as EventTarget & {
      documentElement: {
        classList: {
          remove: (token: string) => void;
          toggle: (token: string, force?: boolean) => boolean;
        };
      };
    };
    const rootClasses = new Set<string>();
    let summaryFocused = false;

    details.open = true;
    details.querySelector = () => ({
      focus: () => {
        summaryFocused = true;
      },
    });
    documentTarget.documentElement = {
      classList: {
        remove: (token) => {
          rootClasses.delete(token);
        },
        toggle: (token, force) => {
          const enabled = force ?? !rootClasses.has(token);
          if (enabled) rootClasses.add(token);
          else rootClasses.delete(token);
          return enabled;
        },
      },
    };

    const cleanup = attachMobileNavigationBehavior(
      details as unknown as HTMLDetailsElement,
      documentTarget as unknown as Document,
    );

    expect(rootClasses.has("mobile-menu-open")).toBe(true);

    const escapeEvent = new Event("keydown", { cancelable: true });
    Object.defineProperty(escapeEvent, "key", { value: "Escape" });
    documentTarget.dispatchEvent(escapeEvent);

    expect(details.open).toBe(false);
    expect(summaryFocused).toBe(true);
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(rootClasses.has("mobile-menu-open")).toBe(false);

    cleanup();
  });

  it("uses literal typed destinations for the supporting routes", () => {
    for (const file of [
      "src/components/layout/site-header.tsx",
      "src/components/layout/site-footer.tsx",
      "src/app/not-found.tsx",
    ]) {
      const source = readFileSync(file, "utf8");

      expect(source).not.toMatch(new RegExp(["as", "Route"].join("\\s+")));
      expect(source).not.toContain('import type { Route } from "next"');
    }
  });
});

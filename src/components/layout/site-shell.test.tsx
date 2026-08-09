import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { siteNavigationRoutes } from "./navigation-routes";
import {
  attachMobileNavigationBehavior,
  MobileNavigation,
} from "./mobile-navigation";

function getNavigationMarkup(markup: string, label: string) {
  return (
    markup.match(
      new RegExp(`<nav aria-label="${label}"[^>]*>([\\s\\S]*?)</nav>`),
    )?.[1] ?? ""
  );
}

describe("site shell", () => {
  it("exposes the canonical site navigation routes", () => {
    expect(siteNavigationRoutes).toEqual([
      { href: "/", label: "Home" },
      { href: "/machines", label: "Machines" },
      { href: "/expertise", label: "Expertise" },
      { href: "/contact", label: "Contact" },
    ]);
  });

  it("renders the approved navigation markup in every region", () => {
    const headerMarkup = renderToStaticMarkup(<SiteHeader />);
    const mobileMarkup = renderToStaticMarkup(<MobileNavigation />);
    const footerMarkup = renderToStaticMarkup(<SiteFooter />);
    const actionContactMarkup =
      '<a class="action-link action-link--secondary" href="/contact">Contact</a>';

    expect(getNavigationMarkup(headerMarkup, "Primary")).toBe(
      '<a href="/">Home</a><a href="/machines">Machines</a><a href="/expertise">Expertise</a>' +
        actionContactMarkup,
    );
    expect(getNavigationMarkup(mobileMarkup, "Mobile")).toBe(
      '<a href="/">Home</a><a href="/machines">Machines</a><a href="/expertise">Expertise</a>' +
        actionContactMarkup,
    );
    expect(getNavigationMarkup(footerMarkup, "Footer")).toBe(
      '<a href="/">Home</a><a href="/machines">Machines</a><a href="/expertise">Expertise</a><a href="/contact">Contact</a>',
    );

    expect(headerMarkup).toContain('aria-label="Primary"');
    expect(headerMarkup).toContain('aria-label="Mobile"');
    expect(headerMarkup).toContain("<details");
    expect(headerMarkup).toContain("<summary");
    expect(footerMarkup).toContain('aria-label="Footer"');
    expect(footerMarkup).toContain("Moroccan industrial machine manufacturer");
  });

  it("closes the mobile menu after link activation or Escape", () => {
    const details = new EventTarget() as EventTarget & {
      open: boolean;
      querySelector: () => { focus: () => void };
      querySelectorAll: () => EventTarget[];
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
    const menuLink = new EventTarget();
    let summaryFocused = false;

    details.open = true;
    details.querySelector = () => ({
      focus: () => {
        summaryFocused = true;
      },
    });
    details.querySelectorAll = () => [menuLink];
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

    menuLink.dispatchEvent(new Event("click"));

    expect(details.open).toBe(false);
    expect(rootClasses.has("mobile-menu-open")).toBe(false);

    details.open = true;
    details.dispatchEvent(new Event("toggle"));
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

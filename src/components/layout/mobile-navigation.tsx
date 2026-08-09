"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { ActionLink } from "@/components/ui/action-link";

import { primaryRoutes } from "./navigation-routes";

const scrollContainmentClass = "mobile-menu-open";

export function attachMobileNavigationBehavior(
  details: HTMLDetailsElement,
  menuDocument: Document,
) {
  const root = menuDocument.documentElement;
  const summary = details.querySelector("summary");
  const links = details.querySelectorAll("a");
  const syncScrollContainment = () => {
    root.classList.toggle(scrollContainmentClass, details.open);
  };
  const closeOnLinkActivation = () => {
    details.open = false;
    syncScrollContainment();
  };
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !details.open) return;

    event.preventDefault();
    details.open = false;
    syncScrollContainment();
    summary?.focus();
  };

  details.addEventListener("toggle", syncScrollContainment);
  links.forEach((link) => link.addEventListener("click", closeOnLinkActivation));
  menuDocument.addEventListener("keydown", closeOnEscape);
  syncScrollContainment();

  return () => {
    details.removeEventListener("toggle", syncScrollContainment);
    links.forEach((link) =>
      link.removeEventListener("click", closeOnLinkActivation),
    );
    menuDocument.removeEventListener("keydown", closeOnEscape);
    root.classList.remove(scrollContainmentClass);
  };
}

export function MobileNavigation() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    return attachMobileNavigationBehavior(details, document);
  }, []);

  return (
    <details className="site-mobile-nav" ref={detailsRef}>
      <summary>Menu</summary>
      <nav aria-label="Mobile">
        {primaryRoutes.map(({ href, label }) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
        <ActionLink href="/contact" variant="secondary">
          Contact
        </ActionLink>
      </nav>
    </details>
  );
}

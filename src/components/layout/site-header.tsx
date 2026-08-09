import Link from "next/link";
import type { Route } from "next";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";

const primaryRoutes: ReadonlyArray<Readonly<{ href: Route; label: string }>> = [
  { href: "/", label: "Home" },
  { href: "/machines", label: "Machines" },
  { href: "/expertise" as Route, label: "Expertise" },
] as const;

export function SiteHeader() {
  return (
    <Container as="header" className="site-header">
      <div className="site-header__content">
        <Link className="site-header__brand" href="/">
          MINDEQ
        </Link>
        <nav aria-label="Primary" className="site-nav">
          {primaryRoutes.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <ActionLink href={"/contact" as Route} variant="secondary">
            Contact
          </ActionLink>
        </nav>
        <details className="site-mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile">
            {primaryRoutes.map(({ href, label }) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
            <ActionLink href={"/contact" as Route} variant="secondary">
              Contact
            </ActionLink>
          </nav>
        </details>
      </div>
    </Container>
  );
}

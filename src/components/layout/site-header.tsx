import Link from "next/link";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";

const primaryRoutes = [
  { href: "/", label: "Home" },
  { href: "/machines", label: "Machines" },
  { href: "/expertise", label: "Expertise" },
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
          <ActionLink href="/contact" variant="secondary">
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
            <ActionLink href="/contact" variant="secondary">
              Contact
            </ActionLink>
          </nav>
        </details>
      </div>
    </Container>
  );
}

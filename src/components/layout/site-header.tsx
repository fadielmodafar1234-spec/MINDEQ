import Link from "next/link";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";

import { MobileNavigation } from "./mobile-navigation";
import { primaryRoutes } from "./navigation-routes";

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
        <MobileNavigation />
      </div>
    </Container>
  );
}

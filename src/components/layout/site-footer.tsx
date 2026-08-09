import Link from "next/link";

import { Container } from "@/components/ui/container";

import { siteNavigationRoutes } from "./navigation-routes";

export function SiteFooter() {
  return (
    <Container as="footer" className="site-footer">
      <div className="site-footer__content">
        <p>MINDEQ is a Moroccan industrial machine manufacturer.</p>
        <nav aria-label="Footer" className="site-footer__nav">
          {siteNavigationRoutes.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </Container>
  );
}

import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/container";

const footerRoutes: ReadonlyArray<Readonly<{ href: Route; label: string }>> = [
  { href: "/", label: "Home" },
  { href: "/machines", label: "Machines" },
  { href: "/expertise" as Route, label: "Expertise" },
  { href: "/contact" as Route, label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <Container as="footer" className="site-footer">
      <div className="site-footer__content">
        <p>MINDEQ is a Moroccan industrial machine manufacturer.</p>
        <nav aria-label="Footer" className="site-footer__nav">
          {footerRoutes.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </Container>
  );
}

import Link from "next/link";

import { Container } from "@/components/ui/container";

const footerRoutes = [
  { href: "/", label: "Home" },
  { href: "/machines", label: "Machines" },
  { href: "/expertise", label: "Expertise" },
  { href: "/contact", label: "Contact" },
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

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = Readonly<{
  children: ReactNode;
  href: LinkProps<string>["href"];
  variant: "primary" | "secondary" | "text";
}>;

export function ActionLink({ children, href, variant }: ActionLinkProps) {
  return (
    <Link className={`action-link action-link--${variant}`} href={href}>
      {children}
    </Link>
  );
}

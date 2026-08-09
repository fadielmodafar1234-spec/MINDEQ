import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MINDEQ",
    template: "%s | MINDEQ",
  },
  description: "MINDEQ is a Moroccan industrial machine manufacturer.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="site-header">
          <Link href="/">MINDEQ</Link>
          <nav aria-label="Primary" className="site-nav">
            <Link href="/machines">Machines</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>MINDEQ — industrial machine manufacturing.</p>
        </footer>
      </body>
    </html>
  );
}

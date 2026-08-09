# MINDEQ Static Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the complete responsive static site foundation and seven-section homepage required by Task 04, with working primary routes and no dependency on animation, WebGL, or unverified facts.

**Architecture:** Server Components assemble small layout, UI, and homepage primitives. Semantic CSS tokens and a shared responsive grid drive all routes, while published-only repository queries feed the featured-machine section. Native HTML behavior keeps navigation and page content usable without animation or client hydration.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, strict TypeScript 6.0.3, Tailwind CSS 4.3.3/PostCSS, Vitest 4.1.10, semantic HTML, CSS custom properties.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-09-static-design-foundation-design.md` and the locked constitution documents.
- Keep all homepage and route content as Server Components; use no client boundary unless native HTML cannot satisfy the requirement.
- Add no 3D, GSAP, ScrollTrigger, Anime.js, Lenis, UI framework, image generator, or new runtime dependency.
- Use only approved brief statements; do not invent machines, capabilities, statistics, facilities, certifications, customers, contact details, or performance claims.
- Never show the development machine in production or as a featured homepage product.
- Preserve the exact homepage order: Hero, Engineering, Industries, Featured machines, Custom engineering, Company/proof, Contact CTA.
- The complete experience must work without animation and remain coherent in server-rendered HTML.
- Validate at 1920×1080, 1440×900, 1366×768, 430×932, and 390×844 without horizontal overflow.
- Do not begin Task 05.

---

### Task 1: Semantic design primitives

**Files:**
- Test: `src/components/ui/static-foundation.test.tsx`
- Create: `src/components/ui/action-link.tsx`
- Create: `src/components/ui/container.tsx`
- Create: `src/components/ui/section.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces `ActionLink({ href, variant, children })` with `primary | secondary | text` variants.
- Produces `Container({ as, size, className, children })` with `standard | wide | text` sizes.
- Produces `Section({ id, index, label, tone, children })` with `light | dark | surface` tones.
- Produces semantic CSS variables for colors, typography, spacing, grid, focus, and reduced motion.

- [x] **Step 1: Write the primitive and CSS-contract test**

```tsx
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ActionLink } from "./action-link";
import { Container } from "./container";
import { Section } from "./section";

describe("static design foundation", () => {
  it("exposes semantic layout primitives", () => {
    const markup = renderToStaticMarkup(
      <Section id="engineering" index="02" label="Engineering" tone="dark">
        <Container size="wide">
          <ActionLink href="/machines" variant="primary">Explore machines</ActionLink>
        </Container>
      </Section>,
    );

    expect(markup).toContain('id="engineering"');
    expect(markup).toContain('data-section-index="02"');
    expect(markup).toContain('href="/machines"');
  });

  it("defines the semantic token and resilience contract", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    for (const token of ["--color-canvas", "--color-ink", "--color-brand", "--color-focus", "--section-space", "--grid-columns"]) {
      expect(css).toContain(token);
    }
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("overflow-x: clip");
  });
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run: `pnpm test src/components/ui/static-foundation.test.tsx`

Expected: FAIL because the three primitive modules do not exist.

- [x] **Step 3: Implement the typed primitives**

Use direct imports and semantic elements. `Section` must render its datum label as visible text, `Container` must support `div`, `header`, and `footer`, and `ActionLink` must render a Next.js `Link` with the selected class.

```tsx
<section className={`section section--${tone}`} data-section-index={index} id={id}>
  <div className="section__datum" aria-hidden="true">
    <span>{index}</span><span>{label}</span>
  </div>
  {children}
</section>
```

- [x] **Step 4: Replace the baseline stylesheet with the semantic system**

Define the exact color values from the design spec, spacing steps `0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem, 8rem`, responsive display/body/label roles, 12-column desktop and 4-column mobile grids, three container sizes, action variants, skip/focus styles, dark/surface section tones, and `prefers-reduced-motion` transition removal. Preserve and rebase existing machine catalogue/detail classes on the new tokens.

- [x] **Step 5: Confirm GREEN and run typecheck**

Run: `pnpm test src/components/ui/static-foundation.test.tsx && pnpm typecheck`

Expected: all focused tests pass and TypeScript exits zero.

### Task 2: Responsive site shell

**Files:**
- Test: `src/components/layout/site-shell.test.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/not-found.tsx`

**Interfaces:**
- Produces `SiteHeader()` with Home, Machines, Expertise, and Contact routes in desktop and native mobile navigation.
- Produces `SiteFooter()` with approved identity copy and the same route system.
- Root layout retains the skip link and wraps all routes with the shared shell.

- [x] **Step 1: Write the server-rendered shell test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

describe("site shell", () => {
  it("exposes every approved route on desktop and mobile", () => {
    const markup = renderToStaticMarkup(<><SiteHeader /><SiteFooter /></>);
    for (const route of ["/", "/machines", "/expertise", "/contact"]) {
      expect(markup).toContain(`href="${route}"`);
    }
    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain("Moroccan industrial machine manufacturer");
  });
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run: `pnpm test src/components/layout/site-shell.test.tsx`

Expected: FAIL because the shell components do not exist.

- [x] **Step 3: Implement the header and footer**

Render a standard desktop nav plus a native `<details><summary>Menu</summary>` mobile disclosure. Keep all labels literal and approved: `Home`, `Machines`, `Expertise`, and `Contact`. Use `ActionLink` for the contact action and `Container` for alignment.

- [x] **Step 4: Integrate the shell and recovery route**

Replace inline header/footer markup in `layout.tsx`. Update `not-found.tsx` to include named links to Home, Machines, and Contact while keeping one `main#main-content` and one `h1`.

- [x] **Step 5: Confirm GREEN**

Run: `pnpm test src/components/layout/site-shell.test.tsx && pnpm typecheck`

Expected: all focused tests pass and TypeScript exits zero.

### Task 3: Seven-section static homepage

**Files:**
- Test: `src/components/home/homepage.test.tsx`
- Create: `src/components/home/homepage.tsx`
- Create: `src/components/home/home-hero.tsx`
- Create: `src/components/home/machine-stage.tsx`
- Create: `src/components/home/engineering-section.tsx`
- Create: `src/components/home/industries-section.tsx`
- Create: `src/components/home/featured-machines-section.tsx`
- Create: `src/components/home/custom-engineering-section.tsx`
- Create: `src/components/home/company-proof-section.tsx`
- Create: `src/components/home/contact-cta-section.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces `Homepage({ featuredMachines })` where `featuredMachines` contains only `slug`, `name`, `shortName`, `category`, `tagline`, `heroImage`, and `publicationStatus`.
- Each homepage chapter is a focused Server Component.
- `page.tsx` maps `getFeaturedMachines()` into the safe homepage prop shape.

- [x] **Step 1: Write the ordered homepage test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Homepage } from "./homepage";

describe("homepage", () => {
  it("renders the seven approved chapters in order", () => {
    const markup = renderToStaticMarkup(<Homepage featuredMachines={[]} />);
    const ids = ["hero", "engineering", "industries", "featured-machines", "custom-engineering", "company-proof", "contact"];
    ids.reduce((position, id) => {
      const next = markup.indexOf(`id="${id}"`);
      expect(next).toBeGreaterThan(position);
      return next;
    }, -1);
    expect(markup).toContain("DESIGNED.");
    expect(markup).toContain("ENGINEERED.");
    expect(markup).toContain("MANUFACTURED.");
    expect(markup).toContain("IN MOROCCO.");
    for (const industry of ["Textile", "Confection", "Agro-food", "Construction", "Custom engineering"]) {
      expect(markup).toContain(industry);
    }
  });

  it("uses honest actions and an empty featured state", () => {
    const markup = renderToStaticMarkup(<Homepage featuredMachines={[]} />);
    expect(markup).toContain('href="/machines"');
    expect(markup).toContain('href="/expertise"');
    expect(markup).toContain('href="/contact"');
    expect(markup).toContain("No verified featured machines are published yet.");
    expect(markup).not.toContain("development-machine");
  });
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run: `pnpm test src/components/home/homepage.test.tsx`

Expected: FAIL because `Homepage` does not exist.

- [x] **Step 3: Implement the homepage chapters**

Use the exact IDs, index values `01` through `07`, and content authorized in the design spec. `MachineStage` must render a decorative `aria-hidden="true"` SVG/CSS assembly with no product name, specification, or interactive behavior. `FeaturedMachinesSection` must render `MachineCard` only for supplied published records and otherwise render the exact tested empty-state sentence.

- [x] **Step 4: Connect the published-only repository query**

```tsx
export default function HomePage() {
  const featuredMachines = getFeaturedMachines().map((machine) => ({
    slug: machine.slug,
    name: machine.name,
    shortName: machine.shortName,
    category: machine.category,
    tagline: machine.tagline,
    heroImage: machine.heroImage,
    publicationStatus: machine.publicationStatus,
  }));

  return <Homepage featuredMachines={featuredMachines} />;
}
```

- [x] **Step 5: Confirm GREEN**

Run: `pnpm test src/components/home/homepage.test.tsx && pnpm typecheck`

Expected: all focused tests pass and TypeScript exits zero.

### Task 4: Expertise and contact foundations

**Files:**
- Test: `src/app/static-routes.test.tsx`
- Create: `src/app/expertise/page.tsx`
- Create: `src/app/contact/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/sitemap.test.ts`

**Interfaces:**
- `/expertise` renders approved manufacturing/custom-engineering positioning only.
- `/contact` renders inquiry framing without a fake form or unverified contact details.
- Sitemap adds `/expertise` and `/contact` while retaining published-only machine slugs.

- [x] **Step 1: Write the static-route and sitemap tests**

Render both route components to static markup and assert one `h1`, route cross-links, no `<form`, and no invented email/telephone. Extend the sitemap expectation to exactly `/`, `/machines`, `/expertise`, and `/contact` for an empty published catalogue.

- [x] **Step 2: Run the focused tests and confirm RED**

Run: `pnpm test src/app/static-routes.test.tsx src/app/sitemap.test.ts`

Expected: FAIL because the route modules do not exist and sitemap lacks two routes.

- [x] **Step 3: Implement both route foundations**

Use `Section`, `Container`, and `ActionLink`. Expertise may state only that MINDEQ is a Moroccan industrial machine manufacturer and custom-engineering partner across the five approved industry areas. Contact must explain the inquiry intent and that production delivery/privacy handling require approval; it must not render a submission form.

- [x] **Step 4: Extend the sitemap**

Add `/expertise` and `/contact` to the static path array before published machine slugs.

- [x] **Step 5: Confirm GREEN**

Run: `pnpm test src/app/static-routes.test.tsx src/app/sitemap.test.ts && pnpm typecheck`

Expected: all focused tests pass and TypeScript exits zero.

### Task 5: Full validation, responsive review, and commit

**Files:**
- Verify every Task 04 source and test file.
- Update this plan’s checkboxes only after evidence exists.

**Interfaces:**
- Produces a committed static foundation ready for Task 05 browser-led visual art direction.

- [x] **Step 1: Run automated validation**

Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`. Require zero warnings/errors and all tests passing.

- [x] **Step 2: Run a production build**

Set `MINDEQ_SITE_URL=https://mindeq.example` only for local verification, then run `pnpm build`. Require a successful build with `/`, `/machines`, `/machines/[slug]`, `/expertise`, `/contact`, and `/sitemap.xml` in the route table.

- [x] **Step 3: Run browser validation**

Start the production server with a hidden process. At 1920×1080, 1440×900, 1366×768, 430×932, and 390×844 verify:

- the seven sections exist in order;
- primary navigation reaches all routes;
- no page has horizontal overflow;
- focus indicators are visible;
- the mobile disclosure exposes every route;
- the development machine is absent from homepage and production catalogue;
- the browser console has no hydration or runtime errors.

- [x] **Step 4: Review the complete diff**

Run `git diff --check`, review every staged path, scan for common secret patterns, confirm no `.next`, logs, local `.env`, screenshots, generated output, 3D/animation dependencies, or unverified factual claims are staged.

- [x] **Step 5: Commit the implementation**

Commit with `feat: build static site foundation` and preserve the branch without pushing or starting Task 05.

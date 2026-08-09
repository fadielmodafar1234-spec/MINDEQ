# MINDEQ Static Implementation Cleanup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the locked Task 05 implementation without redesigning its visible composition.

**Architecture:** Keep the existing server-rendered component tree and CSS cascade, but split the global stylesheet into responsibility-focused imports. Centralize the site-navigation tuple and machine-card summary projection, then repair malformed/duplicate CSS and unsupported CAD labels through focused test-first changes.

**Tech Stack:** Next.js 16.3.0 App Router, React 19.2.8, strict TypeScript 6.0.3, Tailwind CSS 4.3.3/PostCSS, Vitest 4.1.10, semantic HTML and global CSS.

## Global Constraints

- Follow `AGENTS.md`, `docs/DECISIONS.md`, and `docs/superpowers/specs/2026-08-09-static-implementation-cleanup-design.md`.
- Treat Task 05 commit `28c903f` as the visual baseline; do not redesign approved work.
- Keep the seven homepage sections, DOM reading order, content hierarchy, route behavior, responsive breakpoints, and effective computed declarations unchanged except for the approved integrity repairs.
- Add no runtime or development dependency.
- Add no animation, 3D, WebGL, new route, machine claim, dimension, statistic, or product identifier.
- Preserve strict TypeScript, Server Components, semantic HTML, mobile navigation lifecycle, focus visibility, and reduced-motion behavior.
- Validate 1920×1080, 1440×900, 1366×768, 430×932, and 390×844.
- Do not begin Task 07.

---

### Task 1: Capture and protect the locked baseline

**Files:**
- Modify: `.git/info/exclude` (local-only browser artifacts)
- Verify: all Task 05 routes and source files

**Interfaces:**
- Consumes: Task 05 commit `28c903f`.
- Produces: automated and visual evidence against which the refactor is compared.

- [ ] **Step 1: Install and verify the existing project without changing dependencies**

Run: `pnpm install --frozen-lockfile`

Expected: dependency graph is already satisfied and `pnpm-lock.yaml` remains unchanged.

- [ ] **Step 2: Run the automated baseline**

Run: `pnpm lint`, `pnpm typecheck`, `pnpm test`, then set `MINDEQ_SITE_URL=https://mindeq.example` and run `pnpm build`.

Expected: zero lint warnings, zero type errors, all existing tests pass, and the production build lists `/`, `/machines`, `/machines/[slug]`, `/expertise`, `/contact`, and `/sitemap.xml`.

- [ ] **Step 3: Capture the Task 05 browser baseline**

Start `next start` on a local port, then use Playwright CLI to capture `output/playwright/task05-baseline-{width}x{height}.png` at all five required viewports. At each viewport record:

```js
({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  sections: [...document.querySelectorAll("main section")].map((node) => node.id),
  developmentLeak: document.body.textContent?.includes("development-machine") ?? false,
})
```

Expected: no overflow, the exact seven-section order, and no production development-machine leak.

### Task 2: Modular stylesheet boundaries and CSS integrity

**Files:**
- Modify: `src/components/ui/static-foundation.test.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/styles/foundation.css`
- Create: `src/app/styles/site-shell.css`
- Create: `src/app/styles/machines.css`
- Create: `src/app/styles/homepage.css`
- Create: `src/app/styles/responsive.css`

**Interfaces:**
- Consumes: the exact declaration order in Task 05 `src/app/globals.css`.
- Produces: one global entry stylesheet with five ordered ownership imports.

- [ ] **Step 1: Write the failing stylesheet-composition test**

Extend `static-foundation.test.tsx` with:

```ts
const stylesheetPaths = [
  "src/app/styles/foundation.css",
  "src/app/styles/site-shell.css",
  "src/app/styles/machines.css",
  "src/app/styles/homepage.css",
  "src/app/styles/responsive.css",
] as const;

const entryCss = readFileSync("src/app/globals.css", "utf8");
const css = stylesheetPaths
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

expect(entryCss).toBe(
  [
    '@import "tailwindcss";',
    '@import "./styles/foundation.css";',
    '@import "./styles/site-shell.css";',
    '@import "./styles/machines.css";',
    '@import "./styles/homepage.css";',
    '@import "./styles/responsive.css";',
    "",
  ].join("\n"),
);
expect(css.match(/^\.company-facts \{/gm)).toHaveLength(1);
expect(css.match(/^\.company-facts li \{/gm)).toHaveLength(1);
expect(css).not.toContain(
  "}\n  stroke: color-mix(in srgb, var(--color-canvas) 20%, transparent);",
);
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `pnpm test src/components/ui/static-foundation.test.tsx`

Expected: FAIL because the five owned stylesheet files do not exist.

- [ ] **Step 3: Split the stylesheet without changing cascade order**

Set `globals.css` to the six imports in Step 1. Move existing rule blocks verbatim into:

- `foundation.css`: `:root` through `.section--dark .action-link--text`;
- `site-shell.css`: `.page-shell` through `.eyebrow`;
- `machines.css`: `.catalogue-shell > *` through `.machine-gallery figure`;
- `homepage.css`: `.homepage .eyebrow` through `.contact-chapter > .action-link`;
- `responsive.css`: the hover, `max-width: 48rem`, and reduced-motion media queries.

Delete the orphan declarations after `.machine-stage__dim-text`. Merge the two top-level `.company-facts` blocks and two `.company-facts li` blocks so the single effective rules retain `display: grid`, `list-style: none`, `display: flex`, `align-items: baseline`, and `gap: var(--space-4)`.

- [ ] **Step 4: Confirm GREEN and build CSS**

Run: `pnpm test src/components/ui/static-foundation.test.tsx`, `pnpm typecheck`, and `MINDEQ_SITE_URL=https://mindeq.example pnpm build`.

Expected: focused tests and build pass; PostCSS reports no malformed stylesheet.

- [ ] **Step 5: Commit the stylesheet boundary**

```bash
git add src/app/globals.css src/app/styles src/components/ui/static-foundation.test.tsx
git commit -m "refactor: modularize locked static styles"
```

### Task 3: Canonical navigation metadata

**Files:**
- Modify: `src/components/layout/navigation-routes.ts`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/components/layout/site-shell.test.tsx`

**Interfaces:**
- Produces: `primaryNavigationRoutes`, `contactNavigationRoute`, and `siteNavigationRoutes`, all immutable typed route records.

- [ ] **Step 1: Write the failing canonical-route test**

Import `siteNavigationRoutes` in `site-shell.test.tsx` and assert:

```ts
expect(siteNavigationRoutes).toEqual([
  { href: "/", label: "Home" },
  { href: "/machines", label: "Machines" },
  { href: "/expertise", label: "Expertise" },
  { href: "/contact", label: "Contact" },
]);
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `pnpm test src/components/layout/site-shell.test.tsx`

Expected: FAIL because `siteNavigationRoutes` is not exported.

- [ ] **Step 3: Implement the canonical tuple**

Define four route records once, then export:

```ts
export const primaryNavigationRoutes = [homeRoute, machinesRoute, expertiseRoute] as const;
export const contactNavigationRoute = contactRoute;
export const siteNavigationRoutes = [
  ...primaryNavigationRoutes,
  contactNavigationRoute,
] as const;
```

Use `primaryNavigationRoutes` plus `contactNavigationRoute` in header/mobile so Contact retains its `ActionLink`, and use `siteNavigationRoutes` in the footer.

- [ ] **Step 4: Confirm GREEN and unchanged markup**

Run: `pnpm test src/components/layout/site-shell.test.tsx && pnpm typecheck`.

Expected: navigation behavior and independently asserted Primary, Mobile, and Footer markup pass.

- [ ] **Step 5: Commit canonical navigation metadata**

```bash
git add src/components/layout
git commit -m "refactor: centralize site navigation routes"
```

### Task 4: Machine-card projection and honest CAD annotations

**Files:**
- Create: `src/lib/machines/card-summary.ts`
- Create: `src/lib/machines/card-summary.test.ts`
- Modify: `src/components/machines/machine-card.tsx`
- Modify: `src/components/home/featured-machines-section.tsx`
- Modify: `src/components/home/homepage.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/machines/page.tsx`
- Modify: `src/components/home/homepage.test.tsx`
- Modify: `src/components/home/machine-stage.tsx`

**Interfaces:**
- Produces: `MachineCardSummary` and `toMachineCardSummary(machine: Machine): MachineCardSummary`.

- [ ] **Step 1: Write the failing projection and CAD-copy tests**

Create a presenter test using `machineRecords[0]` and assert:

```ts
expect(Object.keys(toMachineCardSummary(machine))).toEqual([
  "slug",
  "name",
  "shortName",
  "category",
  "tagline",
  "heroImage",
  "publicationStatus",
]);
```

Extend `homepage.test.tsx`:

```ts
expect(markup).toContain("REF: STATIC-DATUM");
expect(markup).toContain("DATUM X // REFERENCE");
expect(markup).toContain("DATUM Y // REFERENCE");
expect(markup).not.toContain("MINDEQ-TCM1600");
expect(markup).not.toMatch(/\b\d+\s*mm\b/i);
```

- [ ] **Step 2: Run both tests and confirm RED**

Run: `pnpm test src/lib/machines/card-summary.test.ts src/components/home/homepage.test.tsx`

Expected: FAIL because the presenter is missing and the CAD stage still contains unsupported claims.

- [ ] **Step 3: Implement the narrow presenter**

```ts
export type MachineCardSummary = Pick<
  Machine,
  | "slug"
  | "name"
  | "shortName"
  | "category"
  | "tagline"
  | "heroImage"
  | "publicationStatus"
>;

export function toMachineCardSummary(machine: Machine): MachineCardSummary {
  return {
    slug: machine.slug,
    name: machine.name,
    shortName: machine.shortName,
    category: machine.category,
    tagline: machine.tagline,
    heroImage: machine.heroImage,
    publicationStatus: machine.publicationStatus,
  };
}
```

Use the shared type in `MachineCard`, `Homepage`, and `FeaturedMachinesSection`. Use `.map(toMachineCardSummary)` in both routes.

- [ ] **Step 4: Replace only the unsupported CAD strings**

Keep every SVG element, coordinate, class, and wrapper unchanged. Replace only the three text nodes with the neutral labels from the design spec.

- [ ] **Step 5: Confirm GREEN**

Run: `pnpm test src/lib/machines/card-summary.test.ts src/components/home/homepage.test.tsx src/components/machines/machine-content.test.tsx && pnpm typecheck`.

Expected: projection, content-integrity, homepage, and machine-card tests pass.

- [ ] **Step 6: Commit data-boundary cleanup**

```bash
git add src/lib/machines/card-summary.ts src/lib/machines/card-summary.test.ts src/components src/app/page.tsx src/app/machines/page.tsx
git commit -m "refactor: stabilize static rendering boundaries"
```

### Task 5: Full validation and visual equivalence

**Files:**
- Update: this plan’s checkboxes after evidence exists.
- Verify: complete `28c903f..HEAD` range.

- [x] **Step 1: Run fresh automated validation**

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and the production build with `MINDEQ_SITE_URL=https://mindeq.example`.

Expected: zero warnings/errors, every test passes, and all required routes build.

- [x] **Step 2: Capture and inspect Task 06 screenshots**

Capture `output/playwright/task06-result-{width}x{height}.png` at the five baseline viewports. Compare against Task 05 screenshots, allowing only the approved neutral CAD-label glyph differences. Confirm no clipping, overflow, spacing drift, wrapping regression, focus regression, or mobile-menu regression.

- [x] **Step 3: Validate browser behavior and route output**

Verify exact section order, every primary route, mobile menu open/Escape/link-close behavior, visible focus, no horizontal overflow, no unsupported CAD claim, no development-machine production leak, and no hydration/runtime errors.

- [x] **Step 4: Review repository hygiene**

Run `git diff --check`, inspect every changed path, scan tracked source for secrets and forbidden animation/3D dependencies, and confirm `.next`, logs, screenshots, local `.env`, and generated output are not tracked.

- [ ] **Step 5: Request final code review and resolve all Critical/Important findings**

Review `28c903f..HEAD` against Task 06, the design spec, the locked decision, test coverage, and the browser evidence. Re-run affected validations after any fix.

- [ ] **Step 6: Commit the completed checklist and preserve the branch**

```bash
git add docs/superpowers/plans/2026-08-09-static-implementation-cleanup.md
git commit -m "refactor: stabilize approved static implementation"
```

Push `task-06-static-implementation-cleanup` only after final verification. Do not merge and do not start Task 07.

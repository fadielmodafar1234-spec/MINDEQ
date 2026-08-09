# MINDEQ Machine Data Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Scaffold the MINDEQ Next.js application and deliver a runtime-validated machine repository powering a catalogue, one reusable dynamic detail route, development-only placeholder content, and real invalid-route behavior.

**Architecture:** Next.js App Router Server Components consume a synchronous repository that validates locally versioned machine records with Zod at the content boundary. Development records are available only in development/test preview access, while production queries, static parameters, metadata, and sitemap expose published records only.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3, Zod 4.4.3, Vitest 4.1.10, ESLint 9.39.5, pnpm 11.16.0.

## Global Constraints

- Use strict TypeScript and no machine-specific route markup.
- Keep pages and technical content as Server Components.
- Do not add 3D, GSAP, Lenis, Anime.js, a CMS, or a UI framework.
- Label development content exactly DEVELOPMENT PLACEHOLDER — NOT VERIFIED.
- Exclude development records from production routes, metadata, sitemap, and featured queries.
- Never invent real machine specifications, dimensions, capabilities, documents, or SEO claims.
- Add no individual hardcoded page per machine.
- Validate with lint, typecheck, unit tests, production build, development HTTP routes, and production placeholder exclusion.
- Do not start Task 04.

---

### Task 1: Application scaffold

**Files:**
- Create: package.json
- Create: pnpm-lock.yaml through pnpm install
- Create: tsconfig.json
- Create: next.config.ts
- Create: postcss.config.mjs
- Create: eslint.config.mjs
- Create: vitest.config.ts
- Create: .gitignore
- Create: src/app/globals.css
- Create: src/app/layout.tsx
- Create: src/app/page.tsx
- Create: src/app/not-found.tsx

**Interfaces:**
- Produces scripts named dev, build, start, lint, typecheck, test, and test:watch.
- Produces the @/* alias mapped to src/*.

- [x] Create the configuration files with the exact pinned dependency versions in the plan header.
- [x] Configure Tailwind through @tailwindcss/postcss and import tailwindcss in globals.css.
- [x] Configure Next.js core-web-vitals plus TypeScript ESLint flat configs.
- [x] Add a semantic root layout, skip link, minimal non-art-directed shell, home scaffold, and accessible 404.
- [x] Run pnpm install and confirm the lockfile is generated.
- [x] Run pnpm lint and pnpm typecheck; both must exit zero before the behavior implementation begins.

### Task 2: Runtime machine schema

**Files:**
- Test: src/lib/machines/schema.test.ts
- Create: src/lib/machines/schema.ts
- Create: src/lib/machines/types.ts

**Interfaces:**
- Produces parseMachineCatalogue(input: unknown): readonly Machine[].
- Produces Machine and related types inferred from the runtime schemas.
- Produces publicationStatusSchema and contentVerificationStatusSchema.

- [x] Write a test that imports parseMachineCatalogue and accepts one minimal development record with all conceptual top-level fields.
- [x] Run the focused test and confirm RED because the schema module does not exist.
- [x] Implement the minimal schemas required for that development record and confirm GREEN.
- [x] Add one failing test at a time for non-canonical slugs, duplicate machine slugs, duplicate machine-local IDs, published records missing required content, featured non-published records, model-without-poster records, unknown hotspot component IDs, and canonical-path mismatch.
- [x] After each RED result, add only the validation required for GREEN and rerun the focused suite.
- [x] Refactor shared technical-value, media, and identifier schemas while the full suite remains green.

### Task 3: Machine content and repository

**Files:**
- Test: src/lib/machines/repository.test.ts
- Create: src/content/machines/categories.ts
- Create: src/content/machines/development-machine.ts
- Create: src/content/machines/records.ts
- Create: src/lib/machines/repository.ts
- Create: src/lib/machines/sorting.ts
- Create: public/placeholders/machine-poster.svg

**Interfaces:**
- Produces getMachines(): readonly Machine[] for published catalogue records.
- Produces getFeaturedMachines(): readonly Machine[] for published featured records.
- Produces getMachineBySlug(slug: string): Machine | null for published records.
- Produces getMachinePreviewBySlug(slug: string): Machine | null for development/test preview.
- Produces getPublishedMachineSlugs(): readonly string[].
- Produces getMachinesForEnvironment(): readonly Machine[] and getMachineForEnvironment(slug: string): Machine | null.

- [x] Write repository tests first for stable ordering, production exclusion, development preview retrieval, invalid lookup, published-slug filtering, and immutable returned collections.
- [x] Run the repository tests and confirm RED because the repository does not exist.
- [x] Add the centralized brief-approved categories, one unmistakably labeled placeholder record, and repository functions.
- [x] Keep source references and editorial data server-side by importing the repository only from server routes.
- [x] Confirm GREEN and verify no placeholder specification, dimension, documentation, model, hotspot, or SEO claim is presented as real.

### Task 4: Catalogue and reusable machine route

**Files:**
- Test: src/components/machines/machine-content.test.tsx
- Create: src/components/machines/development-placeholder-notice.tsx
- Create: src/components/machines/machine-card.tsx
- Create: src/components/machines/machine-technical-content.tsx
- Create: src/app/machines/page.tsx
- Create: src/app/machines/[slug]/page.tsx
- Create: src/app/sitemap.ts
- Test: src/app/sitemap.test.ts
- Create: .env.example

**Interfaces:**
- MachineCard consumes only catalogue-safe Machine fields.
- MachineTechnicalContent consumes one Machine and renders only non-empty verified/development groups.
- The dynamic page uses getMachineForEnvironment and notFound, never slug-specific markup.
- Sitemap generation requires the human-approved MINDEQ_SITE_URL origin and fails clearly when it is absent.

- [x] Write a server-rendering component test that requires the exact development warning and verifies empty technical groups are omitted.
- [x] Run the focused component test and confirm RED because the components do not exist.
- [x] Implement semantic reusable components and confirm GREEN.
- [x] Add /machines using getMachinesForEnvironment with a production-safe empty state.
- [x] Add /machines/[slug] with async params, generated metadata, published-only static params, a poster fallback, and notFound for unavailable slugs.
- [x] Add a sitemap containing static routes plus published machine slugs only.
- [x] Keep every route a Server Component and pass no source references into rendered component props.

### Task 5: Full validation and commit

**Files:**
- Verify all Task 03 files.
- Update this plan's checkboxes after successful evidence.

**Interfaces:**
- Produces a committed Task 03 phase ready for the static design foundation.

- [x] Run pnpm lint and require zero errors or warnings.
- [x] Run pnpm typecheck and require exit zero.
- [x] Run pnpm test and require all tests passing.
- [x] Run pnpm build with MINDEQ_SITE_URL set to a reserved verification origin and require the production build to complete.
- [x] Start the development server and verify /machines and the development placeholder route return 200, while an invalid slug returns 404.
- [x] Start the production server and verify the placeholder route returns 404 and the production catalogue does not contain the development label.
- [x] Run git diff --check, review the full staged file set, and confirm no generated output or secrets are staged.
- [x] Commit with message feat: add typed machine data architecture.

# Machine Detail Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one reusable, schema-driven `/machines/[slug]` experience that renders every required machine content region without exposing unverified development content in production.

**Architecture:** A server-safe presenter converts a validated `Machine` into a narrow page model, filtering rejected values and internal editorial fields. Focused Server Components render identity, calibrated viewer/poster, semantic technical tables, media, downloads, and quotation intent; the existing MachineViewer remains the only WebGL client boundary.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, strict TypeScript, Zod-backed machine records, React Three Fiber MachineViewer, Vitest, CSS.

## Global Constraints

- Start from Task 08 commit `032adcd984f01df56bece4ee492d79999fe50ed7`.
- Preserve the locked Task 05 site art direction and Task 08 viewer calibration.
- Keep `/machines/[slug]` as the only machine-detail route.
- Never invent or publish machine facts, dimensions, documents, or quotation claims.
- Development proof content must remain unavailable from production catalogue, sitemap, metadata, machine routes, and asset endpoints.
- Prefer Server Components; do not expand the client boundary beyond MachineViewer.
- Omit optional sections and headings when filtered content is empty.
- Keep technical content semantic, keyboard accessible, and usable without JavaScript or WebGL.
- Add no dependency.
- Do not begin Task 10 visual polish.

---

### Task 1: Add the narrow machine-detail presenter

**Files:**
- Create: `src/lib/machines/detail-page.ts`
- Create: `src/lib/machines/detail-page.test.ts`

**Interfaces:**
- Consumes: `Machine` from `src/lib/machines/types.ts`.
- Produces: `MachineDetailPageModel` and `toMachineDetailPageModel(machine: Machine): MachineDetailPageModel`.
- The model contains identity, poster, overview, applications, features, filtered specification/dimension groups, hotspots, gallery, documentation, publication status, and `quotationHref`; it does not contain source references, model binaries, or editorial notes.

- [x] **Step 1: Write the failing presenter contract tests**

Create tests that use `getMachinePreviewBySlug("development-machine")` plus a local immutable test object where necessary:

```ts
const detail = toMachineDetailPageModel(machine);

expect(detail.identity.slug).toBe("development-machine");
expect(detail.quotationHref).toEqual({
  pathname: "/contact",
  query: { intent: "quotation", machine: "development-machine" },
});
expect("sourceReferences" in detail).toBe(false);
expect(detail.specificationGroups[0]?.items).toEqual([
  expect.objectContaining({ id: "visible-value" }),
]);
expect(JSON.stringify(detail)).not.toContain("rejected-value");
```

Also assert that groups left empty after filtering are removed, original list order is preserved, and missing revision/date fields remain absent.

- [x] **Step 2: Run the test and verify RED**

Run:

```bash
pnpm test src/lib/machines/detail-page.test.ts
```

Expected: FAIL because `detail-page.ts` does not exist.

- [x] **Step 3: Implement the presenter and exported types**

Use explicit readonly view types and one filtering helper. Define the item
alias from the validated machine type so specifications, dimensions, and
hotspot values cannot drift into parallel schemas:

```ts
type MachineTechnicalItem =
  Machine["specifications"][number]["items"][number];

function isPresentableTechnicalItem(
  item: MachineTechnicalItem,
): boolean {
  return item.verificationStatus !== "rejected-or-superseded";
}

export function toMachineDetailPageModel(
  machine: Machine,
): MachineDetailPageModel {
  return {
    identity: {
      slug: machine.slug,
      name: machine.name,
      category: machine.category.label,
      ...(machine.tagline ? { tagline: machine.tagline } : {}),
      publicationStatus: machine.publicationStatus,
    },
    overview: machine.description,
    poster: machine.modelPoster ?? machine.heroImage,
    applications: machine.applications,
    features: machine.features,
    specificationGroups: filterGroups(machine.specifications),
    dimensionGroups: filterGroups(machine.dimensions),
    hotspots: machine.hotspots.map(filterHotspotValues),
    gallery: machine.gallery,
    documentation: machine.documentation,
    quotationHref: {
      pathname: "/contact",
      query: { intent: "quotation", machine: machine.slug },
    },
  };
}
```

Do not spread the full `Machine`; build the result field by field.

- [x] **Step 4: Run focused tests and strict typecheck**

Run:

```bash
pnpm test src/lib/machines/detail-page.test.ts
pnpm typecheck
```

Expected: presenter tests PASS and TypeScript exits 0.

- [x] **Step 5: Review and commit**

Run `git diff --check`, confirm the presenter contains no `sourceReferences`, then commit:

```bash
git add src/lib/machines/detail-page.ts src/lib/machines/detail-page.test.ts
git commit -m "feat: add machine detail page presenter"
```

---

### Task 2: Render scannable reusable detail sections

**Files:**
- Create: `src/components/machines/machine-technical-table.tsx`
- Create: `src/components/machines/machine-detail-page.tsx`
- Modify: `src/components/machines/machine-technical-content.tsx`
- Modify: `src/components/machines/machine-content.test.tsx`
- Modify: `src/components/ui/action-link.tsx`

**Interfaces:**
- Consumes: `MachineDetailPageModel` and `MachineViewerConfig | null`.
- Produces: `MachineDetailPage({ machine, viewerConfig })`, `MachineTechnicalContent({ machine })`, and semantic `MachineTechnicalTable` groups.

- [x] **Step 1: Write failing static-render tests for the complete page**

Add a populated typed fixture and assert:

```ts
expect(markup).toContain('<h1>Development Machine</h1>');
expect(markup).toContain('aria-labelledby="applications-heading"');
expect(markup).toContain('<table>');
expect(markup).toContain('<th scope="row">Test capacity</th>');
expect(markup).toContain('Test value test-unit');
expect(markup).toContain('Machine details');
expect(markup).toContain('Gallery');
expect(markup).toContain('Documentation');
expect(markup).toContain('/contact?intent=quotation&amp;machine=development-machine');
expect(markup).not.toContain('Rejected value');
```

Retain and strengthen the existing empty-group test so empty applications,
features, groups, hotspots, gallery, and documentation do not produce headings.

- [x] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm test src/components/machines/machine-content.test.tsx
```

Expected: FAIL because the reusable page and table components do not exist.

- [x] **Step 3: Implement the semantic technical table**

Render one labelled scroll region per group:

```tsx
<div
  aria-labelledby={`${group.id}-heading`}
  className="machine-table-scroll"
  role="region"
  tabIndex={0}
>
  <table>
    <tbody>
      {group.items.map((item) => (
        <tr key={item.id}>
          <th scope="row">{item.label}</th>
          <td>
            <span>{item.value}{item.unit ? ` ${item.unit}` : null}</span>
            {item.note ? <small>{item.note}</small> : null}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

The heading is outside the table and has the exact `${group.id}-heading` id.

- [x] **Step 4: Refactor technical content into focused semantic regions**

Render applications and features as lists, specification and dimension groups
through `MachineTechnicalTable`, optional dimension drawings as `Image`, hotspot
DOM equivalents with technical tables, and documentation as download links.
Documentation metadata must use conditional fragments only:

```tsx
<a href={document.file}>{document.title}</a>
<span>{document.type} · {document.language}</span>
{document.revision ? <span>Revision {document.revision}</span> : null}
{document.date ? <time dateTime={document.date}>{document.date}</time> : null}
```

- [x] **Step 5: Implement the reusable page composition**

Move the route's current identity, viewer/poster, overview, gallery, and CTA
markup into `MachineDetailPage`. Preserve `DevelopmentPlaceholderNotice` and
the existing calibrated `MachineViewer` component unchanged. Extend
`ActionLink`'s public href type from `Route` to `LinkProps["href"]` so typed
route literals and Next.js URL objects both remain supported without a cast.
The CTA is:

```tsx
<section aria-labelledby="quotation-heading" className="machine-quotation">
  <h2 id="quotation-heading">Discuss this machine</h2>
  <p>Contact MINDEQ to discuss your production requirement.</p>
  <ActionLink href={machine.quotationHref} variant="primary">
    Request a quotation
  </ActionLink>
</section>
```

For a development record, render the existing warning directly before the
viewer. Do not claim that a quotation service or response time exists.

- [x] **Step 6: Run focused tests, typecheck, and commit**

Run:

```bash
pnpm test src/components/machines/machine-content.test.tsx
pnpm typecheck
git diff --check
```

Expected: focused tests PASS, TypeScript exits 0, and no whitespace errors.

Commit:

```bash
git add src/components/machines src/components/ui/action-link.tsx
git commit -m "feat: compose reusable machine detail sections"
```

---

### Task 3: Wire the generic route and development-only proof content

**Files:**
- Modify: `src/app/machines/[slug]/page.tsx`
- Modify: `src/content/machines/development-machine.ts`
- Modify: `src/app/api/development-assets/[asset]/route.ts`
- Modify: `scripts/generate-development-model.mjs`
- Modify: `src/lib/machines/repository.test.ts`
- Modify: `src/app/static-routes.test.tsx`

**Interfaces:**
- Consumes: `toMachineDetailPageModel`, `createMachineViewerConfig`, and the existing environment-aware repository.
- Produces: one generic route, a fully populated local proof record, and a guarded development documentation download.

- [x] **Step 1: Write failing route, data, and asset-isolation tests**

Assert that the development record contains at least one application, feature,
specification group, dimension group, hotspot technical value, gallery item, and
documentation item. Assert the document route returns its text fixture in test
but calls not-found behavior in production. Assert production repository
functions still return no development machine and no published slug.

Add a static route source assertion that the dynamic page imports
`MachineDetailPage` and `toMachineDetailPageModel`, and does not contain
machine-specific slug branches.

- [x] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm test src/lib/machines/repository.test.ts src/app/static-routes.test.tsx
```

Expected: FAIL because the fixture is not populated and route composition is
not wired.

- [x] **Step 3: Expand the development fixture honestly**

Use the exact development warning in all synthetic descriptions and values.
Example technical item:

```ts
{
  id: "development-specification-value",
  label: "Development test parameter",
  value: DEVELOPMENT_PLACEHOLDER_LABEL,
  note: "Synthetic value used only to test the reusable table.",
  verificationStatus: "development-placeholder",
}
```

Use known component id `inspection-head` for the development feature and
hotspot. Reuse `/placeholders/machine-poster.svg` for drawing and gallery proof.
Add a development documentation record pointing to
`/api/development-assets/development-machine.documentation.txt` with
`publicationStatus: "development"`.

- [x] **Step 4: Extend the guarded development-asset route**

Generate a UTF-8 text file next to the synthetic GLB in
`.mindeq-development-assets`. Replace the one-name route constant with an exact
asset registry containing only the GLB and text fixture, with their content
types. Keep the first guard unconditional:

```ts
if (process.env.NODE_ENV === "production") {
  notFound();
}

const definition = DEVELOPMENT_ASSETS[asset];
if (!definition) {
  notFound();
}
```

Every response keeps `Cache-Control: no-store`, `X-Content-Type-Options:
nosniff`, and `X-Robots-Tag: noindex, nofollow`. Do not join an unvalidated URL
value into a filesystem path.

- [x] **Step 5: Simplify the route to reusable composition**

After lookup/not-found, derive both contracts and render:

```tsx
const viewerConfig = createMachineViewerConfig(machine);
const detailModel = toMachineDetailPageModel(machine);

return (
  <MachineDetailPage
    machine={detailModel}
    viewerConfig={viewerConfig}
  />
);
```

Keep metadata and static param behavior unchanged.

- [x] **Step 6: Run focused and full tests, typecheck, and commit**

Run:

```bash
pnpm test src/lib/machines/repository.test.ts src/app/static-routes.test.tsx src/components/machines/machine-content.test.tsx
pnpm test
pnpm typecheck
git diff --check
```

Expected: every test passes and strict TypeScript exits 0.

Commit:

```bash
git add scripts/generate-development-model.mjs src/app src/content/machines/development-machine.ts src/lib/machines
git commit -m "feat: prove the reusable machine detail route"
```

---

### Task 4: Add structural responsive styling and complete validation

**Files:**
- Modify: `src/app/styles/machines.css`
- Modify: `src/app/styles/responsive.css`
- Modify: `src/components/ui/static-foundation.test.tsx`
- Update: `docs/superpowers/plans/2026-08-10-machine-detail-experience.md`

**Interfaces:**
- Consumes: stable class hooks from Task 2.
- Produces: readable document flow, contained table overflow, responsive gallery, usable downloads/CTA, and final Task 09 evidence.

- [x] **Step 1: Write failing structural CSS assertions**

Assert the composed CSS contains required selectors and behavior:

```ts
expect(css).toMatch(/\.machine-detail-section\s*\{/);
expect(css).toMatch(/\.machine-table-scroll\s*\{[^}]*overflow-x:\s*auto;/s);
expect(css).toMatch(/\.machine-table-scroll:focus-visible/);
expect(css).toMatch(/\.machine-document-list/);
expect(css).toMatch(/\.machine-quotation/);
```

Do not encode exact Task 10 visual values in the test.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test src/components/ui/static-foundation.test.tsx
```

Expected: FAIL because the new structural selectors are absent.

- [x] **Step 3: Add minimum structural CSS**

Use existing tokens only. Add section flow, list/grid structure, full-width
tables, row separation, labelled scroll containment, visible focus, gallery
geometry, documentation list, and CTA structure. At narrow viewports preserve
page width and allow only `.machine-table-scroll` to scroll horizontally.

Do not change Task 08 selectors for canvas background, camera-facing controls,
hotspot colors, or viewer spacing.

- [x] **Step 4: Run all automated gates**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
$env:MINDEQ_SITE_URL='https://mindeq.example'; pnpm build
git diff --check 032adcd..HEAD
```

Expected: zero lint/type errors, all tests pass, and production build generates
the existing required routes without a development machine page.

- [x] **Step 5: Validate the development page in a real browser**

Run `pnpm dev`, then use Playwright CLI against
`http://127.0.0.1:<port>/machines/development-machine`. At 1920x1080,
1440x900, 1366x768, 430x932, and 390x844 verify exact required section order,
one H1, no page-level horizontal overflow, keyboard-focusable table scrollers,
working viewer/poster, gallery media, successful development download, and the
encoded quotation link. Inspect console and hydration output.

Capture ignored screenshots under `output/playwright/task09-result-<viewport>.png`.

- [x] **Step 6: Validate production isolation**

Serve the production build and verify:

- `/machines/development-machine` returns 404;
- `/api/development-assets/development-machine.documentation.txt` returns 404;
- `/machines`, `/sitemap.xml`, and built metadata contain no development slug,
  warning, specification, document, or download URL;
- the existing public routes have no horizontal overflow or console errors.

- [x] **Step 7: Review, check the plan, and commit**

Review every path in `git diff --name-status 032adcd..HEAD`, scan for
development-content production leaks and accidental Task 08 visual changes,
then check all evidence-backed plan boxes and commit:

```bash
git add src/app/styles src/components/ui/static-foundation.test.tsx docs/superpowers/plans/2026-08-10-machine-detail-experience.md
git commit -m "style: stabilize the machine detail experience"
```

- [ ] **Step 8: Request final review and push**

Review `032adcd..HEAD` against Task 09, resolve every Critical/Important issue,
rerun affected gates, then push `task-09-machine-detail-experience` without
merging. Confirm local and remote HEAD match. Do not start Task 10.

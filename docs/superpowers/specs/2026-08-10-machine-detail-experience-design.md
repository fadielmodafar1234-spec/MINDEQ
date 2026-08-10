# Task 09 Machine Detail Experience Design

## Status

Approved by the human on 2026-08-10. This design starts from Task 08 commit
`032adcd984f01df56bece4ee492d79999fe50ed7`, where the universal viewer's
camera, lighting, canvas, hotspots, and touch behavior are locked.

## Objective

Implement one reusable `/machines/[slug]` experience that renders every
machine from the existing validated machine-data contract. The page must make
identity, 3D media, narrative content, technical data, supporting media,
downloads, and quotation intent easy to scan without creating machine-specific
route markup.

No verified production machine specifications or documents exist in the
repository yet. Task 09 therefore proves the complete page architecture with
the existing development-only machine record. Every synthetic value and asset
remains unmistakably marked as development content and inaccessible from
production catalogue, sitemap, metadata, and machine routes.

## Locked constraints

- Preserve the approved Task 05 site art direction.
- Preserve the approved Task 08 MachineViewer calibration and its exposed
  configuration interface.
- Keep `/machines/[slug]` as the only machine-detail route.
- Read records through the repository boundary; route code must not import an
  individual machine record.
- Publish no invented machine facts, dimensions, capabilities, documents, or
  quotation claims.
- Prefer Server Components. The existing MachineViewer remains the intentional
  client/WebGL boundary.
- Omit optional sections when their filtered data is empty.
- Keep technical information accessible and useful without WebGL.
- Task 10 owns visual polish. Task 09 adds only the structural styling required
  for a stable, responsive, accessible page.

## Approaches considered

### 1. Typed detail presenter with focused sections — selected

A server-only presenter converts a validated `Machine` into the narrower data
needed by the page. Focused components render each content family. This keeps
editorial fields and unrelated catalogue data out of client props, gives Task
10 stable styling hooks, and makes optional-section behavior directly testable.

### 2. Continue expanding the dynamic route inline

This has the fewest initial files, but it would mix repository access,
filtering, page hierarchy, tables, media, downloads, and CTA construction in
one route. The component would become difficult to test and would encourage
future machine-specific conditionals.

### 3. Generic section registry driven by configuration

A registry could render arbitrary section types, but it adds indirection that
the current schema does not need. It would weaken semantic typing and make the
technical page harder to understand without providing a current product
benefit.

## Architecture

### Route ownership

`src/app/machines/[slug]/page.tsx` remains responsible for:

- resolving route parameters;
- querying the environment-aware repository;
- returning `notFound()` for unavailable records;
- generating safe metadata;
- deriving the MachineViewer configuration;
- passing one narrow detail model into the reusable page composition.

The route contains no machine-specific conditions or copied content sections.

### Detail presenter

Add a server-safe machine-detail presenter under `src/lib/machines/`. It:

- accepts one validated `Machine`;
- exposes only public page fields;
- excludes `sourceReferences` and internal model notes;
- filters every `rejected-or-superseded` technical value;
- removes specification and dimension groups left empty by filtering;
- preserves schema order for every list and group;
- derives a quotation URL from the canonical slug using URL-safe encoding;
- derives small display metadata for documentation without inventing missing
  revision or date values.

The resulting type is the single page-data contract. It is not serialized into
the viewer; `createMachineViewerConfig` continues to provide the viewer's
separate narrow contract.

### Reusable page composition

Create focused components under the machine-detail component area:

- **Machine identity:** category, name, optional tagline, and development
  warning.
- **Viewer region:** calibrated MachineViewer when a model and poster exist;
  otherwise the approved poster fallback.
- **Overview:** approved description.
- **Applications:** ordered semantic list, with optional descriptions.
- **Features:** ordered semantic list, with optional descriptions.
- **Technical tables:** one semantic table per specification group.
- **Dimension tables:** one semantic table per dimension group, plus an
  optional approved drawing.
- **Hotspot details:** DOM-equivalent hotspot content and verified technical
  values outside the canvas.
- **Gallery:** responsive figures with correct alternative text and optional
  captions.
- **Documentation:** public download links with available type, language,
  revision, and date metadata. Missing metadata is omitted.
- **Quotation CTA:** one link to `/contact` carrying only the machine slug and
  quotation intent in the query string.

The page hierarchy remains stable when optional sections are absent: identity,
viewer/poster, overview, available detail sections, then quotation CTA.

## Technical-data presentation

Specifications and dimensions use native `<table>` markup with a heading or
caption that names the group. Labels are row headers and values remain
source-preserving strings with optional units and notes.

Each table sits inside an explicitly labelled horizontal scroller. The wrapper
becomes keyboard focusable only where the layout requires scrolling, retains a
visible focus outline, and does not create page-level horizontal overflow.
Task 10 may tune the visual treatment but may not replace the table semantics.

Rejected or superseded values never render. Development-placeholder values may
render only on the development preview route under the page-level development
warning.

## Development proof content

Expand the existing `development-machine` fixture so the local preview proves
all optional sections. Content uses explicit labels such as
`DEVELOPMENT PLACEHOLDER — NOT VERIFIED`; synthetic technical values never
resemble production claims.

The proof includes:

- one development application;
- one development feature linked to a known component identifier;
- one specification group;
- one dimension group with the existing placeholder drawing;
- existing hotspots plus one development technical value;
- one gallery figure using approved placeholder media;
- one development-only downloadable text fixture served through the existing
  guarded development-assets route.

The guarded asset route must return 404 outside development/test. No
development documentation is placed in a public static directory.

## Quotation behavior

Task 09 does not implement a submission form or promise a quotation workflow.
The CTA links to `/contact?intent=quotation&machine=<canonical-slug>`. It sends
only approved identity context and works even if the contact page does not yet
consume the query. Development records can exercise the link locally but are
unavailable from production routes.

## Accessibility and progressive enhancement

- Maintain the existing skip link, landmarks, and one `<h1>`.
- Give every section a stable accessible heading.
- Preserve meaningful poster alternative text while the viewer loads or when
  WebGL is unavailable.
- Keep all hotspot information in DOM content, not canvas only.
- Use semantic lists, figures, tables, and links.
- Keep download and quotation targets understandable without surrounding
  styling.
- Preserve visible focus and at least 44px practical interactive targets.
- Prevent page-level horizontal overflow at the five protocol viewports.
- The complete technical page remains usable when JavaScript or WebGL fails.

## Error and missing-data behavior

- Unknown, invalid, review, and unpublished production slugs use Next.js
  `notFound()` behavior.
- Development preview remains available only in development and test.
- Missing model data uses the approved poster.
- Missing optional data omits the corresponding section and heading.
- A group containing only rejected values is omitted.
- Missing documentation metadata does not create substitute revision or date
  text.
- Failed WebGL continues to use the existing MachineViewer poster fallback.

## Styling boundary

Task 09 adds class hooks and the minimum CSS needed for:

- stable document flow;
- readable section grouping;
- semantic table layout and controlled mobile overflow;
- responsive gallery geometry;
- usable documentation and quotation actions;
- compatibility with the locked homepage and viewer tokens.

It does not recalibrate typography, viewer/title composition, table aesthetics,
gallery art direction, spacing rhythm, or CTA emphasis. Those are Task 10.

## Testing and validation

### Unit and server-render tests

- The presenter exposes the intended page fields and no source references.
- Rejected values and empty groups are removed.
- Optional missing sections render no empty headings.
- Every populated section renders from one structured fixture.
- Technical tables have correct headers, values, units, notes, and labels.
- Hotspot details remain present outside canvas content.
- Documentation metadata omission is honest.
- The quotation URL contains only encoded intent and machine identity.
- The route remains generic and the development record remains isolated from
  production repository functions.

### Automated gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- production build with the required `MINDEQ_SITE_URL`
- `git diff --check`

### Browser validation

In development, validate the populated preview route and its viewer/poster,
technical tables, gallery, guarded download, and quotation link. At 1920x1080,
1440x900, 1366x768, 430x932, and 390x844 confirm:

- no page-level horizontal overflow;
- scannable content order and heading hierarchy;
- usable table scrolling and focus;
- preserved Task 08 viewer calibration;
- clean console and hydration output;
- no broken media or download request.

In the production build, confirm the development slug and guarded development
download return 404 and do not appear in catalogue, sitemap, or metadata.

## Completion boundary

Task 09 is complete when one generic machine-detail experience renders every
schema-backed content region correctly, remains technically stable with
optional data, proves the flow with development-only content, passes automated
and browser validation, and introduces no production claims or Task 10 visual
polish.

Task 09 stops after its mandatory handoff to Antigravity for Task 10.

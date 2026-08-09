# MINDEQ Static Implementation Cleanup Design

## Status and authority

This design implements Task 06 from the master protocol against Task 05 commit `28c903f`. The visual hierarchy recorded in `docs/DECISIONS.md` is locked. This pass may repair technical defects and content-integrity violations, but it may not redesign composition, typography, spacing, color, or responsive behavior.

## Goal

Make the approved static implementation technically stable by clarifying ownership boundaries, removing malformed and duplicate CSS, consolidating repeated data projections, and strengthening regression coverage while keeping the rendered site effectively identical.

## Audit findings

- `src/app/globals.css` has grown to 950 lines and combines tokens, reset rules, shared layout, catalogue styles, homepage art direction, interactions, and responsive overrides in one file.
- The Task 05 CSS contains an orphan declaration block after `.machine-stage__dim-text` and duplicate `.company-facts` / `.company-facts li` rule blocks.
- Header, mobile, and footer navigation repeat route metadata rather than consuming one canonical site-navigation contract.
- Homepage and catalogue routes repeat the same manual projection from `Machine` to the narrow machine-card view model.
- The decorative CAD stage visibly presents `MINDEQ-TCM1600`, `1600 mm`, and `1250 mm` as if they were verified product facts. No approved source supports those identifiers or dimensions.
- No unnecessary runtime dependency, giant React component, unsafe TypeScript cast, or client/server boundary expansion is justified in this phase.

## Architecture

### Stylesheet ownership

Keep `src/app/globals.css` as the single Next.js entry point and import five responsibility-focused global stylesheets in the existing cascade order:

1. `styles/foundation.css` — tokens, reset, typography, focus, containers, sections, and action primitives;
2. `styles/site-shell.css` — header, navigation, footer, and ordinary route shells;
3. `styles/machines.css` — catalogue cards, development states, detail content, and galleries;
4. `styles/homepage.css` — the locked seven-section homepage and CAD-stage art direction;
5. `styles/responsive.css` — hover-capability, mobile, and reduced-motion overrides.

Moving declarations must not change selector text, declaration values, selector order, or media-query order, except for the explicitly approved repairs below. The orphan declaration block is deleted. Duplicate company-fact blocks are merged into one block containing the same effective declarations.

### Shared navigation contract

Expose one immutable `siteNavigationRoutes` tuple containing Home, Machines, Expertise, and Contact. Header and mobile navigation consume the first three routes plus the shared Contact record so Contact retains its action styling. Footer consumes the full tuple. Rendered labels, destinations, order, and DOM semantics remain unchanged.

### Machine-card view model

Create a focused presenter module that exports `MachineCardSummary` and `toMachineCardSummary(machine)`. It returns only `slug`, `name`, `shortName`, `category`, `tagline`, `heroImage`, and `publicationStatus`. Homepage and catalogue routes use it instead of repeating object literals. `MachineCard` and `FeaturedMachinesSection` consume the shared type without accepting broader records.

### Decorative CAD copy

Preserve the locked CAD grid, crosshairs, annotations, element positions, and styling. Replace unsupported product-looking strings with neutral annotations:

- `REF: STATIC-DATUM`
- `DATUM X // REFERENCE`
- `DATUM Y // REFERENCE`

These labels retain the technical visual rhythm but make no machine-identity or dimensional claim.

## Accessibility and rendering

- Keep all existing landmarks, heading order, navigation names, focus behavior, mobile disclosure behavior, and reduced-motion handling.
- Do not add a client boundary or dependency.
- Preserve server rendering for all homepage and route content.
- Keep the mobile menu’s Escape, focus-restoration, scroll-containment, and link-close lifecycle unchanged.

## Verification

- Use test-first regressions for stylesheet composition, duplicate/orphan CSS, canonical navigation data, machine-card projection, and neutral CAD labels.
- Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and a production build with `MINDEQ_SITE_URL=https://mindeq.example`.
- Capture the Task 05 baseline and Task 06 result at 1920×1080, 1440×900, 1366×768, 430×932, and 390×844.
- Confirm exact section order, no horizontal overflow, complete primary routes, working mobile disclosure, no hydration/runtime error, and no development-machine or unsupported CAD claim leak.
- Review `28c903f..HEAD` for unrelated changes, secrets, generated output, new dependencies, and visual drift.

## Out of scope

- New visual concepts, typography tuning, spacing changes, color changes, animation, 3D, WebGL, new content, new routes, or Task 07 work.
- Refactoring the machine schema or repository, which is already bounded and tested.
- Broad abstraction of small, readable homepage sections.

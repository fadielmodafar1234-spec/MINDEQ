# MINDEQ Static Design Foundation

## Status

This design implements Task 04 from the approved master protocol. It defines the static structure that Task 05 may visually tune in the browser. It does not lock final font families, colors, imagery, motion timing, or 3D framing in `docs/DECISIONS.md`.

## Objective

Build a complete, responsive static MINDEQ website foundation that communicates industrial identity without depending on JavaScript animation, WebGL, unverified product data, or invented company proof. The homepage must contain the seven approved chapters in their approved order, and every primary navigation destination must resolve to a coherent route.

## Scope

Task 04 includes:

- semantic color, typography, spacing, grid, container, action, focus, and section primitives;
- a responsive site header and footer;
- the complete seven-section homepage;
- static `/expertise` and `/contact` route foundations so primary navigation and homepage calls to action never lead to missing pages;
- an expanded branded 404 recovery path;
- server-rendered structural tests and CSS-contract tests;
- responsive and no-animation browser verification.

Task 04 excludes:

- Three.js, React Three Fiber, GSAP, ScrollTrigger, Anime.js, Lenis, WebGL, or final 3D assets;
- final cinematic choreography or decorative reveal systems;
- fabricated machines, capabilities, statistics, certifications, customers, facilities, contact details, or technical claims;
- a production inquiry form before delivery, retention, and privacy decisions are approved;
- final visual locking, which belongs to Task 05.

## Visual foundation

### Direction

The static system takes its structure from an engineering datum sheet: large identity, strong grid alignment, restrained rules, clear chapter markers, and a reserved machine stage. This is not a newspaper layout, a SaaS card system, or a futuristic interface. The single signature device is a vertical datum rail that aligns chapter identity with the main content grid. The numbered homepage chapters are meaningful because the approved homepage is an ordered narrative from identity to contact.

### Color roles

Task 04 defines semantic tokens using a restrained mineral-and-machined-metal palette:

- `--color-canvas: #e7e5de` — warm mineral page ground;
- `--color-surface: #f4f3ee` — raised reading surface;
- `--color-ink: #111713` — foundry-dark primary text;
- `--color-muted: #56605a` — secondary information;
- `--color-line: #a9aea7` — structural rules;
- `--color-brand: #174a5b` — restrained Atlas-blue identity accent;
- `--color-action: #8a451f` — oxidized-metal interaction accent;
- `--color-focus: #0b6f8a` — high-visibility focus ring;
- `--color-success: #236746`, `--color-warning: #8a5b11`, and `--color-error: #a52d24` — semantic status roles.

Dark regions derive from `--color-ink` and use the light canvas/surface colors for text and rules. No gradients, glow, glass effects, or large soft shadows are introduced.

### Typography roles

Task 04 uses robust system stacks so the foundation has no licensing or network dependency before Task 05 selects and verifies final families:

- display and major headings: a narrow industrial sans fallback stack;
- body and navigation: a neutral grotesk system stack;
- labels and technical data: the body stack with uppercase, tracked labels and tabular numerals rather than a decorative monospace.

Responsive sizes use `clamp()` and preserve intentional line breaks at the five required review viewports. Long prose remains sentence case and uses a constrained text measure.

### Spacing and grid

The spacing scale exposes ten approved steps from `--space-1` through `--space-10`: `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `6rem`, and `8rem`. Page sections use a separate responsive `--section-space` token so chapter rhythm is not confused with component spacing.

The global container uses a 12-column desktop grid and a 4-column mobile grid. Standard, wide, and text-measure containers are the only width primitives. Full-bleed regions remain available for later approved media but are not used gratuitously.

## Site shell

### Header

The header contains:

- a text MINDEQ identity linking to `/`;
- desktop links to Home, Machines, Expertise, and Contact;
- a native `<details>` disclosure for mobile navigation so every route remains available without JavaScript;
- a visually distinct contact action;
- minimum practical 44-pixel targets and visible focus treatment.

The header is not sticky in Task 04, avoiding focus obstruction and premature scroll behavior.

### Footer

The footer repeats the primary route system, states only the approved description “Moroccan industrial machine manufacturer,” and includes no invented address, telephone, email, legal entity, certification, or social channel.

## Homepage architecture

The homepage is a Server Component and renders these sections in this exact order:

1. `hero`
2. `engineering`
3. `industries`
4. `featured-machines`
5. `custom-engineering`
6. `company-proof`
7. `contact`

### Hero

The hero establishes MINDEQ, the approved Moroccan industrial-machine positioning, a primary “Explore machines” action, a secondary “Discuss a requirement” link, and a restrained “Continue” scroll cue. A code-native, abstract machine-stage graphic reserves the future poster/3D composition without pretending to depict a real product and without exposing the Task 03 development record.

### Engineering and manufacturing

The approved statement appears as four deliberate lines:

- `DESIGNED.`
- `ENGINEERED.`
- `MANUFACTURED.`
- `IN MOROCCO.`

Supporting copy stays within the approved brief and makes no facility, process, capacity, or certification claim.

### Industries

The five approved industry labels—Textile, Confection, Agro-food, Construction, and Custom engineering—appear as a structured editorial index rather than generic cards. No unverified descriptions are added.

### Featured machines

The section consumes `getFeaturedMachines()`, which returns published records only. Cards receive only catalogue-safe fields. When no verified featured machines exist, the section presents an honest empty state and a route to `/machines`; it never promotes the development fixture.

### Custom engineering

This chapter uses the approved positioning that MINDEQ is a custom-engineering partner. It directs visitors to `/expertise` and `/contact` without inventing a process, facility, discipline list, or delivery promise.

### Company and proof

No statistics are available from an approved source, so Task 04 renders no counters or numeric proof. The section uses three approved brief facts—Moroccan origin, industrial-machine focus, and custom-engineering scope—plus a concise company statement.

### Contact call to action

The final chapter invites a discussion of an industrial requirement and links to `/contact`. It does not display an unverified email address, phone number, location, response time, or availability promise.

## Supporting routes

### Expertise

`/expertise` presents only approved manufacturing and custom-engineering positioning. Its structure is ready for later verified capability content but contains no claims about facilities, methods, capacity, team, clients, certifications, or history.

### Contact

`/contact` provides general- and machine-context inquiry framing and clearly states that the production delivery channel will be enabled after its destination and privacy handling are approved. No nonfunctional form is shown as if submissions work.

### Not found

The application 404 links to Home, Machines, and Contact, matching the approved recovery journey.

## Component boundaries

- `src/components/layout/site-header.tsx` owns primary and mobile navigation markup.
- `src/components/layout/site-footer.tsx` owns footer identity and route links.
- `src/components/ui/container.tsx` owns standard, wide, and text container variants.
- `src/components/ui/section.tsx` owns semantic section wrappers and datum labels.
- `src/components/ui/action-link.tsx` owns primary, secondary, and text action styling.
- `src/components/home/*` owns one focused Server Component per homepage chapter plus the decorative machine stage.
- App routes assemble components and fetch repository data; they do not contain machine-specific content or large presentation blocks.

No barrel files are introduced. Imports remain direct and statically analyzable.

## Responsive behavior

- Desktop uses the 12-column grid and controlled asymmetry between identity, copy, and machine stage.
- Mobile recomposes to four columns, preserves all content, and puts the machine stage below the identity/actions.
- The engineering statement uses mobile-specific scale and line wrapping without shrinking into illegibility.
- Industry rows, machine cards, proof facts, and footer links stack without horizontal overflow.
- Navigation remains fully reachable through the native mobile disclosure.
- Layout is reviewed at 1920×1080, 1440×900, 1366×768, 430×932, and 390×844.

## Accessibility and resilience

- One `h1` identifies each route; homepage sections use logical `h2` headings.
- Landmarks, navigation labels, skip link, action names, and section associations remain explicit.
- Focus rings meet contrast requirements and are not clipped.
- Color is never the only indicator.
- The abstract machine stage is decorative and hidden from assistive technology.
- The complete homepage exists in server-rendered HTML and remains coherent with JavaScript and animation disabled.
- `prefers-reduced-motion` disables basic CSS transitions even though Task 04 introduces no cinematic motion.

## Verification

Task 04 is accepted when:

- tests confirm the seven homepage sections and their order;
- tests confirm navigation, footer, CTA destinations, featured-machine publication boundaries, and supporting routes;
- CSS-contract tests confirm semantic tokens, responsive grid rules, focus treatment, and reduced-motion handling;
- lint, typecheck, all unit tests, and a production build pass;
- browser checks at all five target viewports show no horizontal overflow or broken hierarchy;
- development and production HTML remain free of invented machine/company facts;
- the full diff contains no 3D/animation dependencies, generated output, secrets, or unverified production claims.

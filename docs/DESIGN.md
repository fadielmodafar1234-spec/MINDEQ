# MINDEQ Design Constitution

## Status and authority

This document defines the approved visual principles and acceptance criteria. It does not lock a specific font family, logo treatment, color value, camera frame, or final section composition before those are reviewed in the designated visual-art-direction phases.

Approved visual decisions must be recorded in docs/DECISIONS.md. Once recorded as locked, later engineering work preserves their visible result unless the human explicitly authorizes a redesign.

## Desired character

MINDEQ must feel:

- Industrial
- Engineered
- Precise
- Premium
- Modern
- Heavy
- Mechanical
- Confident
- Moroccan
- Technologically advanced

The site should feel like a manufacturer of consequential physical equipment. Visual choices must support scale, materiality, competence, and technical clarity.

## Explicit anti-patterns

Do not make MINDEQ resemble:

- a SaaS startup;
- a crypto or token website;
- a generic AI-generated landing page;
- a gaming interface;
- a science-fiction HUD;
- a component-marketplace template.

Avoid:

- excessive rounded cards;
- card grids used as the default answer to every section;
- glassmorphism;
- decorative gradients without a material or compositional purpose;
- neon or cyberpunk color treatment;
- random particles;
- meaningless custom cursors or cursor trails;
- endless centered sections;
- repeated identical heading-and-card compositions;
- animation used to conceal weak static design;
- visual effects that reduce readability, performance, or control.

## Design hierarchy

Every page should establish hierarchy in this order:

1. Page or machine identity
2. Industrial purpose and primary message
3. Primary action
4. Technical or supporting evidence
5. Secondary exploration

Use scale, placement, weight, rhythm, contrast, and imagery before decorative containers. A visitor should understand the page from a static screenshot and from the document outline.

## Layout system

### Global grid

- Use one responsive page grid shared by navigation, sections, and footer.
- Align major headings, imagery, technical data, and calls to action to deliberate grid lines.
- Permit controlled asymmetry where it strengthens industrial scale or machine dominance.
- Keep readable prose at an appropriate line length instead of stretching it across wide screens.
- Use full-bleed media only when the asset and narrative justify it.

### Containers

Use a small set of primitives:

- Page container for standard aligned content
- Wide container for machine imagery and technical compositions
- Text measure for long-form copy
- Section wrapper for consistent vertical structure
- Full-bleed region for approved media or 3D scenes

Do not add a new container width for each section.

### Spacing

- Establish a documented spacing scale rather than arbitrary pixel values.
- Section spacing communicates hierarchy and chapter transitions.
- Internal component spacing remains denser than page-level spacing.
- Mobile spacing is recomposed to preserve rhythm; it is not a uniform percentage reduction.
- Repeated elements use consistent gaps unless a deliberate editorial composition requires variance.

## Typography

- Use a restrained type system with clear display, heading, body, label, and technical-data roles.
- Display typography may be massive but must remain readable and art-directed at each target viewport.
- Body text prioritizes clarity and comfortable line length.
- Labels and specifications use consistent case, weight, alignment, and numeric treatment.
- Avoid using uppercase for long prose.
- Use real text rather than text baked into images.
- Load fonts through the framework, subset them, and provide robust fallbacks.
- Font selection and licensing must be verified before the family is locked.

## Color and material

- Build the color system from semantic roles rather than component-specific values.
- Required roles include page background, elevated surface, strong text, muted text, border, brand accent, interactive accent, focus, success, warning, and error.
- The foundation should favor industrial neutrals with a restrained brand accent once approved.
- Dark and light sections must feel like one system.
- Gradients, texture, grain, and shadows require a material or depth rationale.
- Contrast must meet WCAG AA for applicable text and controls.

Exact values are selected in the static design foundation and approved during visual art direction before being locked.

## Components

### Navigation

Navigation should feel structurally related to the hero, remain legible across section backgrounds, and expose a complete keyboard- and touch-operable mobile menu.

### Buttons and links

- Primary and secondary actions must be visually distinct.
- Labels describe the destination or action.
- Hover never carries essential information.
- Focus treatment is visible and intentional.
- Disabled states are used only when an unavailable action is meaningful; ordinary links are never visually disabled.

### Machine cards

Machine entries prioritize identity, category, verified summary, and imagery. They must not instantiate an interactive WebGL viewer. The whole card may be clickable only when nested actions and accessible naming remain unambiguous.

### Technical information

Specifications, dimensions, documents, and features are designed for scanning. Use tables, definition lists, and grouped content according to semantics, not visual convenience.

### Forms

Labels remain visible. Required state, instructions, errors, privacy context, submitting state, success, and failure are explicit and accessible.

## Homepage composition

The approved order is:

1. Hero
2. Engineering and manufacturing
3. Industries
4. Featured machines
5. Custom engineering
6. Company and proof
7. Contact call to action

Each section needs a distinct compositional reason to exist. Avoid repeating one card-grid formula. Transitions between sections should use scale, density, light, imagery, or narrative progression rather than decorative separators alone.

The hero establishes MINDEQ identity, industrial positioning, a dominant machine visual or poster, a primary call to action, and a restrained scroll cue. It must remain campaign-quality at scroll position zero before cinematic motion is added.

## Responsive art direction

Required review viewports:

- 1920 by 1080
- 1440 by 900
- 1366 by 768
- 430 by 932
- 390 by 844

Mobile may:

- change line breaks and typographic scale;
- reorder presentation when meaning remains intact;
- use different media crops or 3D framing;
- shorten or remove nonessential pinned motion;
- simplify scenes and effects;
- reduce visual density.

Mobile may not remove essential content, weaken brand identity, obscure technical information, or create horizontal page overflow.

Layouts must also behave between the named review sizes; those dimensions are test anchors, not device-specific breakpoints.

## Accessibility acceptance

- A logical heading outline exists independently of visual scale.
- Landmarks and navigation are correctly named.
- Focus order follows reading and interaction order.
- Focus is never hidden behind sticky UI.
- Color is not the only state indicator.
- Touch targets are at least 44 by 44 CSS pixels where practical.
- Zoom and text reflow do not break critical actions.
- Canvas information has a meaningful DOM equivalent.
- Reduced-motion presentation preserves all content and actions.

## Static-design gate

Before final 3D choreography begins:

- Every page reads coherently without animation.
- The homepage succeeds as a sequence of static screenshots.
- Navigation, hero, hierarchy, section rhythm, calls to action, and mobile composition are approved.
- Approved visual choices are recorded in docs/DECISIONS.md.

Adding effects is not an acceptable remedy for weak typography, hierarchy, spacing, imagery, camera framing, lighting, materials, content, or responsiveness.

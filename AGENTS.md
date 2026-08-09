# MINDEQ Repository Instructions

These instructions apply to the entire repository. Direct human instructions take precedence. Approved records in docs/DECISIONS.md are locked and may change only when the human explicitly authorizes a product or architecture decision.

## Mission

Build MINDEQ as a serious Moroccan industrial machine manufacturer: engineered, precise, premium, mechanical, confident, and technologically advanced. The website must communicate technical credibility without resembling a SaaS template, gaming interface, crypto site, or futuristic HUD.

## Phase discipline

1. Read the current task, this file, and all documents relevant to the area before changing files.
2. Work only on the active numbered task from the master protocol.
3. Do not begin the next task automatically.
4. Do not redesign approved or locked work.
5. Do not modify unrelated files or perform opportunistic refactors.
6. End every task with the mandatory handoff from the master protocol, including status, model, changes, validation, risks, blockers, commit recommendation, next agent, next model, next task, human action, and STOP HERE: YES.

## Agent ownership

Codex owns architecture, Next.js, React, TypeScript, routing, structured data, reusable components, Three.js and React Three Fiber engineering, GSAP engineering, WebGL lifecycle, performance, accessibility, testing, SEO implementation, and refactoring.

Antigravity owns browser-led art direction, typography, spacing, composition, responsive visual tuning, camera framing, lighting, material appearance, animation pacing, micro-interactions, mobile visual adaptation, and visual regression testing.

Neither agent may casually assume the other's role. Codex must preserve locked visual output during engineering cleanup. Antigravity must tune through exposed interfaces instead of rebuilding working architecture.

## Engineering rules

- Use Next.js App Router with strict TypeScript.
- Do not use any unless a narrow boundary requires it and the reason is documented.
- Prefer Server Components. Add client boundaries only for browser APIs, interaction, animation, or WebGL.
- Use semantic HTML and accessible native behavior before custom interaction.
- Keep modules focused, with clear public interfaces and no circular ownership.
- Use one structured machine-data system. Never create hardcoded page implementations per machine.
- Validate external or file-backed data at its boundary.
- Treat dependency additions as architecture decisions. Add a package only when the active task needs it and document its purpose.
- Keep pages usable when JavaScript animation or WebGL is unavailable.
- Preserve clean 404, loading, empty, and error states.

## Content integrity

- Never invent machine specifications, dimensions, capabilities, certifications, statistics, customers, dates, locations, warranty terms, or performance claims.
- Use only human-approved or attributable source material for factual publication.
- Mark development content visibly as DEVELOPMENT PLACEHOLDER — NOT VERIFIED.
- Placeholder content must never appear in production metadata, structured data, downloadable documentation, quotations, or claims presented as factual.
- Store machine content in the schema defined by docs/MACHINE_SCHEMA.md.

## Accessibility

- Provide landmarks, a logical heading hierarchy, a skip link, visible focus, keyboard operation, descriptive labels, and adequate contrast.
- Provide text or DOM equivalents for information presented in canvas.
- Interactive hotspots must be reachable and understandable without pointer-only 3D interaction.
- Forms need explicit labels, useful validation messages, and programmatic error association.
- Technical tables must remain understandable and operable at narrow widths.
- Every animation and auto-moving 3D behavior must honor prefers-reduced-motion.

## Responsive and mobile behavior

- Mobile is a first-class composition, not a scaled-down desktop layout.
- Preserve important content and brand identity on mobile.
- Provide mobile-specific camera, model, poster, layout, and motion behavior where justified.
- Maintain touch targets of at least 44 by 44 CSS pixels where practical.
- Prevent horizontal page overflow. Any intentional table scroller must be labeled and keyboard accessible.

## Animation ownership and lifecycle

- Three.js and React Three Fiber own 3D scene state and rendering.
- GSAP and ScrollTrigger own major deterministic scroll choreography.
- CSS owns ordinary hover, focus, and simple state transitions.
- Anime.js is allowed only for isolated SVG or UI animation with a documented reason.
- Never let multiple animation systems control the same property.
- Prefer imperative refs for per-frame 3D values; do not update React state every frame.
- Scope GSAP work to its component and always revert contexts, kill triggers, and remove listeners on cleanup.
- Reduced-motion mode must remove nonessential motion and pinned cinematic behavior while preserving content order.

## WebGL lifecycle

- Lazy-load every major scene and model.
- Show an intentional poster or static fallback before and instead of WebGL.
- Cap DPR, expose mobile quality modes, and reduce or pause offscreen rendering where feasible.
- Dispose owned geometries, materials, textures, render targets, controls, observers, and listeners.
- Do not dispose cached or shared resources unless the owning resource layer does so.
- Handle context loss, resize, route transitions, and repeated mounts without leaking resources.
- Never load the complete machine catalogue on initial navigation.

## Performance requirements

- Target LCP below 2.5 seconds.
- Target CLS below 0.1.
- Target INP below 200 milliseconds.
- Target a hero GLB of approximately 4 MB or less where practical.
- Target a mobile hero model of approximately 2 MB or less where practical.
- Use compressed, correctly sized images and textures.
- Control font loading, preloading, route splitting, hydration, render loops, draw calls, geometry, material count, texture memory, and DPR.
- Do not silently reduce approved visible quality. Report the measured tradeoff and request a decision.

## Validation and commits

- Before claiming a phase complete, run every applicable lint, typecheck, test, and production-build command.
- Add browser-flow tests when the behavior warrants them.
- Inspect browser console and hydration output for important interactive flows.
- Run git diff --check and review the complete diff before committing.
- Commit every major successful phase with a focused message.
- Never commit secrets, raw oversized CAD exports, generated build output, or unverified production claims.

## Governing documents

- docs/PRODUCT.md — product purpose and success criteria
- docs/SITE_MAP.md — routes, navigation, and page responsibilities
- docs/DESIGN.md — visual and responsive principles
- docs/ANIMATIONS.md — motion ownership and behavior
- docs/THREE_D.md — model, viewer, and WebGL conventions
- docs/PERFORMANCE.md — budgets and measurement
- docs/CONTENT.md — content provenance and publication rules
- docs/MACHINE_SCHEMA.md — machine-data contract
- docs/DECISIONS.md — approved locked decisions

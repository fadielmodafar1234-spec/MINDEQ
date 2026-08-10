# MINDEQ Approved Decisions

This file contains approved decisions only. Every entry is locked. Do not change a locked decision without explicit human instruction.

---

DECISION:
Build MINDEQ as a greenfield modular Next.js App Router application using strict TypeScript and Tailwind CSS, with focused internal boundaries for routes, UI, content, machines, motion, 3D, SEO, and inquiries.

WHY:
The repository began with zero commits and no implementation to preserve. A modular application provides clear ownership and route splitting without the premature overhead of a monorepo.

STATUS:
LOCKED

---

DECISION:
Use the canonical initial routes /, /machines, /machines/[slug], /expertise, and /contact. Render every machine detail page through the single dynamic route.

WHY:
This matches the approved navigation and prevents duplicated machine-specific pages.

STATUS:
LOCKED

---

DECISION:
Store initial machine content as locally versioned typed data validated at a repository boundary. Page components consume repository functions rather than importing individual records.

WHY:
This provides immediate type safety, reviewable provenance, and deterministic builds while preserving a clean migration path to a future approved CMS.

STATUS:
LOCKED

---

DECISION:
Build one universal configurable MachineViewer rather than a viewer implementation per machine.

WHY:
A single viewer keeps camera, controls, loading, hotspots, quality, accessibility, and WebGL lifecycle behavior consistent and testable across the catalogue.

STATUS:
LOCKED

---

DECISION:
Prove the complete 3D pipeline with one representative development machine before processing the rest of the catalogue.

WHY:
The pipeline must validate model cleanup, GLB optimization, component identifiers, hotspots, responsive viewing, homepage control, and performance before catalogue-scale asset work is justified.

STATUS:
LOCKED

---

DECISION:
Use poster-first progressive enhancement for every major 3D experience and never load the complete model catalogue on initial navigation.

WHY:
Page identity and technical content must remain fast, accessible, stable, and useful while WebGL loads or when it is unavailable.

STATUS:
LOCKED

---

DECISION:
Assign Three.js and React Three Fiber to 3D, GSAP and ScrollTrigger to major scroll choreography, CSS to basic transitions, and Anime.js only to justified isolated SVG or UI sequences. Two systems may not control the same property.

WHY:
Explicit ownership prevents conflicting transforms, unstable timelines, lifecycle leaks, and unmaintainable animation coupling.

STATUS:
LOCKED

---

DECISION:
Approve static composition before cinematic motion. Every animated experience must retain normal document flow and a complete prefers-reduced-motion presentation.

WHY:
MINDEQ must communicate industrial credibility through hierarchy, content, imagery, and typography rather than depending on effects. This also preserves accessibility and resilience.

STATUS:
LOCKED

---

DECISION:
Treat mobile as its own first-class composition. Mobile may simplify 3D and motion but may not remove essential information or become a scaled desktop afterthought.

WHY:
Machine framing, typography, touch, tables, forms, viewport height, and performance require deliberate mobile decisions.

STATUS:
LOCKED

---

DECISION:
Target LCP below 2.5 seconds, CLS below 0.1, and INP below 200 milliseconds. Target a hero GLB of approximately 4 MB or less and a mobile hero model of approximately 2 MB or less where practical.

WHY:
These budgets keep the ambitious visual experience accountable to loading speed, stability, responsiveness, and mobile constraints.

STATUS:
LOCKED

---

DECISION:
Do not silently reduce approved visible quality for performance. Measure the issue, document the tradeoff, and request approval for a visible compromise.

WHY:
Performance and visual quality are both product requirements; one agent must not redefine the approved experience without a product decision.

STATUS:
LOCKED

---

DECISION:
Publish only attributable, human-approved MINDEQ facts. Clearly label development placeholders and exclude them from production metadata, structured data, documents, quotations, and factual claims.

WHY:
Invented specifications, statistics, certifications, customers, and capabilities would undermine technical credibility and create business risk.

STATUS:
LOCKED

---

DECISION:
Make MINDEQ feel industrial, engineered, precise, premium, modern, heavy, mechanical, confident, Moroccan, and technologically advanced while explicitly avoiding SaaS, crypto, gaming, HUD, glassmorphism, neon cyberpunk, and generic template aesthetics.

WHY:
The visual system must express serious industrial manufacturing rather than fashionable but irrelevant digital-product conventions.

STATUS:
LOCKED

---

DECISION:
Add dependencies only in the phase that uses them and only with a documented technical reason. Lenis, Anime.js, a CMS SDK, a UI framework, and 3D postprocessing are not default dependencies.

WHY:
Deferred dependency decisions protect bundle size, lifecycle clarity, maintainability, and YAGNI while leaving room for justified additions.

STATUS:
LOCKED

---

DECISION:
Approve Task 05 Static Visual Art Direction hierarchy: massive industrial display headlines (`MINDEQ`), high-contrast dark hero background `#0d1210`, vector CAD stage with technical crosshairs and datum annotations, numbered industrial index items (`01 /`, `02 /`), and staggered uppercase engineering typography (`DESIGNED. ENGINEERED. MANUFACTURED. IN MOROCCO.`).

WHY:
Establishes a campaign-quality static presentation that communicates technical authority, heavy industrial manufacturing, and Moroccan engineering precision across desktop and mobile viewports without relying on WebGL or JavaScript animation.

STATUS:
LOCKED

---

DECISION:
Approve Task 08 MachineViewer 3D visual calibration: 36° narrow isometric FOV camera preset (`[4.2, 3.2, 5.4]`), 3-point industrial studio lighting rig (directional key `3.4`, rim `2.2`, warm fill `1.2`), dark slate viewport canvas `#0d1210`, high-contrast circular copper hotspot badges (`#b0481d`), copper component selection highlights, and responsive touch controls.

WHY:
Presents MINDEQ machinery with physical weight, engineered precision, and industrial configurator quality, avoiding game-like or sci-fi visual tropes while maintaining clear technical scanning and intentional mobile performance.

STATUS:
LOCKED

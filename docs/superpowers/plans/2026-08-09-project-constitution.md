# MINDEQ Project Constitution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the binding engineering, product, design, content, data, 3D, animation, and performance rules for the MINDEQ website before implementation begins.

**Architecture:** The constitution is split into one root agent policy and nine focused documents under `docs/`. Each document owns one decision domain, while `docs/DECISIONS.md` records only approved locked decisions and links back to the governing documents.

**Tech Stack:** Markdown documentation governing a future Next.js, TypeScript, Tailwind CSS, React Three Fiber, Three.js, Drei, GSAP, and Playwright application.

## Global Constraints

- Do not implement application code during Task 02.
- Do not invent MINDEQ product specifications, certifications, statistics, customers, dates, or claims.
- The static document flow must remain usable without animation or WebGL.
- Every animation requires a reduced-motion behavior.
- Mobile is a separately composed first-class experience.
- Performance targets are LCP below 2.5 seconds, CLS below 0.1, and INP below 200 milliseconds.
- The hero GLB target is approximately 4 MB or less where practical; the mobile hero model target is approximately 2 MB or less where practical.
- Dependencies are added only in the phase that uses them and only with technical justification.
- Do not start Task 03 during this plan.

---

### Task 1: Root policy and product scope

**Files:**
- Create: `AGENTS.md`
- Create: `docs/PRODUCT.md`
- Create: `docs/SITE_MAP.md`

**Interfaces:**
- Consumes: The approved master build protocol and Task 01 greenfield architecture.
- Produces: Binding contributor rules, product scope, audiences, success criteria, route ownership, and page responsibilities.

- [x] **Step 1: Create `AGENTS.md`**

Document task-order enforcement, responsibility boundaries, strict TypeScript, semantic accessibility, verified-content rules, reduced motion, mobile fallbacks, GSAP cleanup, WebGL lifecycle, structured machine data, lazy loading, performance requirements, validation gates, and handoff requirements.

- [x] **Step 2: Create `docs/PRODUCT.md`**

Define MINDEQ from the approved brief, the website objective, primary audiences, user outcomes, product principles, scope, non-goals, evidence rules, and success signals without adding unverified factual claims.

- [x] **Step 3: Create `docs/SITE_MAP.md`**

Define `/`, `/machines`, `/machines/[slug]`, `/expertise`, and `/contact`; state navigation labels, page responsibilities, machine-detail content, 404 behavior, and future route rules.

- [x] **Step 4: Verify the three documents**

Run:

```powershell
Get-Item AGENTS.md, docs/PRODUCT.md, docs/SITE_MAP.md | Select-Object Name, Length
```

Expected: three existing non-empty files.

### Task 2: Experience and rendering rules

**Files:**
- Create: `docs/DESIGN.md`
- Create: `docs/ANIMATIONS.md`
- Create: `docs/THREE_D.md`
- Create: `docs/PERFORMANCE.md`

**Interfaces:**
- Consumes: Product principles and site map from Task 1.
- Produces: Visual direction, responsive rules, animation ownership, WebGL lifecycle, asset conventions, and measurable performance budgets.

- [x] **Step 1: Create `docs/DESIGN.md`**

Define the approved industrial character, anti-patterns, layout and typography principles, semantic token strategy, component behavior, accessibility requirements, responsive art direction, and visual approval rules without locking unapproved fonts or color values.

- [x] **Step 2: Create `docs/ANIMATIONS.md`**

Assign Three.js/R3F to 3D, GSAP/ScrollTrigger to major choreography, CSS to basic transitions, and Anime.js only to justified isolated UI or SVG work. Define cleanup, reduced-motion, resize, mobile, performance, and content-continuity rules.

- [x] **Step 3: Create `docs/THREE_D.md`**

Define one representative-machine pipeline, file variants, coordinate and unit conventions, scene ownership, configurable viewer interfaces, lazy loading, poster fallback, lifecycle, accessibility, mobile quality, and optimization expectations.

- [x] **Step 4: Create `docs/PERFORMANCE.md`**

Record the approved Core Web Vitals and model budgets, route and asset loading strategy, WebGL budgets, image and font policy, measurement gates, and the rule against silent visual degradation.

- [x] **Step 5: Verify the four documents**

Run:

```powershell
Get-Item docs/DESIGN.md, docs/ANIMATIONS.md, docs/THREE_D.md, docs/PERFORMANCE.md | Select-Object Name, Length
```

Expected: four existing non-empty files.

### Task 3: Content, machine data, and locked decisions

**Files:**
- Create: `docs/CONTENT.md`
- Create: `docs/MACHINE_SCHEMA.md`
- Create: `docs/DECISIONS.md`

**Interfaces:**
- Consumes: Product, route, design, animation, 3D, and performance rules from Tasks 1 and 2.
- Produces: Content provenance rules, the conceptual machine contract for Task 03, and the authoritative locked-decision register.

- [x] **Step 1: Create `docs/CONTENT.md`**

Define source priority, verification states, development-placeholder labeling, forbidden invented claims, editorial responsibilities, media and document metadata, localization posture, alt-text rules, and release checks.

- [x] **Step 2: Create `docs/MACHINE_SCHEMA.md`**

Specify the conceptual `Machine`, hotspot, documentation, media, model, dimensions, specification, and SEO structures; identify required versus optional fields; define validation, slug, placeholder, and client-serialization rules.

- [x] **Step 3: Create `docs/DECISIONS.md`**

Record only approved decisions using repeated `DECISION`, `WHY`, and `STATUS: LOCKED` blocks. Include the modular Next.js architecture, typed local machine data with a repository boundary, universal viewer, one-model proof pipeline, animation ownership, accessible static-first behavior, mobile-first-class treatment, performance budgets, and verified-content policy.

- [x] **Step 4: Verify the three documents**

Run:

```powershell
Get-Item docs/CONTENT.md, docs/MACHINE_SCHEMA.md, docs/DECISIONS.md | Select-Object Name, Length
```

Expected: three existing non-empty files.

### Task 4: Constitution consistency and phase commit

**Files:**
- Verify: `AGENTS.md`
- Verify: `docs/*.md`

**Interfaces:**
- Consumes: All constitution documents.
- Produces: A coherent, committed Task 02 foundation ready for Task 03 review.

- [x] **Step 1: Verify mandatory files**

Run a PowerShell check that fails unless all ten mandatory Task 02 files exist and are non-empty.

Expected: `MANDATORY_FILES=10`, `MISSING_FILES=0`, `EMPTY_FILES=0`.

- [x] **Step 2: Scan for incomplete markers**

Run:

```powershell
$constitution = @('AGENTS.md','docs/PRODUCT.md','docs/SITE_MAP.md','docs/DESIGN.md','docs/ANIMATIONS.md','docs/THREE_D.md','docs/PERFORMANCE.md','docs/CONTENT.md','docs/MACHINE_SCHEMA.md','docs/DECISIONS.md')
rg -n "T(BD)|TO(DO)|FIX(ME)|implement[ ]later|fill[ ]in[ ]details" $constitution
```

Expected: no matches in constitution documents.

- [x] **Step 3: Check locked-decision format and cross-document rules**

Verify every decision block has `DECISION:`, `WHY:`, and `STATUS: LOCKED`; verify required performance values and agent rules appear in their governing files.

- [x] **Step 4: Review the diff**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and only Task 02 documentation files are untracked or modified.

- [x] **Step 5: Commit Task 02**

Run:

```powershell
git add AGENTS.md docs
git commit -m "docs: establish MINDEQ project constitution"
```

Expected: one successful root commit containing only the project constitution and its execution plan.

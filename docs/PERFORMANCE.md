# MINDEQ Performance Constitution

## Performance is a release requirement

The visual ambition of MINDEQ does not excuse slow loading, unstable layout, delayed interaction, excessive battery use, or memory leaks. Performance is designed into route, content, animation, and 3D architecture from the start.

Approved visual quality is not silently reduced to meet a target. Any visible compromise requires measured evidence, a documented tradeoff, and explicit approval.

## Primary targets

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | Below 2.5 seconds |
| Cumulative Layout Shift | Below 0.1 |
| Interaction to Next Paint | Below 200 milliseconds |
| Hero GLB | Approximately 4 MB or less where practical |
| Mobile hero model | Approximately 2 MB or less where practical |

Core Web Vitals are evaluated at the 75th percentile with production field data when sufficient traffic exists. Lab testing uses representative mid-range mobile and desktop conditions and is not treated as a substitute for field results.

## Measurement environments

Measure:

- a clean first visit;
- a repeat visit;
- desktop and mobile;
- normal and reduced motion;
- WebGL-supported and poster-fallback paths;
- slow network and constrained CPU profiles;
- route navigation to catalogue and machine detail;
- viewer load, interaction, fullscreen, and teardown;
- homepage cinematic scroll after it exists.

Record the tested commit, route, viewport, device profile, network profile, browser, asset variant, and result. Performance comparisons without equivalent conditions are not accepted.

## Framework strategy

- Use Next.js App Router and Server Components by default.
- Keep interactive client islands small and explicit.
- Do not hydrate static technical content merely because a nearby viewer is interactive.
- Use route-level splitting and dynamic imports for WebGL and major animation code.
- Do not import Three.js, React Three Fiber, Drei, or GSAP into routes that do not use them.
- Generate machine routes from structured data where appropriate.
- Cache static verified content safely; avoid unnecessary client-side refetching.
- Reserve dimensions for images, posters, canvases, and asynchronous regions.

## Critical rendering path

- The first meaningful presentation uses HTML, CSS, optimized imagery, and a machine poster.
- The LCP candidate should not depend on GLB download, shader compilation, or client hydration.
- Preload only assets demonstrated to be critical to the current route.
- Do not preload the full catalogue, offscreen galleries, documentation, or non-critical 3D variants.
- Keep page identity, navigation, and primary action available while 3D loads.

## JavaScript and hydration

- Add dependencies only when the active phase uses them.
- Inspect client boundaries and bundle composition after significant interactive work.
- Prefer event-driven updates over broad global state.
- Avoid React state updates during animation frames or scroll scrub.
- Keep third-party scripts deferred and justified.
- Measure hydration work, long tasks, event-handler cost, and route-transition behavior.
- Remove development logging and diagnostics from production paths.

No arbitrary JavaScript byte target is locked before the application is scaffolded and representative routes can be measured. Task 17 records route-specific budgets from real bundle evidence.

## Images and fonts

- Use responsive image sizing and modern compressed formats.
- Store source-quality originals outside the delivery path when necessary.
- Provide intrinsic dimensions or aspect ratio to prevent layout shift.
- Do not ship desktop-resolution images to small mobile slots.
- Lazy-load non-critical gallery and section imagery.
- Keep the LCP image eager only when measurement confirms it is the LCP candidate.
- Use framework-managed font loading.
- Subset fonts by required scripts and weights.
- Self-host fonts when licensing permits and it improves reliability.
- Limit font families and weights to those used by the approved design.
- Provide robust fallbacks that minimize metric shift.

## WebGL and 3D

- Use poster-first lazy loading.
- Never load all machine models on initial navigation.
- Provide hero, viewer, and mobile variants as defined in docs/THREE_D.md.
- Cap DPR and validate the cap with the representative scene.
- Reduce or pause rendering when offscreen or when the document is hidden.
- Prefer demand-driven viewer rendering when the scene is stable.
- Track draw calls, triangle count, material count, texture dimensions, texture memory, shader cost, decode time, and frame behavior.
- Consolidate materials and geometry where visual and interaction requirements allow.
- Compress geometry and textures according to measured device tradeoffs.
- Avoid allocating temporary objects each frame.
- Dispose instance-owned resources and release observers, controls, timers, and listeners.
- Test repeated mounts and route transitions for increasing memory or render work.

## Animation and scrolling

- Keep ScrollTrigger instances intentional and scoped.
- Clean up timelines, triggers, media queries, listeners, and observers.
- Prefer transform and opacity when they produce the approved result.
- Avoid layout reads and writes interleaved during scroll.
- Do not add scroll hijacking.
- Reduced-motion mode removes cinematic scrub and pinning.
- Mobile may use shorter or static storytelling to protect comprehension and performance.

## Interaction responsiveness

- Keep navigation, menu, contact, filtering, document access, and quotation actions responsive before optional media finishes.
- Break up expensive work that blocks input.
- Do not parse or transform large machine datasets in the browser.
- Defer nonessential analytics and third-party integrations.
- Validate keyboard and touch flows under CPU constraint, not only pointer hover on a fast desktop.

## Layout stability

- Reserve space for media, viewer, navigation, and async messages.
- Avoid inserting banners or loaders above settled content.
- Use font fallbacks and loading behavior that limit reflow.
- Ensure sticky and pinned regions have stable sizing across hydration.
- Treat responsive image and table layout as CLS risks.

## Phase gates

### Static foundation

- Inspect initial route bundles.
- Confirm the poster-based homepage has a stable LCP candidate.
- Confirm fonts and images are optimized and dimensioned.

### MachineViewer

- Measure model size, decode, time to poster replacement, draw calls, frame behavior, memory, DPR, mobile quality, and teardown.
- Prove one representative model before catalogue expansion.

### Cinematic homepage

- Measure timeline initialization, ScrollTrigger count, long tasks, scroll responsiveness, WebGL frame behavior, and offscreen work.

### Final performance audit

- Run production builds and bundle analysis.
- Audit route splitting, hydration, rerenders, GSAP lifecycle, WebGL loops, assets, fonts, preloads, memory, and Core Web Vitals risks.
- Record visible-quality tradeoffs rather than applying them silently.

## Regression policy

A performance optimization passes only when:

1. the measured target improves or a documented risk is removed;
2. approved visual output remains effectively unchanged, or the visible change is explicitly approved;
3. accessibility and content behavior do not regress;
4. production build and relevant tests pass;
5. the result is checked at representative desktop and mobile conditions.

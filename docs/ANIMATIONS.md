# MINDEQ Animation Constitution

## Purpose

Motion should explain, reveal, orient, or provide feedback. It should feel mechanical, heavy, controlled, cinematic, precise, and deliberate. If a movement communicates nothing, remove it.

The site remains understandable and usable without motion. Static composition is approved before major choreography begins.

## Ownership

| System | Owns | Must not own |
| --- | --- | --- |
| Three.js / React Three Fiber | 3D scene state, camera, model transforms, materials, lighting, render lifecycle | Page layout, DOM scroll choreography |
| GSAP / ScrollTrigger | Major scroll-linked DOM and scene-control choreography | The render loop, React application state |
| CSS | Hover, focus, simple enter/exit and state transitions | Complex scroll timelines or 3D transforms |
| Anime.js | Rare isolated SVG or UI sequences with a documented reason | Properties controlled by CSS, GSAP, or R3F |

Two systems must never animate the same property. Ownership is decided before implementation and remains local to the responsible module.

Lenis or another smooth-scrolling layer is not a default dependency. It may be introduced only after native scrolling is tested, a clear experience problem is documented, accessibility and input behavior are validated, and the dependency is approved.

## Motion categories

### Functional feedback

Buttons, links, menus, fields, downloads, filters, and viewer controls use restrained state transitions that confirm interaction without delaying it.

### Editorial reveal

Text and imagery may enter when the reveal supports chapter progression. Content should not remain invisible if JavaScript fails, observers do not run, or reduced motion is enabled.

### Cinematic scroll

The homepage hero may use a scrubbed GSAP and ScrollTrigger timeline to control an imperative 3D scene. The timeline must be deterministic, resize-safe, and separable from the static document flow.

### Viewer interaction

Drag rotation, constrained zoom, hotspot focus, component highlighting, and fullscreen transitions provide direct feedback. Interaction remains bounded, predictable, and appropriate for an industrial product viewer.

## GSAP engineering rules

- Create animations only inside client components.
- Scope selectors and timelines to the component instance.
- Use a GSAP context or equivalent ownership boundary.
- Revert the context and kill owned ScrollTriggers on unmount.
- Remove media-query handlers, resize observers, event listeners, and delayed calls created by the component.
- Do not create duplicate triggers during route changes, resize, or React development remounts.
- Use refs for animated values; avoid React state updates during scrub or on every frame.
- Batch layout reads, avoid layout thrashing, and animate transforms or opacity when they are visually appropriate.
- Recalculate measurements through controlled refresh behavior rather than arbitrary repeated refresh calls.
- ScrollTrigger must not hijack wheel, keyboard, touch, or browser history behavior.

## Homepage scene control

The homepage 3D layer exposes deterministic imperative controls for:

- camera position;
- camera target;
- machine position;
- machine rotation;
- machine scale;
- exploded-view progress;
- component visibility;
- component highlighting;
- approved material states.

GSAP animates these exposed controls. It does not reach into arbitrary scene internals or depend on a specific machine mesh hierarchy.

The approved first frame is the timeline's exact initial state. The timeline may not redesign it.

## Reduced motion

When prefers-reduced-motion indicates reduction:

- remove scrubbed cinematic motion and pinned storytelling;
- avoid automatic camera, model, parallax, and reveal movement;
- show content in normal document order;
- use the approved poster or a stable interactive viewer state;
- keep all links, controls, technical information, and calls to action available;
- use immediate state changes or minimal non-spatial fades where needed for comprehension.

Reduced motion is a complete supported presentation, not an afterthought.

## Responsive behavior

- Desktop and mobile timelines may be structurally different.
- Mobile may shorten scroll regions, reduce model movement, remove exploded-view choreography, or use a static poster.
- Breakpoint changes must destroy the previous animation instance before creating the next.
- Orientation changes and resizes must preserve a coherent scene and scroll position.
- Motion cannot introduce horizontal overflow or trap touch scrolling.

## Micro-interactions

Useful candidates include:

- navigation state;
- button and link feedback;
- machine-card affordance;
- category and filter state;
- image reveals;
- document-download feedback;
- form focus, validation, submitting, success, and failure;
- viewer controls and hotspots.

Avoid magnetic effects, cursor trails, bouncing, random distortion, excessive text splitting, decorative loaders, and custom cursors without a proven usability benefit.

## Performance

- Do not mount animation code on routes that do not use it.
- Import GSAP plugins only where needed and register them in a stable client module.
- Keep ScrollTrigger count intentional and observable.
- Pause or reduce offscreen scene work.
- Do not allocate objects every frame when reusable vectors, quaternions, or arrays will work.
- Avoid animating costly CSS properties when transforms can produce the approved result.

## Testing and acceptance

For each major animation:

1. Verify the no-JavaScript or pre-hydration static state.
2. Verify normal motion at target desktop viewports.
3. Verify intentional mobile behavior at 430 by 932 and 390 by 844.
4. Verify reduced-motion content order and controls.
5. Resize across breakpoint boundaries and check for duplicate triggers.
6. Navigate away and back and check cleanup.
7. Check keyboard, touch, scroll, and browser-console behavior.
8. Check that the motion communicates a narrative or interaction purpose.

Visual timing is approved by Antigravity. Architecture, lifecycle, reduced motion, and performance are validated by Codex.

## Task 11 integration boundary

Task 11 provides `HomepageSceneController` but deliberately creates no GSAP or
ScrollTrigger timeline. Three.js owns the camera target, scene transforms,
component visibility, explosion state, cloned material values, and demand-render
invalidation. React owns only coarse lifecycle state such as support, loading,
viewport presence, document visibility, and quality policy; it is never updated
on an animation frame.

Future GSAP code owns interpolation. It may tween plain proxy values and call the
controller setters from its scoped update callbacks, or use approved setter
plugins, but it must not mutate the R3F scene, query GLTF child indices, or look
up mesh names. The controller applies absolute values, so refreshes and repeated
timeline seeks remain deterministic. A timeline starts from the configuration's
approved initial state and calls `reset()` when it must restore that state.

The future timeline must wait until the scene controller is available, remain
optional when the development or approved production config is absent, and
revert its own GSAP context independently of scene disposal. Reduced-motion and
poster-only mobile policies never initialize cinematic choreography. Task 12
owns the first frame; later animation work owns timing and scroll choreography.

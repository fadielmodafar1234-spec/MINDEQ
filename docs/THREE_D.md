# MINDEQ 3D Constitution

## Objective

Create one reusable 3D machine system that supports machine-detail viewing and controlled homepage storytelling without coupling scene architecture to a specific machine.

The first goal is to prove the complete pipeline with one representative development machine:

CAD or source model → Blender cleanup → web-ready GLB → MachineViewer → hotspots → responsive viewer → homepage scene → performance validation.

The rest of the catalogue is not processed until this pipeline passes.

## Asset variants

Preferred names:

- machine-name.viewer.glb — interactive detail viewer
- machine-name.hero.glb — homepage cinematic scene
- machine-name.mobile.glb — reduced mobile variant
- machine-name.poster.avif — primary static fallback
- machine-name.poster.webp — compatibility fallback when required

The viewer and hero variants may share source geometry but are separately optimized for their use cases. Raw CAD exports are never shipped directly.

## Baseline model conventions

- Use glTF 2.0 binary GLB for delivery.
- Convert source units in the content pipeline so one scene unit equals one meter.
- Use positive Y as up.
- Orient the machine's intended front toward positive Z.
- Place the origin on the floor plane at the machine's horizontal center unless an approved model-specific pivot is required.
- Apply object scale and rotation before export.
- Remove hidden, duplicate, construction, and non-rendering CAD geometry.
- Use stable, descriptive ASCII mesh and component identifiers.
- Keep component identifiers stable across viewer, hero, and mobile variants when the component exists in each.
- Avoid relying on Blender object order, automatically generated names, or material-slot order as application identifiers.
- Use physically based metallic-roughness materials.
- Consolidate equivalent materials and reduce unnecessary material slots.
- Prefer instancing for genuinely repeated parts when compatible with interaction requirements.

Model-specific exceptions are documented alongside the asset and reflected in machine data. Application code must not silently compensate for inconsistent exports with arbitrary magic transforms.

## Geometry and texture preparation

Evaluate and apply as appropriate:

- CAD topology cleanup;
- removal of invisible internal geometry;
- mesh reduction with silhouette and interaction preservation;
- sensible separation of hotspot or exploded-view components;
- normal cleanup and hard-edge preservation;
- Meshopt compression;
- Draco compression when it improves the actual delivery and decoding tradeoff;
- KTX2 texture compression;
- texture atlas or material consolidation;
- removal of unsupported extensions and unused animation tracks.

Optimization is verified visually on the target device classes. File size alone is not a sufficient quality measure.

## Asset budgets

- Hero GLB target: approximately 4 MB or less where practical.
- Mobile hero model target: approximately 2 MB or less where practical.
- Viewer assets receive a route-specific measured budget based on geometry, material, and texture complexity.
- Every exception records file size, visual reason, measured loading behavior, and approved tradeoff.

## Universal MachineViewer boundary

MachineViewer accepts configuration rather than inspecting one machine's business data directly.

Configuration domains include:

- model source and mobile source;
- poster source and accessible text;
- camera position, target, field of view, and constraints;
- model position, rotation, scale, and optional bounds strategy;
- lighting and environment configuration;
- interaction permissions and sensitivity;
- hotspot definitions;
- component identifier map;
- highlight behavior;
- quality mode;
- reduced-motion behavior;
- loading and error presentation;
- viewer mode capabilities such as standard, wireframe-ready, exploded-view-ready, and fullscreen-ready.

The machine repository transforms machine content into this viewer configuration. Technical page components consume the original structured data separately.

## Homepage scene boundary

The homepage scene exposes an imperative controller with deterministic setters or mutable targets for:

- camera position and target;
- model position, rotation, and scale;
- explosion progress;
- component visibility;
- component highlighting;
- approved material-state transitions.

The controller owns interpolation details and mesh lookup. GSAP consumes the public controller and never queries arbitrary child indices or machine-specific mesh names.

## Hotspots

Each hotspot uses:

- stable ID;
- label;
- description;
- position in model-local coordinates;
- optional component identifier;
- optional verified technical values.

Hotspot positions are authored against the canonical viewer model. If variants differ, the asset pipeline provides variant coordinates or a stable anchor strategy.

Hotspot information also appears in accessible DOM content. Canvas markers are not the sole path to technical information.

## Loading and fallback

- Do not include 3D code in routes that do not use it.
- Load the canvas and model lazily behind an intentional poster.
- The poster is valid final content for unsupported devices, errors, reduced-data conditions, or an approved mobile fallback.
- Loading progress must not delay access to page identity or technical content.
- Model errors produce a stable fallback and do not crash the route.
- Never preload the complete catalogue.

## Rendering and interaction

- Cap DPR; never render at unbounded device pixel ratio.
- Use a demand-driven render loop for stable viewer states where feasible.
- Render continuously only while interaction, camera motion, material animation, or scene choreography requires it.
- Reduce or pause work while the canvas is offscreen or the document is hidden.
- Constrain rotation and zoom to prevent disorienting or unusable states.
- Keep the machine framed through responsive camera or bounds configuration rather than CSS scaling alone.
- Mobile quality mode may reduce geometry, textures, shadows, lighting complexity, and motion while preserving identity.

## Resource lifecycle

- Treat loaded assets as owned by a documented cache or resource layer.
- Dispose instance-owned geometries, cloned materials, textures, render targets, controls, observers, timers, and listeners.
- Do not dispose shared cached resources from an individual component.
- Handle development remounts, route transitions, fullscreen changes, resize, context loss, and repeated viewer mounts.
- Stop animation frames and invalidate work after unmount.
- Avoid React state changes on every frame; use refs and R3F's render loop.

## Lighting and materials

Viewer architecture exposes configurable lighting; art direction owns final calibration. Defaults should communicate a heavy physical product rather than a videogame or science-fiction object.

Do not overwrite authored material values globally to compensate for one bad asset. Correct the asset pipeline or provide explicit machine configuration.

## Accessibility and input

- Provide an accessible name and concise instructions for the viewer.
- Do not require the viewer to access machine information.
- Ensure viewer controls are keyboard and touch operable where applicable.
- Provide reset-view functionality.
- Preserve browser zoom and page scrolling.
- Reduced motion disables automatic camera and model movement.
- Provide a poster fallback with meaningful alternative text.

## Validation checklist

- Asset names and identifiers follow conventions.
- Scale, orientation, origin, and framing are correct.
- Viewer and poster load states are intentional.
- Desktop pointer, keyboard, wheel, and fullscreen behavior work.
- Mobile touch, framing, quality, orientation, and fallback behavior work.
- Hotspots match components and have DOM equivalents.
- Reduced motion is stable.
- Route changes and repeated mounts do not leak or duplicate work.
- Draw calls, triangles, materials, texture memory, load size, decode time, and frame behavior are measured.
- Visual quality is reviewed before and after optimization.

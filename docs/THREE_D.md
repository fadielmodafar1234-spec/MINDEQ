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

## Task 07 runtime contract

Task 07 implements the universal viewer in `src/components/machine-viewer/`.
`MachineViewer` receives one serializable `MachineViewerConfig`; it does not
import machine records, inspect slugs, or contain mesh names, camera values,
lighting values, hotspots, or component behavior for a particular product.
`createMachineViewerConfig` is the machine-data adapter. A route renders the
viewer only when a machine has a model and poster contract; otherwise the
existing poster path remains unchanged.

The DOM shell renders the poster and instructions during server rendering.
After hydration it checks WebGL support and waits until the viewer approaches
the viewport before importing the React Three Fiber canvas. React Suspense
covers both the lazy canvas module and the GLTF load. Model or context failures
return to the same poster without crashing the machine route.

### Required GLB and GLTF conventions

- Binary glTF 2.0 (`.glb`) is the preferred delivery format. A `.gltf` document
  is supported, but every referenced buffer and texture must be deployed with
  stable same-origin URLs and correct CORS and MIME headers.
- A viewer asset contains geometry, PBR materials, textures, and stable nodes.
  It must not depend on a Blender object index, scene traversal order, or a
  material-slot index as an application identifier.
- One scene unit equals one meter. Do not compensate for millimeter CAD exports
  with unexplained runtime scale values.
- Positive Y is up. The intended machine front faces positive Z.
- The canonical origin is the machine's horizontal center on the floor plane.
  Model-specific pivots are allowed only when documented with the asset and
  represented explicitly by the configured model transform.
- Apply rotation and scale before export. The ordinary runtime transform should
  therefore be position `[0, 0, 0]`, rotation `[0, 0, 0]`, and scale
  `[1, 1, 1]`.
- Remove hidden CAD bodies, construction geometry, duplicate faces, unused
  cameras, unsupported extensions, and unused animation tracks before export.

### Mesh and component naming

- Use unique, stable ASCII node names in lower kebab-case, for example
  `main-frame`, `operator-guard`, or `feed-assembly`.
- Do not ship names such as `Cube.001`, `Part12`, or automatically generated CAD
  paths as the public component contract.
- A logical component ID maps to a GLTF node name through
  `MachineViewerConfig.model.componentMap`. IDs may equal node names, but the
  map allows an asset revision to preserve application IDs when an internal
  node name must change.
- `ModelAsset.componentIds`, hotspot `componentId` values, highlight targets,
  and exploded-view parts use the same logical IDs. Schema validation rejects
  a hotspot that references an undeclared model component.
- Preserve component IDs between viewer and mobile variants when that component
  exists in both. Record a component-map version for each asset contract.

### Materials and textures

- Author metallic-roughness PBR materials with correct base color, metalness,
  roughness, normals, and color-space assignments.
- Base-color and emissive textures use an sRGB color space. Normal,
  metallic-roughness, occlusion, and data textures remain linear.
- Use power-of-two texture dimensions where the compression pipeline requires
  them. Size textures for their actual on-screen density; do not embed source
  CAD textures or desktop-resolution maps in a mobile asset.
- Consolidate equivalent materials and texture sets when this does not remove a
  required component boundary. Avoid one material per small CAD part.
- Do not rely on the viewer to overwrite authored material values globally.
  The viewer clones materials only for instance-local modes and highlighting.
  Geometry and texture data from the GLTF cache remain unchanged.

### Compression expectations

- Measure an uncompressed reference before choosing compression.
- Meshopt is the preferred general geometry path when it produces the best
  measured size, decode, and compatibility tradeoff. Draco is supported when a
  decoder path is supplied in model configuration and its measured saving
  justifies the decode cost.
- Use KTX2/Basis Universal for large textures after device validation. Provide
  only extensions and transcoders that the delivery environment actually
  deploys.
- Remove unused accessors, nodes, materials, textures, and animation tracks.
- Record delivered bytes, triangle count, draw calls, material count, texture
  dimensions, decode time, and target-device behavior. Compression is not a
  substitute for CAD cleanup or sensible topology.

### Camera configuration

Every machine supplies or derives:

- initial `position` and `target` in canonical model coordinates;
- vertical field of view in degrees;
- near and far clipping planes that contain the machine without wasting depth
  precision;
- minimum and maximum zoom distance;
- polar and optional azimuth constraints;
- rotation and zoom sensitivity; and
- whether panning is allowed.

The adapter uses `ModelAsset.cameraPreset` when present. Task 07 defaults are a
safe engineering baseline, not final framing. Task 08 owns visual camera
calibration. `Reset view` reapplies the configured camera and target rather
than a machine-specific constant in the canvas.

### Lighting configuration

Lighting is a typed configuration containing optional ambient and hemisphere
lights plus an ordered set of directional lights. Each directional light has a
stable ID, color, intensity, position, and optional shadow flag. Mobile quality
may disable shadows without changing the lighting data. A machine that needs a
different rig supplies an adapter override; it does not add a conditional to
`MachineViewer`.

Task 08 owns final light position, intensity, shadow calibration, and material
appearance. Task 07 provides only a neutral configurable baseline.

### Hotspot configuration and accessibility

Each hotspot provides a stable ID, short label, description, model-local
position, and optional logical component ID. Positions are authored against
the canonical model transform. If a mobile variant changes geometry or origin,
it requires variant-safe coordinates or stable anchor nodes before release.

The canvas marker is a real button. The viewer also renders an ordered DOM list
with the same labels and descriptions, and the machine technical content keeps
its independent DOM equivalent. No technical fact is available only through a
canvas or pointer gesture. Hotspot copy follows `docs/CONTENT.md` and may not
infer function, material, performance, or dimensions from visual appearance.

### Highlightable components

A highlightable logical component must resolve through `componentMap` to one
stable GLTF node. The runtime clones cached materials per mounted viewer, saves
their original color, emissive, intensity, and wireframe state, and applies the
configured highlight only to the cloned instance. Selecting the same hotspot
again clears its highlight. Assets should group meshes beneath a component node
when the entire assembly must highlight together.

Do not merge a required highlightable component into unrelated geometry during
optimization. If a component uses a shader or material that does not expose
ordinary color/emissive properties, document and implement an explicit material
strategy outside the generic selection logic.

### Wireframe-mode architecture

`MachineViewer` accepts `mode="standard" | "wireframe"`. Wireframe mode is
enabled only when the configuration advertises the capability. It toggles the
wireframe property on instance-owned cloned materials and invalidates the
demand render loop. It never mutates cached source materials. Task 07 exposes
this deterministic boundary; it does not add a public mode picker or perform
wireframe visual calibration.

### Exploded-view preparation

Exploded view is data, not a timeline. Configuration may provide ordered parts
with a logical component ID, normalized direction, and travel distance in
meters. `explosionProgress` is clamped from zero to one and deterministically
positions each part from its captured base transform. The viewer does not own
scroll timing or create an animation loop.

Before enabling an asset for exploded view:

- separate moving assemblies into stable component nodes;
- choose pivots that remain mechanically comprehensible;
- verify travel directions and distances against the canonical orientation;
- keep required internal geometry only when it becomes visible; and
- verify that mobile simplification preserves every referenced component or
  supplies a variant-specific contract.

Task 08 may calibrate static end states. Later approved choreography may drive
the public progression value through the imperative/prop boundary without
querying scene child indices.

### Mobile quality behavior

Quality mode is `auto`, forced `desktop`, or forced `mobile`. Auto mode uses the
mobile breakpoint or a coarse pointer. Mobile mode:

- selects `mobileSrc` when one is configured, otherwise it safely uses the
  viewer asset;
- caps DPR at the configured mobile range (Task 07 uses 1 to 1.25);
- disables antialiasing and shadows in the baseline profile;
- keeps drag, constrained zoom, reset, poster fallback, hotspots, and technical
  DOM content available; and
- does not start automatic model or camera motion.

Desktop DPR is also capped (Task 07 uses 1 to 1.75 and enforces an absolute cap
of 2). Device pixel ratio is never accepted unbounded. Touch behavior preserves
vertical page scrolling and browser pinch zoom while supporting bounded viewer
interaction.

### Reduced motion

The viewer observes `prefers-reduced-motion` and exposes the resolved state on
its root. It never auto-rotates. Reduced motion disables control damping so the
camera follows direct input without inertial motion. Loading, poster, reset,
hotspot, highlight, fullscreen, and technical content remain available. Future
camera focus, exploded progression, or material transitions must use immediate
state changes in this mode.

### Resource ownership and disposal

- Drei's `useGLTF` cache owns loaded source scenes, geometries, textures, and
  source materials. An individual viewer must not dispose those shared assets.
- Each mounted viewer clones source materials before wireframe or highlight
  changes. It disposes every cloned material on unmount.
- The primitive opts out of automatic R3F tree disposal because its geometry
  and textures are cache-owned. React Three Fiber owns renderer teardown and
  OrbitControls teardown with the canvas lifecycle.
- The shell disconnects its IntersectionObserver and removes visibility and
  fullscreen listeners. The canvas removes context-loss/restoration listeners.
- A demand-driven render loop is used while visible; hidden documents switch to
  `never` until visible again. No React state is updated per frame.
- A lost context degrades to the poster. Repeated mounts must not duplicate
  observers, controls, listeners, or instance materials.

If a future resource layer chooses per-viewer ownership rather than a shared
cache, it must load, reference-count, and dispose geometries and textures in
that layer. Do not mix ownership models inside `ModelScene`.

### Adding another machine without modifying MachineViewer

1. Clean and export one canonical `.viewer.glb` using the conventions above.
2. Produce an approved poster and, when measured value justifies it, a mobile
   model variant.
3. Add `ModelAsset`, `modelPoster`, optional `modelMobile`, component IDs,
   transform, camera preset, and measured file bytes to the machine record.
4. Add verified hotspots in model-local coordinates and ensure every optional
   `componentId` appears in the declared component contract.
5. If generic lighting or controls are unsuitable, pass typed adapter
   overrides from machine configuration. Do not branch on the slug in
   `MachineViewer`.
6. Add optional `componentMap`, highlight settings, wireframe capability, and
   exploded-part data to the derived configuration.
7. Validate poster-first loading, model success and failure, desktop and mobile
   framing, drag, zoom bounds, reduced motion, hotspots, teardown, file size,
   console output, and production publication rules.

No step requires editing `machine-viewer.tsx` or
`machine-viewer-canvas.tsx`. A viewer-engine change is justified only by a
machine-agnostic capability required by more than one configuration.

### Representative development model

Task 07 uses exactly one synthetic development model. `pnpm dev` generates the
14,212-byte GLB into ignored `.mindeq-development-assets/` and a development-only
route serves it with `no-store` and `noindex` headers. Production responds 404
for that asset route, the file is excluded from Next.js output tracing, and the
development record remains excluded from production catalogue, sitemap,
metadata, and static route output. The synthetic model and hotspots are pipeline
evidence only; they are not a MINDEQ product and must not be reused as catalogue
content.

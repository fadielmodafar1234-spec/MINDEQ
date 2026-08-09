# MINDEQ Machine Data Contract

## Purpose

One typed machine-data contract powers:

- the machine catalogue;
- dynamic machine routes;
- metadata and sitemap generation;
- technical page sections;
- viewer configuration;
- hotspots;
- galleries;
- documentation;
- featured-machine references;
- quotation context.

No machine receives a hardcoded route component or private schema variant.

## Storage and access

The initial source is locally versioned typed data validated at its boundary. Page components access data through repository functions rather than importing records directly.

The repository boundary should provide:

- getMachines — return catalogue-safe published records in a stable order;
- getFeaturedMachines — return explicitly featured published records;
- getMachineBySlug — return one published machine or no result;
- getMachinePreviewBySlug — development-only access to a non-published record when explicitly enabled;
- getPublishedMachineSlugs — return canonical slugs for static generation and sitemap.

This boundary permits a future approved CMS without changing page and component contracts.

## Machine record

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| slug | string | yes | Stable lowercase kebab-case canonical identifier |
| name | string | yes | Approved public product name |
| shortName | string | yes | Approved compact display name; may equal name |
| category | MachineCategory | yes | Stable taxonomy value |
| tagline | string | no | Verified concise positioning, not a fabricated claim |
| description | string | yes for publication | Approved plain-text product description |
| applications | Application[] | no | Verified uses or industries |
| features | Feature[] | no | Verified product features |
| specifications | SpecificationGroup[] | no | Structured verified technical values |
| dimensions | DimensionGroup[] | no | Structured verified dimensions and units |
| heroImage | ImageAsset | yes for publication | Approved primary image or poster |
| gallery | ImageAsset[] | no | Approved supporting media |
| model | ModelAsset | no | Primary viewer GLB |
| modelMobile | ModelAsset | no | Reduced mobile viewer GLB |
| modelPoster | ImageAsset | yes when model exists | Static fallback for the model |
| hotspots | Hotspot[] | no | Viewer anchors with DOM-equivalent content |
| documentation | DocumentationAsset[] | no | Approved public downloads |
| seo | MachineSeo | yes for publication | Verified metadata |
| publicationStatus | PublicationStatus | yes | development, review, or published |
| featured | boolean | yes | Explicit homepage/catalogue feature state |
| sourceReferences | SourceReference[] | yes for review | Internal provenance; never sent to the client by default |

Unknown information is omitted. Empty strings, zeroes, fabricated values, and generic filler do not represent unknown facts.

## Supporting structures

### MachineCategory

Fields:

- id — stable machine-readable category identifier;
- label — approved public label;
- description — optional approved category explanation;
- order — explicit deterministic catalogue order.

Categories are centrally defined. Individual machine records do not create spelling variants.

### Application

Fields:

- id — stable identifier;
- title — approved application label;
- description — optional verified explanation;
- industryId — optional link to an approved industry taxonomy item.

### Feature

Fields:

- id — stable identifier;
- title — approved feature label;
- description — optional verified explanation;
- componentId — optional stable link to a 3D component.

### SpecificationGroup

Fields:

- id — stable group identifier;
- label — approved group heading;
- items — ordered SpecificationItem collection.

### SpecificationItem

Fields:

- id — stable item identifier;
- label — approved technical label;
- value — source-preserving displayed value;
- unit — optional source-preserving unit;
- note — optional verified qualifier;
- sourceReferenceId — internal provenance link;
- verificationStatus — content state from docs/CONTENT.md.

The displayed value may be text because ranges, tolerances, options, and qualifiers cannot always be represented safely as one number. A separately validated numeric field may be added later for approved filtering or comparison use; the display string remains source-controlled.

### DimensionGroup

Fields:

- id — stable group identifier;
- label — approved heading;
- items — ordered DimensionItem collection;
- drawing — optional approved ImageAsset.

### DimensionItem

Fields:

- id — stable identifier;
- label — approved dimension name;
- value — source-preserving displayed value;
- unit — source-preserving unit;
- note — optional verified qualifier;
- sourceReferenceId — internal provenance link;
- verificationStatus — content state.

Dimensions are not assumed to mean length, width, and height for every machine. The source determines applicable items.

### ImageAsset

Fields:

- id — stable identifier;
- src — local or approved remote delivery path;
- alt — contextual alternative text, or empty only when explicitly decorative;
- width and height — intrinsic pixel dimensions;
- caption — optional approved caption;
- focalPoint — optional normalized crop guidance;
- credit — optional rights or attribution;
- publicationStatus — media publication state.

### ModelAsset

Fields:

- id — stable identifier;
- src — GLB delivery path;
- variant — viewer, hero, or mobile;
- fileBytes — measured delivered byte size;
- componentIds — stable identifiers exposed by the asset contract;
- componentMapVersion — model/component contract version;
- transform — approved position, rotation, and scale configuration when canonical defaults are insufficient;
- cameraPreset — optional approved initial camera configuration;
- qualityNotes — internal optimization notes;
- publicationStatus — asset publication state.

Compression capabilities and texture metadata may be added when the real asset pipeline exists. The runtime derives feature support from actual asset metadata rather than filenames alone.

### Hotspot

Required fields:

- id — stable identifier;
- label — approved concise label;
- description — approved explanation;
- position — three-number model-local coordinate tuple.

Optional fields:

- componentId — stable mesh or component identifier;
- technicalValues — ordered verified SpecificationItem collection;
- cameraPreset — approved focus framing;

Hotspot IDs are unique within a machine. Component IDs must exist in the associated model contract. The same information is presented outside the canvas.

### DocumentationAsset

Required fields:

- id — stable identifier;
- title — approved public document title;
- type — controlled document type;
- language — valid language tag;
- file — approved downloadable file path;
- publicationStatus — document publication state;

Optional source-controlled fields:

- revision — source-supplied revision;
- date — source-supplied ISO calendar date.

The schema permits an absent revision or date only when the source truly omits it and the UI has an approved omission rule. It never invents either value.

### MachineSeo

Fields:

- title — verified metadata title;
- description — verified metadata description;
- image — optional approved social image;
- canonicalPath — canonical path matching the slug;
- noIndex — true for development or review records and false only for approved publication.

Product structured data is generated only when its required visible facts are verified. The schema does not fabricate offers, ratings, availability, brand facts, or identifiers.

### SourceReference

Internal fields:

- id;
- source type;
- source title or filename;
- source location;
- revision or date when supplied;
- approval state;
- approval note.

Source references are server-only editorial data unless explicitly approved for public display.

## Publication states

### development

May contain clearly labeled placeholders. Excluded from production routes, catalogue, sitemap, metadata, structured data, homepage features, and quotation options.

### review

Uses real candidate content but is not approved for public exposure. Excluded from production discovery and indexing.

### published

Meets minimum publication requirements and has approved factual content, media, metadata, and actions.

Changing to published is an editorial decision, not an automatic result of schema validation.

## Validation rules

- Parse all records through one runtime schema at the repository boundary.
- Use strict TypeScript and infer runtime-validated types where practical.
- Reject duplicate slugs, category IDs, machine-local IDs, and source-reference IDs.
- Reject published machines missing required publication fields.
- Reject model-backed records without a poster.
- Reject hotspot component IDs absent from the declared model component map.
- Reject featured records that are not published.
- Reject non-canonical slugs and mismatched canonical paths.
- Reject production metadata or structured-data inputs sourced from development placeholders.
- Report validation failures during development and production build with the machine slug and field path.

## Serialization and bundle rules

- Keep source references and editorial notes server-only.
- Send the browser only the fields needed by the interactive client component.
- Do not serialize the complete catalogue into an individual detail page.
- Do not include model binary data in JavaScript.
- MachineViewer receives a derived viewer configuration, not the entire Machine record.
- Static technical sections remain Server Components unless interaction specifically requires a client boundary.

## Missing and optional data

- Omit a section when its entire verified group is absent.
- Do not show empty headings, zero-valued substitutes, or generic filler.
- Preserve a stable page hierarchy even when optional sections are absent.
- Viewer absence falls back to the approved poster.
- Documentation absence does not generate fake downloads.
- Quotation context includes only the machine identity and approved fields.

## Task 03 acceptance

The implementation derived from this contract must demonstrate:

- typed valid development data with unmistakable placeholder labeling;
- catalogue generation;
- one valid dynamic machine route;
- real 404 behavior for an invalid slug;
- build-time validation;
- no machine-specific route markup;
- lint, typecheck, and production build passing.

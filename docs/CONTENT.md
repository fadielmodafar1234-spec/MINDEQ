# MINDEQ Content Constitution

## Principle

MINDEQ content must be technically credible because it is accurate, attributable, and clear. Confidence is created through evidence, not invented specificity.

No factual statement becomes production content merely because it sounds plausible or improves a layout.

## Source priority

Use sources in this order:

1. Direct written approval from the authorized MINDEQ representative
2. Approved MINDEQ technical datasheets, manuals, drawings, catalogues, and company records
3. Approved source data supplied with a machine, asset, or documentation package
4. Existing MINDEQ public material that has been re-confirmed as current
5. Development placeholder content that is visibly labeled and excluded from publication

Third-party descriptions, distributor listings, search snippets, AI-generated prose, and assumptions from imagery are not authoritative sources for product facts.

Conflicts are resolved by the authorized MINDEQ representative. Preserve the conflicting sources and record the approved resolution rather than silently choosing one.

## Content states

### VERIFIED

The item has an attributable source and human approval for publication.

### APPROVED BRIEF

The item appears in the human-provided master brief and may guide product structure and positioning. It does not authorize additional supporting facts.

### DEVELOPMENT PLACEHOLDER — NOT VERIFIED

The item exists only to exercise layout, routing, schema, or interaction. It is visibly labeled wherever rendered in a development environment and is excluded from production metadata, structured data, public documents, quotations, statistics, and factual claims.

### REJECTED OR SUPERSEDED

The item must not be published. Preserve its source reference only when needed for an audit trail.

Every product-data record carries a publication status. Production builds expose only records approved for publication.

## Approved brief-level statements

The project brief authorizes these statements as product direction:

- MINDEQ is a Moroccan industrial machine manufacturer.
- The website should cover Textile, Confection, Agro-food, Construction, and Custom engineering.
- The desired positioning is industrial, engineered, precise, premium, modern, heavy, mechanical, confident, Moroccan, and technologically advanced.

These statements do not imply specific facilities, machine models, production capacity, company history, export markets, customers, certifications, patents, or performance.

## Prohibited invention

Never fabricate or infer:

- machine names presented as real products;
- throughput, speed, power, accuracy, capacity, tolerances, or operating ranges;
- dimensions, mass, utility requirements, materials, or component brands;
- compliance, safety, quality, or environmental certifications;
- customer names, testimonials, logos, or case studies;
- years in business, employee counts, installed base, countries served, or production totals;
- factory size, manufacturing processes, locations, or service coverage;
- guarantees, warranties, lead times, pricing, or availability;
- revision, issue date, or language for a document when those values are not supplied.

Visual observation of a model or photograph is not sufficient evidence for a technical claim.

## Voice and terminology

- Sound direct, precise, and technically literate.
- Prefer concrete verified descriptions over superlatives.
- Explain industrial value without exaggeration.
- Keep headings concise and body copy readable.
- Use consistent machine, component, industry, and process terminology.
- Preserve supplied model names, capitalization, units, and trademarks unless an approved normalization rule exists.
- Avoid generic innovation language that could describe any technology company.

## Technical values

- Store the displayed value and unit separately where the source permits.
- Preserve the source unit; do not convert for publication without a defined conversion and review rule.
- Use consistent decimal, thousands, range, tolerance, and unavailable-value formatting.
- Never use zero to represent an unknown value.
- Omit unavailable facts or label them according to an approved editorial rule.
- A technical value should retain a source reference in the content workflow, even if that reference is not public.

## Machine content

Each machine follows docs/MACHINE_SCHEMA.md. Content is not embedded in route components, viewer code, or one-off page layouts.

Minimum production publication requirements:

- approved slug and product name;
- approved category;
- approved concise description;
- at least one approved image or poster with alternative text;
- publication status set to published;
- approved metadata title and description;
- a contact or quotation path.

Applications, features, specifications, dimensions, models, hotspots, gallery items, and documents are optional only when the source information does not exist. The page design must handle absent groups honestly rather than filling them with generic copy.

## Company and proof content

Statistics, certification marks, client evidence, factory claims, maps, and timelines require a named approved source. If verified proof is unavailable, use a restrained company narrative or omit the proof component.

Do not use animated counters for unverified or context-free numbers.

## Images and video

Each media item records:

- stable identifier;
- source file;
- alternative text or an explicit decorative designation;
- intrinsic dimensions;
- crop or focal-point guidance where needed;
- caption when context is important;
- credit and rights information when applicable;
- verification and publication status.

Alternative text describes the content and purpose in context. It does not repeat adjacent captions or add unsupported technical claims.

Do not ship raw source imagery when an optimized delivery derivative is required.

## 3D content

3D assets follow docs/THREE_D.md. Mesh names, component labels, hotspots, and exploded-view relationships are technical content and require stable identifiers.

Hotspot descriptions and technical values follow the same verification rules as visible page copy. A component's appearance does not prove its material, manufacturer, performance, or function.

## Documentation

Each public document records:

- title;
- document type;
- language;
- file;
- revision;
- issue date;
- associated machine or scope;
- publication status;
- source and approval.

Do not invent missing revision or date values. A superseded document must be withdrawn or clearly governed by an approved archival policy. Downloads use descriptive labels that include useful type or language context.

## SEO content

- Metadata describes the actual page and uses verified names and claims.
- Placeholder machines never enter production metadata, sitemap, Product structured data, or social previews.
- Structured data mirrors visible verified content.
- Do not add ratings, prices, availability, offers, reviews, or organization facts that are not approved.
- Each published page has one canonical identity.

## Localization

The initial language set is not yet locked. Until translation ownership, target locales, URL strategy, source language, and approval workflow are decided:

- do not duplicate routes for speculative locales;
- do not publish machine-translated technical claims without human review;
- store document language explicitly;
- write components so text is not embedded in images or 3D textures unnecessarily;
- preserve enough layout flexibility for longer translated strings and right-to-left evaluation.

Adding a site language requires an explicit decision covering routing, metadata, translation authority, fallback behavior, units, documents, forms, and QA.

## Editorial workflow

1. Ingest the source without rewriting facts.
2. Record source and content state.
3. Normalize structure and terminology.
4. Flag conflicts, omissions, and unverifiable claims.
5. Obtain authorized approval.
6. Set publication status.
7. Validate page, metadata, structured data, media, and downloads together.
8. Preserve revision history through version control or the future approved content system.

## Release checklist

- No development-placeholder label or record is exposed as production truth.
- Every statistic, specification, certification, testimonial, and company claim has an approved source.
- Names, units, punctuation, and terminology are consistent.
- Missing data is omitted or handled honestly.
- Images have correct alternative-text treatment and rights.
- Documents have real metadata and valid files.
- Metadata and structured data contain only visible verified facts.
- Contact details and form destinations are current and approved.
- All published content is reviewed at target desktop and mobile widths.

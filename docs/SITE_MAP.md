# MINDEQ Site Map

## Primary navigation

| Navigation label | Route | Purpose |
| --- | --- | --- |
| HOME | / | Industrial positioning and primary product narrative |
| MACHINES | /machines | Browse the machine catalogue |
| MINDEQ / EXPERTISE | /expertise | Company, manufacturing, and custom-engineering credibility |
| CONTACT | /contact | Direct contact and inquiry entry point |

The visible navigation wording may be tuned during approved art direction. Route ownership may not change without updating this document and recording the decision in docs/DECISIONS.md.

## Route map

### /

The homepage contains the approved sequence:

1. Hero
2. Engineering and manufacturing
3. Industries
4. Featured machines
5. Custom engineering
6. Company and proof
7. Contact call to action

The static content and navigation remain complete without animation or WebGL. The later cinematic scene progressively enhances the hero and engineering narrative.

### /machines

Purpose:

- Introduce the machine catalogue.
- Allow visitors to scan machines by identity, category, application, and available verified summary information.
- Link each entry to its canonical dynamic detail route.
- Avoid loading interactive 3D assets for the full catalogue.

Catalogue cards use poster imagery only unless a future approved decision introduces another lightweight medium.

### /machines/[slug]

One reusable route renders all machine detail pages from structured machine data.

Required content regions:

- Machine identity
- Interactive viewer or accessible poster fallback
- Description
- Applications
- Features
- Technical specifications
- Dimensions
- Hotspots and their DOM equivalents
- Gallery
- Documentation
- Quotation call to action

The route must not contain machine-specific page markup. An unknown, invalid, or unpublished slug returns the application 404 through Next.js notFound behavior.

### /expertise

Purpose:

- Explain verified engineering and manufacturing capabilities.
- Present the company and Moroccan industrial context using approved content.
- Explain the custom-engineering process when source material is available.
- Direct relevant visitors to machines or contact.

This page must not fabricate facilities, processes, capacity, certifications, history, or client evidence.

### /contact

Purpose:

- Provide verified contact details.
- Offer a general inquiry path.
- Support quotation intent with machine context when the visitor arrives from a machine page.
- Present clear success, validation, failure, and privacy-related states once form submission is implemented.

The delivery provider and data-retention policy require an explicit decision before a production form is enabled.

### Application routes

- not-found: branded accessible 404 with links to HOME, MACHINES, and CONTACT.
- robots: environment-aware crawler policy.
- sitemap: canonical indexable routes and published machine slugs only.

## URL rules

- Use lowercase kebab-case paths and slugs.
- Keep machine slugs stable after publication.
- A slug change requires an explicit redirect plan.
- Use one canonical URL for each page.
- Do not expose development-placeholder machines in sitemap or production metadata.
- Query parameters may support catalogue filtering, but the unfiltered route remains canonical unless an SEO decision specifies otherwise.

## Cross-page journeys

### Product discovery

HOME → MACHINES → MACHINE DETAIL → QUOTATION

### Custom requirement

HOME → CUSTOM ENGINEERING → EXPERTISE → CONTACT

### Technical evaluation

MACHINE DETAIL → SPECIFICATIONS / DOCUMENTATION → QUOTATION

### Recovery

INVALID ROUTE → 404 → HOME / MACHINES / CONTACT

## Responsive navigation behavior

- Desktop navigation remains visible and understandable over both light and dark sections.
- Mobile navigation provides a clear menu button, focus management, escape handling, scroll containment, and restoration of focus when closed.
- Every navigation target remains available without hover.
- Sticky behavior must not obscure headings or trap keyboard users.

## Future route policy

New routes require:

1. a product purpose;
2. an owner and verified content source;
3. placement in navigation or an intentional discovery path;
4. metadata and canonical behavior;
5. responsive and accessibility acceptance criteria;
6. an entry in docs/DECISIONS.md when the change affects locked structure.

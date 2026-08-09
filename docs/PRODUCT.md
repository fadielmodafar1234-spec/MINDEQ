# MINDEQ Product Definition

## Product identity

MINDEQ is described in the approved project brief as a Moroccan industrial machine manufacturer. The website must present MINDEQ as a credible manufacturer of serious industrial equipment and as a capable custom-engineering partner.

The brief identifies the following industry areas:

- Textile
- Confection
- Agro-food
- Construction
- Custom engineering

This document does not assert specific machines, technical capabilities, certifications, customers, production capacity, or company statistics. Those require verified source material under docs/CONTENT.md.

## Website objective

Create a world-class industrial website that combines:

- premium static art direction;
- clear manufacturing and engineering credibility;
- a reusable structured machine catalogue;
- technically useful machine-detail pages;
- an accessible and performant 3D machine viewer;
- purposeful cinematic homepage storytelling;
- modern documentation and quotation journeys;
- excellent desktop and mobile behavior.

The website must make MINDEQ understandable and credible before animation begins. Motion and 3D support the product narrative; they are not the product.

## Primary audiences

### Technical evaluators

Engineers and operations teams need clear applications, features, dimensions, specifications, documentation, and an understandable view of the machine.

### Purchasing decision-makers

Procurement and management teams need fast product identification, evidence of manufacturing credibility, downloadable information, and a direct quotation path.

### Prospective custom-engineering customers

Organizations with non-standard production needs need evidence that MINDEQ can understand an industrial problem and discuss a tailored solution. Detailed capability claims require verification before publication.

### Partners and prospective team members

Secondary visitors need a coherent view of the company, its industrial focus, and how to contact it.

## User outcomes

A successful visitor can:

1. Understand what MINDEQ is and where it operates within a few seconds.
2. Browse machines without downloading every machine's media or 3D model.
3. Open a stable URL for a specific machine.
4. Inspect technical information without navigating through visual gimmicks.
5. Explore a representative machine interactively when their device and preferences support it.
6. Access relevant verified documentation.
7. Request a quotation or contact MINDEQ with clear context.

## Product principles

### Engineering before spectacle

Typography, hierarchy, content, photography, and static composition establish credibility. 3D and motion reveal structure or guide attention only when they add meaning.

### Technical clarity

Machine information must be scannable, consistently structured, and usable by technical and purchasing audiences.

### Evidence over claims

No specification, statistic, certification, customer, or performance claim is published without an approved source.

### One system, many machines

The catalogue and detail pages are generated from structured machine data. One reusable viewer handles supported machines through configuration.

### Progressive enhancement

Core navigation, identity, content, documents, and contact paths work without cinematic animation or WebGL.

### Mobile parity of intent

Mobile may simplify scenes and choreography but may not remove essential information or feel like an inferior desktop reduction.

### Performance is product quality

Loading, responsiveness, stability, and memory behavior are part of the experience and are evaluated throughout the build.

## Initial scope

- Global navigation and footer
- Homepage with seven approved sections
- Machine catalogue at /machines
- Dynamic machine detail pages at /machines/[slug]
- Expertise page at /expertise
- Contact page at /contact
- Reusable MachineViewer
- One representative machine through the complete 3D pipeline
- Documentation-download presentation
- Contact and quotation calls to action
- Responsive and reduced-motion behavior
- SEO foundations
- Automated validation for critical flows

## Non-goals for the initial build

- Processing the full machine catalogue before one representative pipeline is proven
- A customer portal, ecommerce checkout, or public pricing system
- An unapproved headless CMS integration
- A standalone 3D product platform
- Decorative animation without narrative or usability value
- Inventing company history, capabilities, product data, or social proof
- Publishing additional languages before translation ownership and approved copy exist

## Success criteria

### Product

- Visitors can identify MINDEQ's industrial positioning and reach relevant machines or contact actions quickly.
- Machine pages present all available verified technical data in a consistent format.
- The homepage and machine pages remain coherent when animation and WebGL are unavailable.

### Experience

- Static screenshots at approved desktop and mobile viewports feel intentional and premium.
- Motion feels mechanical, controlled, precise, and comprehensible.
- Mobile composition, tables, forms, and media are deliberately adapted.

### Engineering

- Routes, schemas, components, animation, and 3D systems remain reusable rather than machine-specific.
- Lint, typecheck, tests, and production build pass in applicable phases.
- Reduced-motion, keyboard, responsive, invalid-route, and critical contact flows are validated.

### Performance

- LCP target: below 2.5 seconds.
- CLS target: below 0.1.
- INP target: below 200 milliseconds.
- Model and asset budgets in docs/PERFORMANCE.md are respected or any exception is measured and explicitly approved.

## Release boundary

The initial release becomes a candidate only after the final engineering audit and final visual regression phase pass. New visual concepts or product features require a new explicit decision rather than being added during final QA.

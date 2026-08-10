import Image from "next/image";
import Link from "next/link";

import { MachineViewer } from "@/components/machine-viewer/machine-viewer";
import type { MachineViewerConfig } from "@/components/machine-viewer/types";
import { ActionLink } from "@/components/ui/action-link";
import type { MachineDetailPageModel } from "@/lib/machines/detail-page";

import { DevelopmentPlaceholderNotice } from "./development-placeholder-notice";
import { MachineTechnicalContent } from "./machine-technical-content";

type MachineDetailPageProps = Readonly<{
  machine: MachineDetailPageModel;
  viewerConfig: MachineViewerConfig | null;
}>;

export function MachineDetailPage({
  machine,
  viewerConfig,
}: MachineDetailPageProps) {
  return (
    <main className="machine-page page-shell" id="main-content">
      <Link className="back-link" href="/machines">
        Back to machines
      </Link>

      <header className="machine-page__header">
        <p className="eyebrow">{machine.identity.category}</p>
        <h1>{machine.identity.name}</h1>
        {machine.identity.tagline ? (
          <p className="machine-tagline">{machine.identity.tagline}</p>
        ) : null}
      </header>

      {machine.identity.publicationStatus === "development" ? (
        <DevelopmentPlaceholderNotice />
      ) : null}

      {viewerConfig ? (
        <MachineViewer config={viewerConfig} />
      ) : (
        <Image
          alt={machine.poster.alt}
          className="machine-page__poster"
          height={machine.poster.height}
          priority
          sizes="(max-width: 72rem) 100vw, 72rem"
          src={machine.poster.src}
          width={machine.poster.width}
        />
      )}

      <section aria-labelledby="overview-heading" className="machine-overview">
        <h2 id="overview-heading">Overview</h2>
        <p>{machine.overview}</p>
      </section>

      <MachineTechnicalContent machine={machine} />

      {machine.gallery.length > 0 ? (
        <section aria-labelledby="gallery-heading">
          <h2 id="gallery-heading">Gallery</h2>
          <div className="machine-gallery">
            {machine.gallery.map((image) => (
              <figure key={image.id}>
                <Image
                  alt={image.alt}
                  height={image.height}
                  sizes="(max-width: 48rem) 100vw, 50vw"
                  src={image.src}
                  width={image.width}
                />
                {image.caption ? (
                  <figcaption>{image.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="quotation-heading"
        className="machine-quotation"
      >
        <h2 id="quotation-heading">Discuss this machine</h2>
        <p>Contact MINDEQ to discuss your production requirement.</p>
        <ActionLink href={machine.quotationHref} variant="primary">
          Request a quotation
        </ActionLink>
      </section>
    </main>
  );
}

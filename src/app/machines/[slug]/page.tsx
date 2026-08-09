import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DevelopmentPlaceholderNotice } from "@/components/machines/development-placeholder-notice";
import { MachineTechnicalContent } from "@/components/machines/machine-technical-content";
import {
  getMachineForEnvironment,
  getPublishedMachineSlugs,
} from "@/lib/machines/repository";

type MachinePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedMachineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: MachinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachineForEnvironment(slug);

  if (!machine) {
    return {
      title: "Machine not found",
      robots: { follow: false, index: false },
    };
  }

  return {
    title: machine.seo.title,
    description: machine.seo.description,
    alternates: { canonical: machine.seo.canonicalPath },
    robots: {
      follow: !machine.seo.noIndex,
      index: !machine.seo.noIndex,
    },
  };
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { slug } = await params;
  const machine = getMachineForEnvironment(slug);

  if (!machine) {
    notFound();
  }

  const poster = machine.modelPoster ?? machine.heroImage;

  return (
    <main className="machine-page page-shell" id="main-content">
      <Link className="back-link" href="/machines">
        Back to machines
      </Link>

      <header className="machine-page__header">
        <p className="eyebrow">{machine.category.label}</p>
        <h1>{machine.name}</h1>
        {machine.tagline ? <p className="machine-tagline">{machine.tagline}</p> : null}
        {machine.publicationStatus === "development" ? (
          <DevelopmentPlaceholderNotice />
        ) : null}
      </header>

      <Image
        alt={poster.alt}
        className="machine-page__poster"
        height={poster.height}
        priority
        sizes="(max-width: 72rem) 100vw, 72rem"
        src={poster.src}
        width={poster.width}
      />

      <section aria-labelledby="overview-heading" className="machine-overview">
        <h2 id="overview-heading">Overview</h2>
        <p>{machine.description}</p>
      </section>

      <MachineTechnicalContent
        machine={{
          applications: machine.applications,
          features: machine.features,
          specifications: machine.specifications,
          dimensions: machine.dimensions,
          hotspots: machine.hotspots,
          documentation: machine.documentation,
        }}
      />

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
                {image.caption ? <figcaption>{image.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

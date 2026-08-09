import Image from "next/image";
import Link from "next/link";

import type { MachineCardSummary } from "@/lib/machines/card-summary";

import { DevelopmentPlaceholderNotice } from "./development-placeholder-notice";

type MachineCardProps = Readonly<{
  headingLevel?: "h2" | "h3";
  machine: MachineCardSummary;
}>;

export function MachineCard({ headingLevel, machine }: MachineCardProps) {
  const Heading = headingLevel === "h3" ? "h3" : "h2";

  return (
    <article className="machine-card">
      <Link
        aria-label={`View ${machine.name}`}
        className="machine-card__image-link"
        href={`/machines/${machine.slug}`}
      >
        <Image
          alt={machine.heroImage.alt}
          height={machine.heroImage.height}
          sizes="(max-width: 48rem) 100vw, 50vw"
          src={machine.heroImage.src}
          width={machine.heroImage.width}
        />
      </Link>
      <div className="machine-card__content">
        <p className="eyebrow">{machine.category.label}</p>
        <Heading>
          <Link href={`/machines/${machine.slug}`}>{machine.shortName}</Link>
        </Heading>
        {machine.tagline ? <p>{machine.tagline}</p> : null}
        {machine.publicationStatus === "development" ? (
          <DevelopmentPlaceholderNotice />
        ) : null}
      </div>
    </article>
  );
}

import { MachineCard } from "@/components/machines/machine-card";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { Machine } from "@/lib/machines/types";

export type FeaturedMachine = Pick<
  Machine,
  | "slug"
  | "name"
  | "shortName"
  | "category"
  | "tagline"
  | "heroImage"
  | "publicationStatus"
>;

type FeaturedMachinesSectionProps = Readonly<{
  featuredMachines: readonly FeaturedMachine[];
}>;

export function FeaturedMachinesSection({
  featuredMachines,
}: FeaturedMachinesSectionProps) {
  const publishedMachines = featuredMachines.filter(
    (machine) => machine.publicationStatus === "published",
  );

  return (
    <Section
      id="featured-machines"
      index="04"
      label="Featured machines"
      tone="dark"
    >
      <Container className="featured-machines-chapter" size="wide">
        <div className="home-chapter-heading">
          <p className="eyebrow">Catalogue</p>
          <h2>Featured machines</h2>
        </div>
        {publishedMachines.length > 0 ? (
          <div className="machine-grid home-machine-grid">
            {publishedMachines.map((machine) => (
              <MachineCard
                headingLevel="h3"
                key={machine.slug}
                machine={machine}
              />
            ))}
          </div>
        ) : (
          <div className="home-empty-state">
            <p>No verified featured machines are published yet.</p>
          </div>
        )}
        <ActionLink href="/machines" variant="text">
          Browse all machines
        </ActionLink>
      </Container>
    </Section>
  );
}

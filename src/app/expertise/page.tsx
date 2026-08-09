import type { Metadata } from "next";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Expertise",
  description:
    "MINDEQ manufacturing and custom-engineering positioning across approved industry areas.",
};

export default function ExpertisePage() {
  return (
    <main id="main-content">
      <Section id="expertise" index="01" label="Expertise" tone="light">
        <Container size="text">
          <p className="eyebrow">Engineering and manufacturing</p>
          <h1>Expertise</h1>
          <p>
            MINDEQ is a Moroccan industrial machine manufacturer and
            custom-engineering partner.
          </p>
          <p>
            MINDEQ works across Textile, Confection, Agro-food, Construction,
            and Custom engineering.
          </p>
          <div className="home-actions">
            <ActionLink href="/machines" variant="primary">
              Explore machines
            </ActionLink>
            <ActionLink href="/contact" variant="text">
              Discuss a requirement
            </ActionLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}

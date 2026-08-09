import type { Route } from "next";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function CustomEngineeringSection() {
  return (
    <Section
      id="custom-engineering"
      index="05"
      label="Custom engineering"
      tone="surface"
    >
      <Container className="custom-engineering-chapter" size="wide">
        <div className="home-chapter-heading">
          <p className="eyebrow">Non-standard requirements</p>
          <h2>Custom engineering</h2>
        </div>
        <div className="custom-engineering-chapter__body">
          <p>
            MINDEQ is a custom-engineering partner for non-standard industrial
            requirements.
          </p>
          <div className="home-actions">
            <ActionLink href={"/expertise" as Route} variant="primary">
              Explore expertise
            </ActionLink>
            <ActionLink href={"/contact" as Route} variant="text">
              Discuss a requirement
            </ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

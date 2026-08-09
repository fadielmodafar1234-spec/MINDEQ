import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

import { MachineStage } from "./machine-stage";

export function HomeHero() {
  return (
    <Section id="hero" index="01" label="Identity" tone="dark">
      <Container className="home-hero" size="wide">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">
            Moroccan industrial machine manufacturer
          </p>
          <h1>MINDEQ</h1>
          <p className="home-hero__statement">
            Industrial machines and custom engineering for production
            requirements.
          </p>
          <div className="home-actions">
            <ActionLink href="/machines" variant="primary">
              Explore machines
            </ActionLink>
            <ActionLink href="/contact" variant="secondary">
              Discuss a requirement
            </ActionLink>
          </div>
          <a className="home-hero__continue" href="#engineering">
            Continue
          </a>
        </div>
        <MachineStage />
      </Container>
    </Section>
  );
}

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function ContactCtaSection() {
  return (
    <Section id="contact" index="07" label="Contact" tone="dark">
      <Container className="contact-chapter" size="wide">
        <p className="eyebrow">Start a conversation</p>
        <h2>Discuss an industrial requirement.</h2>
        <p>
          Contact MINDEQ about a machine or a custom-engineering requirement.
        </p>
        <ActionLink href="/contact" variant="primary">
          Contact MINDEQ
        </ActionLink>
      </Container>
    </Section>
  );
}

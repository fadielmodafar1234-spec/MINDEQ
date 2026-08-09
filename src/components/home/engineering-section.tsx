import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function EngineeringSection() {
  return (
    <Section
      id="engineering"
      index="02"
      label="Engineering and manufacturing"
      tone="surface"
    >
      <Container className="engineering-chapter" size="wide">
        <h2 className="engineering-statement">
          <span>DESIGNED.</span>
          <span>ENGINEERED.</span>
          <span>MANUFACTURED.</span>
          <span>IN MOROCCO.</span>
        </h2>
        <p className="engineering-chapter__copy">
          MINDEQ brings industrial-machine manufacturing and engineering into
          one focused Moroccan identity.
        </p>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const industries = [
  "Textile",
  "Confection",
  "Agro-food",
  "Construction",
  "Custom engineering",
] as const;

export function IndustriesSection() {
  return (
    <Section id="industries" index="03" label="Industries" tone="light">
      <Container className="industries-chapter" size="wide">
        <div className="home-chapter-heading">
          <p className="eyebrow">Industrial fields</p>
          <h2>Five areas of focus.</h2>
        </div>
        <ul className="industry-index">
          {industries.map((industry) => (
            <li key={industry}>{industry}</li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

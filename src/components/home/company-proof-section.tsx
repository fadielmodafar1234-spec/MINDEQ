import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const companyFacts = [
  "Moroccan origin",
  "Industrial-machine focus",
  "Custom-engineering scope",
] as const;

export function CompanyProofSection() {
  return (
    <Section
      id="company-proof"
      index="06"
      label="Company and proof"
      tone="light"
    >
      <Container className="company-proof-chapter" size="wide">
        <div className="home-chapter-heading">
          <p className="eyebrow">MINDEQ</p>
          <h2>Industrial focus. Moroccan origin.</h2>
          <p>
            MINDEQ is a Moroccan industrial machine manufacturer and
            custom-engineering partner.
          </p>
        </div>
        <ul className="company-facts">
          {companyFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

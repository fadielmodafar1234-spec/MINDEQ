import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const industries = [
  { index: "01", name: "Textile" },
  { index: "02", name: "Confection" },
  { index: "03", name: "Agro-food" },
  { index: "04", name: "Construction" },
  { index: "05", name: "Custom engineering" },
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
          {industries.map((item) => (
            <li key={item.index}>
              <span className="industry-index__num">{item.index}</span>
              <span className="industry-index__name">{item.name}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

import type { ReactNode } from "react";

type SectionProps = Readonly<{
  children: ReactNode;
  id: string;
  index: string;
  label: string;
  tone: "dark" | "light" | "surface";
}>;

export function Section({ children, id, index, label, tone }: SectionProps) {
  return (
    <section
      className={`section section--${tone}`}
      data-section-index={index}
      id={id}
    >
      <div aria-hidden="true" className="section__datum">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      {children}
    </section>
  );
}

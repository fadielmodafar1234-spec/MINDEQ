import type { Metadata } from "next";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Inquiry information for MINDEQ machines and custom-engineering requirements.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <Section id="contact-inquiry" index="01" label="Contact" tone="light">
        <Container size="text">
          <p className="eyebrow">Industrial inquiries</p>
          <h1>Contact MINDEQ</h1>
          <p>
            This page is the inquiry entry point for a machine or a
            custom-engineering requirement.
          </p>
          <p>
            A production delivery channel will be enabled after its destination
            and privacy handling are approved.
          </p>
          <div className="home-actions">
            <ActionLink href="/machines" variant="primary">
              Explore machines
            </ActionLink>
            <ActionLink href="/expertise" variant="text">
              Explore expertise
            </ActionLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}

import { CompanyProofSection } from "./company-proof-section";
import { ContactCtaSection } from "./contact-cta-section";
import { CustomEngineeringSection } from "./custom-engineering-section";
import { EngineeringSection } from "./engineering-section";
import {
  FeaturedMachinesSection,
  type FeaturedMachine,
} from "./featured-machines-section";
import { HomeHero } from "./home-hero";
import { IndustriesSection } from "./industries-section";

type HomepageProps = Readonly<{
  featuredMachines: readonly FeaturedMachine[];
}>;

export function Homepage({ featuredMachines }: HomepageProps) {
  return (
    <main className="homepage" id="main-content">
      <HomeHero />
      <EngineeringSection />
      <IndustriesSection />
      <FeaturedMachinesSection featuredMachines={featuredMachines} />
      <CustomEngineeringSection />
      <CompanyProofSection />
      <ContactCtaSection />
    </main>
  );
}

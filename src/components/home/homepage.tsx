import { CompanyProofSection } from "./company-proof-section";
import { ContactCtaSection } from "./contact-cta-section";
import { CustomEngineeringSection } from "./custom-engineering-section";
import { EngineeringSection } from "./engineering-section";
import type { MachineCardSummary } from "@/lib/machines/card-summary";
import type { HomepageSceneConfig } from "@/components/homepage-scene/types";

import { FeaturedMachinesSection } from "./featured-machines-section";
import { HomeHero } from "./home-hero";
import { IndustriesSection } from "./industries-section";

type HomepageProps = Readonly<{
  featuredMachines: readonly MachineCardSummary[];
  homepageSceneConfig?: HomepageSceneConfig | null;
}>;

export function Homepage({
  featuredMachines,
  homepageSceneConfig = null,
}: HomepageProps) {
  return (
    <main className="homepage" id="main-content">
      <HomeHero sceneConfig={homepageSceneConfig} />
      <EngineeringSection />
      <IndustriesSection />
      <FeaturedMachinesSection featuredMachines={featuredMachines} />
      <CustomEngineeringSection />
      <CompanyProofSection />
      <ContactCtaSection />
    </main>
  );
}

import { Homepage } from "@/components/home/homepage";
import { toMachineCardSummary } from "@/lib/machines/card-summary";
import { getFeaturedMachines } from "@/lib/machines/repository";
import { getDevelopmentHomepageSceneConfig } from "@/lib/machines/homepage-scene-config";

export default function HomePage() {
  const featuredMachines = getFeaturedMachines().map(toMachineCardSummary);
  const homepageSceneConfig = getDevelopmentHomepageSceneConfig();

  return (
    <Homepage
      featuredMachines={featuredMachines}
      homepageSceneConfig={homepageSceneConfig}
    />
  );
}

import { Homepage } from "@/components/home/homepage";
import { toMachineCardSummary } from "@/lib/machines/card-summary";
import { getFeaturedMachines } from "@/lib/machines/repository";

export default function HomePage() {
  const featuredMachines = getFeaturedMachines().map(toMachineCardSummary);

  return <Homepage featuredMachines={featuredMachines} />;
}

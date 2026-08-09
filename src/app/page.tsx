import { Homepage } from "@/components/home/homepage";
import { getFeaturedMachines } from "@/lib/machines/repository";

export default function HomePage() {
  const featuredMachines = getFeaturedMachines().map((machine) => ({
    slug: machine.slug,
    name: machine.name,
    shortName: machine.shortName,
    category: machine.category,
    tagline: machine.tagline,
    heroImage: machine.heroImage,
    publicationStatus: machine.publicationStatus,
  }));

  return <Homepage featuredMachines={featuredMachines} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MachineDetailPage } from "@/components/machines/machine-detail-page";
import { toMachineDetailPageModel } from "@/lib/machines/detail-page";
import {
  getMachineForEnvironment,
  getPublishedMachineSlugs,
} from "@/lib/machines/repository";
import { createMachineViewerConfig } from "@/lib/machines/viewer-config";

type MachinePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedMachineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: MachinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachineForEnvironment(slug);

  if (!machine) {
    return {
      title: "Machine not found",
      robots: { follow: false, index: false },
    };
  }

  return {
    title: machine.seo.title,
    description: machine.seo.description,
    alternates: { canonical: machine.seo.canonicalPath },
    robots: {
      follow: !machine.seo.noIndex,
      index: !machine.seo.noIndex,
    },
  };
}

export default async function MachinePage({ params }: MachinePageProps) {
  const { slug } = await params;
  const machine = getMachineForEnvironment(slug);

  if (!machine) {
    notFound();
  }

  const viewerConfig = createMachineViewerConfig(machine);
  const detailModel = toMachineDetailPageModel(machine);

  return (
    <MachineDetailPage machine={detailModel} viewerConfig={viewerConfig} />
  );
}

import Image from "next/image";

import type {
  MachineDetailPageModel,
  MachineDetailTechnicalGroup,
  MachineDetailTechnicalItem,
} from "@/lib/machines/detail-page";
import type { Machine } from "@/lib/machines/types";

import { MachineTechnicalTable } from "./machine-technical-table";

type TechnicalMachineContent = Readonly<{
  applications: MachineDetailPageModel["applications"];
  features: MachineDetailPageModel["features"];
  specifications: MachineDetailPageModel["specificationGroups"];
  dimensions: MachineDetailPageModel["dimensionGroups"];
  hotspots: readonly Readonly<
    Omit<Machine["hotspots"][number], "technicalValues"> & {
      technicalValues?: readonly MachineDetailTechnicalItem[] | undefined;
    }
  >[];
  documentation: MachineDetailPageModel["documentation"];
}>;

type MachineTechnicalContentProps = Readonly<{
  machine: TechnicalMachineContent;
}>;

function withPresentableItems(
  groups: readonly MachineDetailTechnicalGroup[],
): readonly MachineDetailTechnicalGroup[] {
  return groups.flatMap((group) => {
    const items = group.items.filter(
      (item) => item.verificationStatus !== "rejected-or-superseded",
    );

    return items.length > 0 ? [{ ...group, items }] : [];
  });
}

export function MachineTechnicalContent({
  machine,
}: MachineTechnicalContentProps) {
  const specificationGroups = withPresentableItems(machine.specifications);
  const dimensionGroups = machine.dimensions.flatMap((group) => {
    const [presentableGroup] = withPresentableItems([group]);

    return presentableGroup ? [{ ...group, items: presentableGroup.items }] : [];
  });
  const hasContent =
    machine.applications.length > 0 ||
    machine.features.length > 0 ||
    specificationGroups.length > 0 ||
    dimensionGroups.length > 0 ||
    machine.hotspots.length > 0 ||
    machine.documentation.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="technical-content">
      {machine.applications.length > 0 ? (
        <section aria-labelledby="applications-heading">
          <h2 id="applications-heading">Applications</h2>
          <ul>
            {machine.applications.map((application) => (
              <li key={application.id}>
                <strong>{application.title}</strong>
                {application.description ? (
                  <p>{application.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {machine.features.length > 0 ? (
        <section aria-labelledby="features-heading">
          <h2 id="features-heading">Features</h2>
          <ul>
            {machine.features.map((feature) => (
              <li key={feature.id}>
                <strong>{feature.title}</strong>
                {feature.description ? <p>{feature.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {specificationGroups.map((group) => (
        <MachineTechnicalTable group={group} key={group.id} />
      ))}

      {dimensionGroups.map((group) => (
        <div className="machine-dimension-group" key={group.id}>
          <MachineTechnicalTable group={group} />
          {group.drawing ? (
            <figure>
              <Image
                alt={group.drawing.alt}
                height={group.drawing.height}
                sizes="(max-width: 72rem) 100vw, 72rem"
                src={group.drawing.src}
                width={group.drawing.width}
              />
              {group.drawing.caption ? (
                <figcaption>{group.drawing.caption}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      ))}

      {machine.hotspots.length > 0 ? (
        <section aria-labelledby="hotspots-heading">
          <h2 id="hotspots-heading">Machine details</h2>
          <ul>
            {machine.hotspots.map((hotspot) => {
              const technicalValues = (hotspot.technicalValues ?? []).filter(
                (item) =>
                  item.verificationStatus !== "rejected-or-superseded",
              );

              return (
                <li key={hotspot.id}>
                  <strong>{hotspot.label}</strong>
                  <p>{hotspot.description}</p>
                  {technicalValues.length > 0 ? (
                    <MachineTechnicalTable
                      group={{
                        id: `${hotspot.id}-technical-values`,
                        label: `${hotspot.label} technical values`,
                        items: technicalValues,
                      }}
                      headingLevel="h3"
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {machine.documentation.length > 0 ? (
        <section aria-labelledby="documentation-heading">
          <h2 id="documentation-heading">Documentation</h2>
          <ul>
            {machine.documentation.map((document) => (
              <li key={document.id}>
                <a download href={document.file}>
                  {document.title}
                </a>
                <span>
                  {document.type} · {document.language}
                </span>
                {document.revision ? (
                  <span>Revision {document.revision}</span>
                ) : null}
                {document.date ? (
                  <time dateTime={document.date}>{document.date}</time>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

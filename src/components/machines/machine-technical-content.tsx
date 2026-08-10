import Image from "next/image";

import type { MachineDetailPageModel } from "@/lib/machines/detail-page";

import { MachineTechnicalTable } from "./machine-technical-table";

type TechnicalMachineContent = Pick<
  MachineDetailPageModel,
  | "applications"
  | "features"
  | "specificationGroups"
  | "dimensionGroups"
  | "hotspots"
  | "documentation"
>;

type MachineTechnicalContentProps = Readonly<{
  machine: TechnicalMachineContent;
}>;

export function MachineTechnicalContent({
  machine,
}: MachineTechnicalContentProps) {
  const hasContent =
    machine.applications.length > 0 ||
    machine.features.length > 0 ||
    machine.specificationGroups.length > 0 ||
    machine.dimensionGroups.length > 0 ||
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

      {machine.specificationGroups.map((group) => (
        <MachineTechnicalTable
          group={group}
          headingId={`specification-${group.id}-heading`}
          key={group.id}
        />
      ))}

      {machine.dimensionGroups.map((group) => (
        <div className="machine-dimension-group" key={group.id}>
          <MachineTechnicalTable
            group={group}
            headingId={`dimension-${group.id}-heading`}
          />
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
              const technicalValues = hotspot.technicalValues ?? [];

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
                      headingId={`hotspot-${hotspot.id}-technical-values-heading`}
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

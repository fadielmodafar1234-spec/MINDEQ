import type { Machine } from "@/lib/machines/types";

type TechnicalMachineContent = Pick<
  Machine,
  | "applications"
  | "features"
  | "specifications"
  | "dimensions"
  | "hotspots"
  | "documentation"
>;

type MachineTechnicalContentProps = Readonly<{
  machine: TechnicalMachineContent;
}>;

export function MachineTechnicalContent({
  machine,
}: MachineTechnicalContentProps) {
  const specificationGroups = machine.specifications
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.verificationStatus !== "rejected-or-superseded",
      ),
    }))
    .filter((group) => group.items.length > 0);
  const dimensionGroups = machine.dimensions
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.verificationStatus !== "rejected-or-superseded",
      ),
    }))
    .filter((group) => group.items.length > 0);
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
        <section aria-labelledby={`${group.id}-heading`} key={group.id}>
          <h2 id={`${group.id}-heading`}>{group.label}</h2>
          <dl>
            {group.items.map((item) => (
              <div className="technical-value" key={item.id}>
                <dt>{item.label}</dt>
                <dd>
                  {item.value}
                  {item.unit ? ` ${item.unit}` : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {dimensionGroups.map((group) => (
        <section aria-labelledby={`${group.id}-heading`} key={group.id}>
          <h2 id={`${group.id}-heading`}>{group.label}</h2>
          <dl>
            {group.items.map((item) => (
              <div className="technical-value" key={item.id}>
                <dt>{item.label}</dt>
                <dd>
                  {item.value}
                  {item.unit ? ` ${item.unit}` : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
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
                    <dl>
                      {technicalValues.map((item) => (
                        <div className="technical-value" key={item.id}>
                          <dt>{item.label}</dt>
                          <dd>
                            {item.value}
                            {item.unit ? ` ${item.unit}` : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
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
                <a href={document.file}>{document.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

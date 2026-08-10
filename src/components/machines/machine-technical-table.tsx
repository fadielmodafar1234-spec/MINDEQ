import type { MachineDetailTechnicalGroup } from "@/lib/machines/detail-page";

type MachineTechnicalTableProps = Readonly<{
  group: MachineDetailTechnicalGroup;
  headingLevel?: "h2" | "h3";
}>;

export function MachineTechnicalTable({
  group,
  headingLevel: Heading = "h2",
}: MachineTechnicalTableProps) {
  return (
    <section aria-labelledby={`${group.id}-heading`}>
      <Heading id={`${group.id}-heading`}>{group.label}</Heading>
      <div
        aria-labelledby={`${group.id}-heading`}
        className="machine-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table>
          <tbody>
            {group.items.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.label}</th>
                <td>
                  <span>
                    {item.value}
                    {item.unit ? ` ${item.unit}` : null}
                  </span>
                  {item.note ? <small>{item.note}</small> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import type { Metadata } from "next";

import { MachineCard } from "@/components/machines/machine-card";
import { toMachineCardSummary } from "@/lib/machines/card-summary";
import { getMachinesForEnvironment } from "@/lib/machines/repository";

export const metadata: Metadata = {
  title: "Machines",
  description: "Explore the MINDEQ machine catalogue.",
};

export default function MachinesPage() {
  const machines = getMachinesForEnvironment().map(toMachineCardSummary);

  return (
    <main className="catalogue-shell page-shell" id="main-content">
      <header className="page-introduction">
        <p className="eyebrow">Machine catalogue</p>
        <h1>Machines</h1>
        <p>
          Published MINDEQ machines will appear here after their technical and
          editorial content has been verified.
        </p>
      </header>

      {machines.length > 0 ? (
        <div className="machine-grid">
          {machines.map((machine) => (
            <MachineCard key={machine.slug} machine={machine} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No verified machines are published yet.</p>
      )}
    </main>
  );
}

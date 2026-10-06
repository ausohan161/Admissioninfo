import { AdmissionUnit } from "@/data/types";
import { computeStatus } from "@/lib/status";

export function StatusBadge({ unit, today }: { unit: AdmissionUnit; today: string }) {
  const info = computeStatus(unit, today);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${info.className}`}
    >
      {info.labelBn}
    </span>
  );
}

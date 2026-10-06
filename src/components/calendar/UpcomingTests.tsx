import { Sparkles } from "lucide-react";
import { FlatUnitRow } from "@/data/types";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { toBanglaNumber } from "@/lib/bangla";
import { texts } from "@/lib/texts";

export function UpcomingTests({ rows, today }: { rows: FlatUnitRow[]; today: string }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-violet-700 sm:text-base">
        <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
        {texts.sectionUpcoming}
      </h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
        {rows.length === 0 ? (
          <EmptyState
            title={texts.emptyUpcomingTitle}
            description={texts.emptyUpcomingDesc}
          />
        ) : (
          <ul className="divide-y divide-slate-200">
            {rows.map(({ university, unit }, index) => (
              <li key={`${university.id}-${unit.id}`} className="flex items-start justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-extrabold text-white">
                    {toBanglaNumber(index + 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-navy-800">
                      {university.shortName}
                      {unit.nameBn && (
                        <span className="font-normal text-slate-500"> — {unit.nameBn}</span>
                      )}
                    </p>
                  </div>
                </div>
                <CountdownBadge unit={unit} today={today} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FlatUnitRow } from "@/data/types";
import { getCategoryById } from "@/data/categories";
import { formatBanglaDate } from "@/lib/bangla";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { texts } from "@/lib/texts";

export function AdmissionMobileList({ rows, today }: { rows: FlatUnitRow[]; today: string }) {
  return (
    <div className="space-y-3 sm:hidden">
      {rows.map(({ university, unit }) => {
        const category = getCategoryById(university.category);
        const theme = getCategoryTheme(university.category);
        return (
          <Link
            key={`${university.id}-${unit.id}`}
            href={`/university/${university.id}`}
            className={`block rounded-xl border border-slate-200 border-t-4 bg-white p-4 shadow-soft active:bg-slate-50 ${theme.topBorder}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${theme.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden />
                  {category?.shortNameBn}
                </span>
                <h3 className="mt-1.5 text-sm font-bold leading-snug text-navy-900">{university.nameBn}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {unit.nameBn && <p className="text-xs text-slate-500">{unit.nameBn}</p>}
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CountdownBadge unit={unit} today={today} />
            </div>

            <dl className="mt-3 grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 pt-3 text-xs">
              <div className="pr-3">
                <dt className="text-slate-400">{texts.examDate}</dt>
                <dd className="font-medium text-slate-700">
                  {formatBanglaDate(unit.examDate) ?? texts.notPublished}
                </dd>
              </div>
              <div className="pl-3">
                <dt className="text-slate-400">{texts.applicationEnd}</dt>
                <dd className="font-medium text-slate-700">
                  {formatBanglaDate(unit.applicationEnd) ?? texts.notPublished}
                </dd>
              </div>
            </dl>
          </Link>
        );
      })}
    </div>
  );
}

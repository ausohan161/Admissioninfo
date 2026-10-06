import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FlatUnitRow } from "@/data/types";
import { getCategoryById } from "@/data/categories";
import { formatBanglaDate, toBanglaNumber } from "@/lib/bangla";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { texts } from "@/lib/texts";

export function AdmissionTable({ rows, today }: { rows: FlatUnitRow[]; today: string }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft sm:block">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs font-bold uppercase tracking-wide text-white">
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.colNo}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.colCategory}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.colUniversity}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.colUnit}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.applicationStart}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.applicationEnd}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.examDate}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3">{texts.colDaysLeft}</th>
            <th className="whitespace-nowrap border border-indigo-500 bg-indigo-700 px-3 py-3 text-right">{texts.details}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ university, unit }, index) => {
            const category = getCategoryById(university.category);
            const theme = getCategoryTheme(university.category);
            return (
              <tr
                key={`${university.id}-${unit.id}`}
                className={`align-top hover:bg-indigo-50/40 ${index % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}
              >
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3 text-base font-extrabold text-slate-600">
                  {toBanglaNumber(index + 1)}
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-bold ${theme.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden />
                    {category?.shortNameBn ?? "—"}
                  </span>
                </td>
                <td className="border border-slate-300 px-3 py-3">
                  <div className="font-semibold text-navy-900">{university.nameBn}</div>
                  <div className="text-sm font-bold text-slate-600">{university.shortName}</div>
                </td>
                <td className="border border-slate-300 px-3 py-3 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span>{unit.nameBn ?? "—"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3 text-slate-600">
                  {formatBanglaDate(unit.applicationStart) ?? texts.notPublished}
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3 text-slate-600">
                  {formatBanglaDate(unit.applicationEnd) ?? texts.notPublished}
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3 text-slate-600">
                  {formatBanglaDate(unit.examDate) ?? texts.notPublished}
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3">
                  <CountdownBadge unit={unit} today={today} />
                </td>
                <td className="whitespace-nowrap border border-slate-300 px-3 py-3 text-right">
                  <Link
                    href={`/university/?id=${university.id}`}
                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {texts.details}
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { University } from "@/data/types";
import { formatBanglaDate } from "@/lib/bangla";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { useToday } from "@/lib/useToday";

export function UniversityCard({ university }: { university: University }) {
  // Computed on the client so the countdown/status stays accurate every day even when
  // this card is rendered on a statically-exported page (its HTML is only refreshed on rebuild).
  const today = useToday();
  const [activeUnitId, setActiveUnitId] = useState(university.units[0]?.id);
  const activeUnit = university.units.find((u) => u.id === activeUnitId) ?? university.units[0];
  const hasNamedUnits = university.units.some((u) => u.nameBn);
  const theme = getCategoryTheme(university.category);

  return (
    <div
      className={`rounded-xl border border-slate-200 border-t-4 bg-white p-4 shadow-soft sm:p-5 ${theme.topBorder}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-snug text-navy-900">
            {university.nameBn}
            <span className="ml-1.5 text-sm font-medium text-slate-400">({university.shortName})</span>
          </h3>
          {university.subGroupBn && <p className="text-xs text-slate-400">{university.subGroupBn}</p>}
        </div>
      </div>

      {hasNamedUnits && university.units.length > 1 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {university.units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setActiveUnitId(unit.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                unit.id === activeUnit?.id
                  ? theme.activePill
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {unit.nameBn}
            </button>
          ))}
        </div>
      )}

      {activeUnit && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="rounded-lg bg-slate-50 px-2 py-2.5">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">আবেদন শুরু</p>
              <p className="mt-0.5 text-xs font-semibold text-navy-800 sm:text-sm">
                {formatBanglaDate(activeUnit.applicationStart) ?? "প্রকাশিত হয়নি"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2.5">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">আবেদন শেষ</p>
              <p className="mt-0.5 text-xs font-semibold text-navy-800 sm:text-sm">
                {formatBanglaDate(activeUnit.applicationEnd) ?? "প্রকাশিত হয়নি"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-2 py-2.5">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">ভর্তি পরীক্ষা</p>
              <p className="mt-0.5 text-xs font-semibold text-navy-800 sm:text-sm">
                {formatBanglaDate(activeUnit.examDate) ?? "প্রকাশিত হয়নি"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge unit={activeUnit} today={today} />
            {activeUnit.examDate && <CountdownBadge unit={activeUnit} today={today} />}
          </div>
        </>
      )}

      <Link
        href={`/university/${university.id}${activeUnit && hasNamedUnits ? `?unit=${activeUnit.id}` : ""}`}
        className={`mt-4 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold text-white shadow-sm transition-colors ${theme.solid}`}
      >
        বিস্তারিত তথ্য দেখুন
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarClock, Armchair, ClipboardCheck, ListChecks, ListOrdered, Calculator, FileText } from "lucide-react";
import { University } from "@/data/types";
import { getCategoryById } from "@/data/categories";
import { formatBanglaDate, toBanglaNumber } from "@/lib/bangla";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { InfoSection } from "./InfoSection";
import { CircularButton } from "./CircularButton";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { useToday } from "@/lib/useToday";

export function UniversityInfoPanel({ university }: { university: University }) {
  // Computed on the client so the countdown/status stays accurate every day even when
  // this panel is rendered on a statically-exported page (its HTML is only refreshed on rebuild).
  const today = useToday();
  // Read directly from the URL on the client (e.g. /university/du/?unit=science) — static
  // export has no server request to read a query string from, so this can't be done server-side.
  const searchParams = useSearchParams();
  const initialUnitId = searchParams.get("unit") ?? undefined;
  const [activeUnitId, setActiveUnitId] = useState(initialUnitId ?? university.units[0]?.id);
  const activeUnit = university.units.find((u) => u.id === activeUnitId) ?? university.units[0];
  const category = getCategoryById(university.category);
  const hasNamedUnits = university.units.some((u) => u.nameBn);
  const theme = getCategoryTheme(university.category);

  if (!activeUnit) return null;

  return (
    <div className={`rounded-xl border border-slate-200 border-t-4 bg-white p-4 shadow-soft sm:p-6 ${theme.topBorder}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {category && (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${theme.badge}`}>
              {category.shortNameBn}
            </span>
          )}
          <h2 className="mt-2 text-xl font-extrabold text-navy-900 sm:text-2xl">{university.nameBn}</h2>
          <p className="text-sm font-medium text-slate-500">{university.nameEn}</p>
        </div>
        <span className="whitespace-nowrap text-sm font-semibold text-slate-500">
          ভর্তি সেশন: {university.admissionSession}
        </span>
      </div>

      {university.introBn && <p className="mt-3 text-base font-medium text-slate-600">{university.introBn}</p>}

      {hasNamedUnits && university.units.length > 1 && (
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {university.units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setActiveUnitId(unit.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold ${
                unit.id === activeUnit.id
                  ? theme.activePill
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {unit.nameBn}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <InfoSection title="গুরুত্বপূর্ণ তারিখ" icon={CalendarClock} isEmpty={false}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <DateBox label="আবেদন শুরু" value={formatBanglaDate(activeUnit.applicationStart)} />
            <DateBox label="আবেদন শেষ" value={formatBanglaDate(activeUnit.applicationEnd)} />
            <DateBox label="ভর্তি পরীক্ষা" value={formatBanglaDate(activeUnit.examDate)} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge unit={activeUnit} today={today} />
            {activeUnit.examDate && <CountdownBadge unit={activeUnit} today={today} />}
          </div>
        </InfoSection>

        <InfoSection title="আসন সংখ্যা" icon={Armchair} isEmpty={!activeUnit.seats}>
          {activeUnit.seats && (
            <div>
              {activeUnit.seats.total !== null && (
                <p className="text-base text-slate-700">
                  মোট আসন: <span className="font-extrabold text-navy-900">{toBanglaNumber(activeUnit.seats.total)}</span>
                </p>
              )}
              {activeUnit.seats.breakdown && activeUnit.seats.breakdown.length > 0 && (
                <ul className="mt-2 divide-y divide-slate-200 text-base font-medium text-slate-600">
                  {activeUnit.seats.breakdown.map((b) => (
                    <li key={b.nameBn} className="flex justify-between py-2">
                      <span>{b.nameBn}</span>
                      <span className="font-bold text-navy-800">{toBanglaNumber(b.count)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </InfoSection>

        <InfoSection
          title="আবেদন যোগ্যতা"
          icon={ClipboardCheck}
          isEmpty={!activeUnit.eligibility?.descriptionBn && !activeUnit.eligibility?.points?.length}
        >
          {activeUnit.eligibility?.descriptionBn && (
            <p className="text-base font-medium leading-relaxed text-slate-700">{activeUnit.eligibility.descriptionBn}</p>
          )}
          {activeUnit.eligibility?.points && activeUnit.eligibility.points.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-base font-medium text-slate-700">
              {activeUnit.eligibility.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </InfoSection>

        <InfoSection title="পরীক্ষার ধরন" icon={ListChecks} isEmpty={!activeUnit.examPattern}>
          <p className="text-base font-medium leading-relaxed text-slate-700">{activeUnit.examPattern}</p>
        </InfoSection>

        <InfoSection title="বিষয় ও প্রশ্নসংখ্যা" icon={ListOrdered} isEmpty={activeUnit.subjects.length === 0}>
          <ul className="divide-y divide-slate-200 text-base font-medium">
            {activeUnit.subjects.map((s) => (
              <li key={s.nameBn} className="flex items-center justify-between gap-3 py-2">
                <span className="text-slate-700">{s.nameBn}</span>
                <span className="shrink-0 font-extrabold text-navy-900">{toBanglaNumber(s.marks)}</span>
              </li>
            ))}
          </ul>
        </InfoSection>

        <InfoSection title="ফলাফল নির্ণয় পদ্ধতি" icon={Calculator} isEmpty={!activeUnit.resultMethod}>
          <p className="text-base font-medium leading-relaxed text-slate-700">{activeUnit.resultMethod}</p>
        </InfoSection>

        <InfoSection title="অফিসিয়াল সার্কুলার" icon={FileText} isEmpty={false}>
          <CircularButton url={activeUnit.circularUrl} solidClassName={theme.solid} />
        </InfoSection>
      </div>
    </div>
  );
}

function DateBox({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-0.5 text-base font-bold text-navy-900">{value ?? "তথ্য প্রকাশিত হয়নি"}</p>
    </div>
  );
}

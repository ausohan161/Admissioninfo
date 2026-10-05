import { Building2, FileClock, AlarmClockCheck, CalendarDays } from "lucide-react";
import { SummaryStats as Stats } from "@/lib/summary";
import { toBanglaNumber } from "@/lib/bangla";
import { texts, TextKey } from "@/lib/texts";

const ITEMS_META = [
  {
    key: "total",
    labelKey: "statTotal",
    icon: Building2,
    tone: "text-indigo-700 bg-indigo-50",
    topBorder: "border-t-indigo-400",
  },
  {
    key: "ongoing",
    labelKey: "statusOngoing",
    icon: FileClock,
    tone: "text-emerald-700 bg-emerald-50",
    topBorder: "border-t-emerald-400",
  },
  {
    key: "upcoming",
    labelKey: "statUpcoming",
    icon: AlarmClockCheck,
    tone: "text-amber-700 bg-amber-50",
    topBorder: "border-t-amber-400",
  },
  {
    key: "thisWeek",
    labelKey: "statThisWeek",
    icon: CalendarDays,
    tone: "text-rose-700 bg-rose-50",
    topBorder: "border-t-rose-400",
  },
] as const;

export function SummaryStatsBar({ stats }: { stats: Stats }) {
  const values: Record<(typeof ITEMS_META)[number]["key"], number> = {
    total: stats.totalInstitutions,
    ongoing: stats.ongoingCount,
    upcoming: stats.upcomingExamCount,
    thisWeek: stats.examsThisWeekCount,
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ITEMS_META.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={`flex items-center gap-3 rounded-xl border border-slate-200 border-t-4 bg-white p-3 shadow-soft sm:p-4 ${item.topBorder}`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-tight text-navy-900 sm:text-xl">
                {toBanglaNumber(values[item.key])}
              </p>
              <p className="truncate text-xs leading-tight text-slate-500 sm:text-xs">{texts[item.labelKey]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

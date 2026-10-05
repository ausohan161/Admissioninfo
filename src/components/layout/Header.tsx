"use client";

import { CalendarClock } from "lucide-react";
import { formatBanglaDate } from "@/lib/bangla";
import { useToday } from "@/lib/useToday";
import { texts } from "@/lib/texts";

export function Header() {
  const today = useToday();
  const formatted = formatBanglaDate(today);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-soft">
            <CalendarClock className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-navy-900 sm:text-xl">
              {texts.appName}
            </h1>
            <p className="text-xs leading-tight text-slate-500 sm:text-sm">
              {texts.appTagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
          <span className="hidden sm:inline">{texts.lastUpdated}</span>
          <span className="font-medium text-slate-500">{formatted ?? "—"}</span>
        </div>
      </div>
    </header>
  );
}

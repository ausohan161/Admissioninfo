"use client";

import { LayoutGrid, BookOpenText, ClipboardCheck } from "lucide-react";
import { texts, TextKey } from "@/lib/texts";

export type MainTabId = "overview" | "info" | "eligibility";

const TABS: {
  id: MainTabId;
  labelKey: TextKey;
  icon: React.ElementType;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    id: "overview",
    labelKey: "tabOverview",
    icon: LayoutGrid,
    activeClass: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-card",
    inactiveClass: "text-indigo-600 hover:bg-indigo-50",
  },
  {
    id: "info",
    labelKey: "tabInfo",
    icon: BookOpenText,
    activeClass: "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-card",
    inactiveClass: "text-teal-600 hover:bg-teal-50",
  },
  {
    id: "eligibility",
    labelKey: "tabEligibility",
    icon: ClipboardCheck,
    activeClass: "bg-purple-600 text-white shadow-card",
    inactiveClass: "text-purple-600 hover:bg-purple-50",
  },
];

export function MainTabs({
  active,
  onChange,
}: {
  active: MainTabId;
  onChange: (tab: MainTabId) => void;
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div
        role="tablist"
        aria-label={texts.mainMenuAria}
        className="mx-auto grid max-w-7xl grid-cols-3 gap-1 px-2 py-2 sm:gap-2 sm:px-6"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-xs font-bold leading-tight transition-all sm:min-h-[64px] sm:flex-row sm:gap-2 sm:text-sm ${
                isActive ? tab.activeClass : tab.inactiveClass
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              <span>{texts[tab.labelKey]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

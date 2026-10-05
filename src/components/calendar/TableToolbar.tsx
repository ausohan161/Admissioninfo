"use client";

import { Search } from "lucide-react";
import { categories } from "@/data/categories";
import { CategoryId } from "@/data/types";
import { StatusFilter } from "@/lib/filters";
import { texts, TextKey } from "@/lib/texts";

const STATUS_OPTIONS: { value: StatusFilter; labelKey: TextKey }[] = [
  { value: "all", labelKey: "statusAll" },
  { value: "ongoing", labelKey: "statusOngoing" },
  { value: "closed", labelKey: "applicationEnd" },
  { value: "upcoming-exam", labelKey: "statusUpcomingExam" },
  { value: "completed", labelKey: "statusCompleted" },
];

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  category: CategoryId | "all";
  onCategoryChange: (v: CategoryId | "all") => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
}

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:py-2 sm:text-sm";

export function TableToolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={texts.searchPlaceholder}
          aria-label={texts.searchAria}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-base text-slate-700 sm:text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          aria-label={texts.categoryFilterAria}
          className={selectClass}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as CategoryId | "all")}
        >
          <option value="all">{texts.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortNameBn}
            </option>
          ))}
        </select>

        <select
          aria-label={texts.statusFilterAria}
          className={selectClass}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {texts[s.labelKey]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

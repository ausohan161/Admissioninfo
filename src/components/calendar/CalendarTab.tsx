"use client";

import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import { universities } from "@/data/universities";
import { CategoryId } from "@/data/types";
import { flattenUnits } from "@/lib/flatten";
import { filterByStatus, searchRows, sortRows, StatusFilter } from "@/lib/filters";
import { computeSummaryStats, getUrgentDeadlines, getUpcomingExams } from "@/lib/summary";
import { useToday } from "@/lib/useToday";
import { SummaryStatsBar } from "./SummaryStats";
import { DeadlineTicker } from "./DeadlineTicker";
import { NoticeTicker } from "./NoticeTicker";
import { UpcomingTests } from "./UpcomingTests";
import { TableToolbar } from "./TableToolbar";
import { AdmissionTable } from "./AdmissionTable";
import { AdmissionMobileList } from "./AdmissionMobileCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { texts } from "@/lib/texts";

export function CalendarTab() {
  const today = useToday();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const allRows = useMemo(() => flattenUnits(universities), []);
  const stats = useMemo(() => computeSummaryStats(universities, allRows, today), [allRows, today]);
  const upcomingExams = useMemo(() => getUpcomingExams(allRows, today, 5), [allRows, today]);
  const urgentDeadlines = useMemo(() => getUrgentDeadlines(allRows, today, 3), [allRows, today]);

  const visibleRows = useMemo(() => {
    let rows = allRows;
    if (category !== "all") rows = rows.filter((r) => r.university.category === category);
    rows = filterByStatus(rows, status, today);
    rows = searchRows(rows, query);
    // Fixed default ordering — soonest exam first — no user-facing sort control.
    rows = sortRows(rows, "nearest-exam", today);
    return rows;
  }, [allRows, category, status, query, today]);

  return (
    <div className="space-y-5" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
      <SummaryStatsBar stats={stats} />

      <DeadlineTicker rows={urgentDeadlines} today={today} />

      <NoticeTicker />

      <UpcomingTests rows={upcomingExams} today={today} />

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-indigo-700 sm:text-base">
          <CalendarRange className="h-4 w-4" />
          {texts.sectionSchedule}
        </h2>
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />

        <div className="mt-4">
          {visibleRows.length === 0 ? (
            <EmptyState
              title={texts.emptyResults}
              description={texts.emptyResultsDesc}
            />
          ) : (
            <>
              <AdmissionTable rows={visibleRows} today={today} />
              <AdmissionMobileList rows={visibleRows} today={today} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

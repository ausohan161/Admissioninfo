import { AlertCircle } from "lucide-react";
import { FlatUnitRow } from "@/data/types";
import { toBanglaNumber } from "@/lib/bangla";
import { computeDeadlineDaysLeft } from "@/lib/status";
import { texts, fillTemplate } from "@/lib/texts";

function buildMessage(row: FlatUnitRow, today: string): string {
  const daysLeft = computeDeadlineDaysLeft(row.unit, today);
  const unitLabel = row.unit.nameBn ? ` — ${row.unit.nameBn}` : "";
  const dayText = daysLeft === 0 ? texts.todayLastDay : fillTemplate(texts.daysLeftTemplate, { n: toBanglaNumber(daysLeft ?? 0) });
  return `${row.university.nameBn}${unitLabel} — ${texts.deadlinePrefix} ${dayText}`;
}

/** Scrolling news-ticker style banner for urgent application deadlines. */
export function DeadlineTicker({ rows, today }: { rows: FlatUnitRow[]; today: string }) {
  if (rows.length === 0) return null;

  const messages = rows.map((row) => buildMessage(row, today));
  // Duplicated once so the track can loop seamlessly from -50% back to 0.
  const track = [...messages, ...messages];
  // Roughly constant scroll speed regardless of how many items are queued.
  const durationSeconds = Math.max(messages.length * 7, 14);

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 shadow-soft">
      <div className="flex shrink-0 items-center gap-2 bg-rose-600 px-3 py-2.5 sm:px-4">
        <AlertCircle className="h-4 w-4 text-white" aria-hidden />
        <span className="whitespace-nowrap text-xs font-bold text-white sm:text-sm">{texts.urgentLabel}</span>
      </div>
      <div className="min-w-0 flex-1 overflow-hidden py-2.5">
        <div
          className="marquee-track flex w-max items-center whitespace-nowrap"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {track.map((message, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-4 text-sm font-medium text-rose-700">
              {message}
              <span className="ml-4 text-rose-300" aria-hidden>
                ●
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

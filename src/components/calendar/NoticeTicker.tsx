import { Megaphone } from "lucide-react";
import { notices } from "@/lib/notices";
import { texts } from "@/lib/texts";

/** Scrolling news-ticker style banner for general site/admission notices —
 * distinct from `DeadlineTicker`, which only shows auto-computed deadline
 * countdowns. Notices come from `lib/notices`, which `content/notices.json` can replace at runtime. */
export function NoticeTicker() {
  if (notices.length === 0) return null;

  // Duplicated once so the track can loop seamlessly from -50% back to 0.
  const track = [...notices, ...notices];
  // Roughly constant scroll speed regardless of how many notices are queued.
  const durationSeconds = Math.max(notices.length * 8, 16);

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-soft">
      <div className="flex shrink-0 items-center gap-2 bg-amber-600 px-3 py-2.5 sm:px-4">
        <Megaphone className="h-4 w-4 text-white" aria-hidden />
        <span className="whitespace-nowrap text-xs font-bold text-white sm:text-sm">{texts.noticeLabel}</span>
      </div>
      <div className="min-w-0 flex-1 overflow-hidden py-2.5">
        <div
          className="marquee-track flex w-max items-center whitespace-nowrap"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {track.map((notice, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-4 text-sm font-medium text-amber-800">
              {notice}
              <span className="ml-4 text-amber-300" aria-hidden>
                ●
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

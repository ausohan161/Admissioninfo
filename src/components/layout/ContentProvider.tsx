"use client";

import { Fragment, useEffect, useState } from "react";
import { applyDateOverrides } from "@/lib/dateOverrides";
import { applyContent } from "@/lib/contentStore";
import { texts } from "@/lib/texts";

async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
  return res.ok ? res.json() : null;
}

/** Loads the server-editable `content.json` (institutions, notices) and then
 * `dates.json` over the built-in data, so both can be edited from cPanel's File
 * Manager without rebuilding. Missing or invalid files fall back silently. */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let changed = false;
      try {
        changed = applyContent(await fetchJson("/content.json")) || changed;
      } catch (err) {
        console.warn("content.json লোড করা যায়নি:", err);
      }
      try {
        const dates = await fetchJson("/dates.json");
        if (dates && typeof dates === "object" && applyDateOverrides(dates as Record<string, unknown>) > 0) {
          changed = true;
        }
      } catch (err) {
        console.warn("dates.json লোড করা যায়নি (JSON ভুল থাকতে পারে):", err);
      }
      document.title = texts.pageTitle;
      // Remount only when something changed, so memoised views recompute from the new data.
      if (!cancelled && changed) setVersion((v) => v + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <Fragment key={version}>{children}</Fragment>;
}

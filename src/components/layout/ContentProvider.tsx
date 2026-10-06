"use client";

import { Fragment, useEffect, useState } from "react";
import { applyContent, ContentFiles } from "@/lib/contentStore";
import { texts } from "@/lib/texts";

const CONTENT_FILES = ["admissions", "info", "eligibility", "notices", "site-texts"] as const;

async function fetchJson(name: string): Promise<unknown> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/content/${name}.json?t=${Date.now()}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.warn(`${name}.json লোড করা যায়নি (JSON ভুল থাকতে পারে):`, err);
    return null;
  }
}

/** Loads the server-editable files in `/content/` (admissions, info, eligibility,
 * notices, site texts) and applies them over the built-in data, so the whole site can
 * be edited from cPanel's File Manager without rebuilding. Missing files fall back silently. */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [admissions, info, eligibility, notices, siteTexts] = await Promise.all(
        CONTENT_FILES.map((name) => fetchJson(name)),
      );
      const files: ContentFiles = { admissions, info, eligibility, notices, texts: siteTexts };
      const changed = applyContent(files);
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

import { universities } from "@/data/universities";
import { University } from "@/data/types";
import { notices } from "@/lib/notices";
import { texts, TextKey } from "@/lib/texts";

function isUniversityLike(value: unknown): value is University {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.nameBn === "string" &&
    typeof u.shortName === "string" &&
    typeof u.category === "string" &&
    Array.isArray(u.units) &&
    u.units.length > 0 &&
    u.units.every((unit) => !!unit && typeof (unit as { id?: unknown }).id === "string")
  );
}

function withUnitDefaults(university: University): University {
  return {
    ...university,
    units: university.units.map((unit) => ({
      ...unit,
      nameBn: unit.nameBn ?? null,
      applicationStart: unit.applicationStart ?? null,
      applicationEnd: unit.applicationEnd ?? null,
      examDate: unit.examDate ?? null,
      seats: unit.seats ?? null,
      eligibility: unit.eligibility ?? null,
      examPattern: unit.examPattern ?? null,
      resultMethod: unit.resultMethod ?? null,
      circularUrl: unit.circularUrl ?? null,
      subjects: unit.subjects ?? [],
      isDemoData: !!unit.isDemoData,
    })),
  };
}

/** Replaces institutions and notices in place from a parsed `content.json`. Malformed
 * entries are rejected whole so a typo can't blank the page; the built-in data stays. */
export function applyContent(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const { universities: incomingUniversities, notices: incomingNotices, texts: incomingTexts } = data as {
    universities?: unknown;
    notices?: unknown;
    texts?: unknown;
  };
  let changed = false;

  if (Array.isArray(incomingUniversities) && incomingUniversities.length > 0) {
    if (incomingUniversities.every(isUniversityLike)) {
      universities.splice(0, universities.length, ...incomingUniversities.map(withUnitDefaults));
      changed = true;
    } else {
      console.warn("content.json: কিছু প্রতিষ্ঠানের ফরম্যাট ভুল — ডিফল্ট তথ্য দেখানো হচ্ছে।");
    }
  }

  if (Array.isArray(incomingNotices) && incomingNotices.every((n) => typeof n === "string")) {
    notices.splice(0, notices.length, ...(incomingNotices as string[]));
    changed = true;
  }

  if (incomingTexts && typeof incomingTexts === "object") {
    for (const key of Object.keys(texts) as TextKey[]) {
      const value = (incomingTexts as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim() !== "") {
        texts[key] = value;
        changed = true;
      }
    }
  }

  return changed;
}

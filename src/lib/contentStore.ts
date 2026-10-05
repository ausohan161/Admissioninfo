import { universities } from "@/data/universities";
import { AdmissionUnit, EligibilityCriteria, University } from "@/data/types";
import { notices } from "@/lib/notices";
import { texts, TextKey } from "@/lib/texts";

/** Snapshot of the built-in institutions, used whenever a server file has no entry for a unit. */
const bundledById = new Map(universities.map((u) => [u.id, u] as const));

interface InfoUnit {
  seats?: AdmissionUnit["seats"];
  eligibility?: AdmissionUnit["eligibility"];
  examPattern?: string | null;
  subjects?: AdmissionUnit["subjects"];
  resultMethod?: string | null;
  circularUrl?: string | null;
}

interface InfoUniversity {
  introBn?: string | null;
  units?: Record<string, InfoUnit>;
}

export interface ContentFiles {
  admissions?: unknown;
  info?: unknown;
  eligibility?: unknown;
  notices?: unknown;
  texts?: unknown;
}

function isAdmissionUniversity(value: unknown): boolean {
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

function buildUniversity(
  raw: Record<string, unknown>,
  info: Record<string, InfoUniversity> | null,
  eligibility: Record<string, Record<string, EligibilityCriteria | null>> | null,
): University {
  const id = raw.id as string;
  const bundled = bundledById.get(id);
  const infoUni = info?.[id];
  const eligUni = eligibility?.[id];
  const rawUnits = raw.units as Array<Record<string, unknown>>;

  const units = rawUnits.map((rawUnit): AdmissionUnit => {
    const unitId = rawUnit.id as string;
    const bundledUnit = bundled?.units.find((x) => x.id === unitId);
    const infoUnit = infoUni?.units?.[unitId];
    const info: InfoUnit = infoUnit ?? (bundledUnit ?? {});

    const criteria =
      eligUni && unitId in eligUni
        ? eligUni[unitId]
        : bundledUnit?.eligibilityCriteria ?? null;

    return {
      id: unitId,
      nameBn: (rawUnit.nameBn as string | null) ?? null,
      applicationStart: (rawUnit.applicationStart as string | null) ?? null,
      applicationEnd: (rawUnit.applicationEnd as string | null) ?? null,
      examDate: (rawUnit.examDate as string | null) ?? null,
      isDemoData: !!rawUnit.isDemoData,
      seats: info.seats ?? null,
      eligibility: info.eligibility ?? null,
      examPattern: info.examPattern ?? null,
      subjects: info.subjects ?? [],
      resultMethod: info.resultMethod ?? null,
      circularUrl: info.circularUrl ?? null,
      eligibilityCriteria: criteria,
    };
  });

  const introSource = infoUni ? infoUni.introBn : bundled?.introBn;
  return {
    id,
    nameBn: raw.nameBn as string,
    nameEn: (raw.nameEn as string) ?? bundled?.nameEn ?? "",
    shortName: raw.shortName as string,
    category: raw.category as University["category"],
    subGroupBn: (raw.subGroupBn as string | null) ?? bundled?.subGroupBn ?? undefined,
    admissionSession: (raw.admissionSession as string) ?? bundled?.admissionSession ?? "",
    introBn: introSource ?? undefined,
    units,
  };
}

/** Applies the server-editable content files. Each file is independent: a missing or
 * malformed file leaves that part on the built-in data. Returns true if anything changed. */
export function applyContent(files: ContentFiles): boolean {
  let changed = false;
  const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

  const admissions = files.admissions;
  if (isObject(admissions) && Array.isArray(admissions.universities) && admissions.universities.length > 0) {
    if (admissions.universities.every(isAdmissionUniversity)) {
      const info = isObject(files.info) ? (files.info as Record<string, InfoUniversity>) : null;
      const eligibility = isObject(files.eligibility)
        ? (files.eligibility as Record<string, Record<string, EligibilityCriteria | null>>)
        : null;
      const merged = (admissions.universities as Record<string, unknown>[]).map((u) =>
        buildUniversity(u, info, eligibility),
      );
      universities.splice(0, universities.length, ...merged);
      changed = true;
    } else {
      console.warn("admissions.json: কিছু প্রতিষ্ঠানের ফরম্যাট ভুল — ডিফল্ট তথ্য দেখানো হচ্ছে।");
    }
  }

  const noticeList = Array.isArray(files.notices)
    ? files.notices
    : (files.notices as { notices?: unknown } | undefined)?.notices;
  if (Array.isArray(noticeList) && noticeList.every((n) => typeof n === "string")) {
    notices.splice(0, notices.length, ...(noticeList as string[]));
    changed = true;
  }

  if (isObject(files.texts)) {
    for (const key of Object.keys(texts) as TextKey[]) {
      const value = files.texts[key];
      if (typeof value === "string" && value.trim() !== "") {
        texts[key] = value;
        changed = true;
      }
    }
  }

  return changed;
}

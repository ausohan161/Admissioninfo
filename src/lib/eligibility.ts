import { AdmissionUnit, EligibilityCriteria, FlatUnitRow, StudentGroup, University } from "@/data/types";

/** The fixed set of subjects the checker form asks for — matches every
 * `subjectBn` value used across `eligibilityCriteria` in the dataset. */
export const CHECKER_SUBJECTS = ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "ইংরেজি"] as const;
export type CheckerSubject = (typeof CHECKER_SUBJECTS)[number];

export interface EligibilityInput {
  group: StudentGroup;
  sscGpa: number;
  hscGpa: number;
  /** Only the subjects the student filled in; missing ones are treated as unknown, not zero. */
  subjectGpas: Partial<Record<CheckerSubject, number>>;
  /** Collected because most real circulars restrict eligibility to specific passing-year
   * batches — but no official per-university passing-year window has been published for
   * this admission cycle yet, so these are NOT used to filter results below. Once that
   * data is added to `EligibilityCriteria`, wire it in here instead of ignoring it. */
  sscYear: number;
  hscYear: number;
}

/** Whether a single unit's criteria are satisfied by the given input.
 * Conservative by design: a subject requirement the student left blank
 * counts as not-yet-confirmed (fails), never as an assumed pass. */
export function isEligibleForUnit(criteria: EligibilityCriteria, input: EligibilityInput): boolean {
  if (criteria.group !== "any" && criteria.group !== input.group) return false;
  if (criteria.minSscGpa != null && input.sscGpa < criteria.minSscGpa) return false;
  if (criteria.minHscGpa != null && input.hscGpa < criteria.minHscGpa) return false;
  if (criteria.minCombinedGpa != null && input.sscGpa + input.hscGpa < criteria.minCombinedGpa) return false;

  for (const req of criteria.subjectMinimums ?? []) {
    const value = input.subjectGpas[req.subjectBn as CheckerSubject];
    if (value == null || value < req.minGpa) return false;
  }

  if (criteria.subjectGroupMinTotal) {
    const { subjectsBn, minTotal } = criteria.subjectGroupMinTotal;
    let total = 0;
    for (const subject of subjectsBn) {
      const value = input.subjectGpas[subject as CheckerSubject];
      if (value == null) return false;
      total += value;
    }
    if (total < minTotal) return false;
  }

  return true;
}

export interface EligibleUnitRow extends FlatUnitRow {
  criteria: EligibilityCriteria;
}

/** All (university, unit) pairs the student is eligible for, across every institution. */
export function findEligibleUnits(universities: University[], input: EligibilityInput): EligibleUnitRow[] {
  const results: EligibleUnitRow[] = [];
  for (const university of universities) {
    for (const unit of university.units) {
      const criteria = unit.eligibilityCriteria;
      if (!criteria) continue;
      if (isEligibleForUnit(criteria, input)) {
        results.push({ university, unit, criteria });
      }
    }
  }
  return results;
}

/** How many units in the dataset even have structured criteria to check against —
 * used to caveat results ("N প্রতিষ্ঠানের তথ্য এখনো যোগ হয়নি") rather than silently
 * treating "no criteria" the same as "checked and ineligible". */
export function countUnitsWithoutCriteria(universities: University[]): number {
  let count = 0;
  for (const university of universities) {
    for (const unit of university.units) {
      if (!unit.eligibilityCriteria) count++;
    }
  }
  return count;
}

export function formatCriteriaSummary(criteria: EligibilityCriteria, unit: AdmissionUnit): string[] {
  const lines: string[] = [];
  if (criteria.minSscGpa != null) lines.push(`SSC জিপিএ ≥ ${criteria.minSscGpa}`);
  if (criteria.minHscGpa != null) lines.push(`HSC জিপিএ ≥ ${criteria.minHscGpa}`);
  if (criteria.minCombinedGpa != null) lines.push(`মোট (SSC+HSC) জিপিএ ≥ ${criteria.minCombinedGpa}`);
  for (const req of criteria.subjectMinimums ?? []) {
    lines.push(`${req.subjectBn} জিপিএ ≥ ${req.minGpa}`);
  }
  if (criteria.subjectGroupMinTotal) {
    lines.push(`${criteria.subjectGroupMinTotal.subjectsBn.join(" + ")} মিলিয়ে ≥ ${criteria.subjectGroupMinTotal.minTotal}`);
  }
  return lines;
}

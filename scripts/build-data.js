// Aggregates the per-university JSON files (edited by the CMS, one file per
// institution) in src/data/universities/ into a single generated JSON array
// that the app imports normally. Runs automatically before `next dev` and
// `next build` via the "predev"/"prebuild" npm lifecycle hooks — never edit
// universities.generated.json by hand, it is overwritten every run.
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "src", "data", "universities");
const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "universities.generated.json");

function normalizeStringOrNull(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeSeats(seats) {
  if (!seats) return null;
  const total = typeof seats.total === "number" ? seats.total : null;
  const breakdown = Array.isArray(seats.breakdown)
    ? seats.breakdown
        .filter((b) => b && normalizeStringOrNull(b.nameBn))
        .map((b) => ({ nameBn: b.nameBn.trim(), count: typeof b.count === "number" ? b.count : 0 }))
    : [];
  if (total === null && breakdown.length === 0) return null;
  return { total, breakdown };
}

function normalizeEligibility(eligibility) {
  if (!eligibility) return null;
  const descriptionBn = normalizeStringOrNull(eligibility.descriptionBn);
  const points = Array.isArray(eligibility.points)
    ? eligibility.points
        .map((p) => (typeof p === "string" ? p : p && p.point))
        .filter((p) => normalizeStringOrNull(p))
        .map((p) => p.trim())
    : [];
  if (!descriptionBn && points.length === 0) return null;
  return { descriptionBn, points };
}

function normalizeEligibilityCriteria(criteria) {
  if (!criteria) return null;
  const group = ["science", "commerce", "arts", "any"].includes(criteria.group) ? criteria.group : "any";
  const subjectMinimums = Array.isArray(criteria.subjectMinimums)
    ? criteria.subjectMinimums
        .filter((s) => s && normalizeStringOrNull(s.subjectBn) && typeof s.minGpa === "number")
        .map((s) => ({ subjectBn: s.subjectBn.trim(), minGpa: s.minGpa }))
    : [];
  const g = criteria.subjectGroupMinTotal;
  const subjectGroupMinTotal =
    g && Array.isArray(g.subjectsBn) && g.subjectsBn.length > 0 && typeof g.minTotal === "number"
      ? { subjectsBn: g.subjectsBn.map((s) => String(s).trim()), minTotal: g.minTotal }
      : null;
  return {
    group,
    minSscGpa: typeof criteria.minSscGpa === "number" ? criteria.minSscGpa : null,
    minHscGpa: typeof criteria.minHscGpa === "number" ? criteria.minHscGpa : null,
    minCombinedGpa: typeof criteria.minCombinedGpa === "number" ? criteria.minCombinedGpa : null,
    subjectMinimums,
    subjectGroupMinTotal,
    noteBn: normalizeStringOrNull(criteria.noteBn),
  };
}

function normalizeUnit(unit) {
  return {
    id: unit.id,
    nameBn: normalizeStringOrNull(unit.nameBn),
    applicationStart: normalizeStringOrNull(unit.applicationStart),
    applicationEnd: normalizeStringOrNull(unit.applicationEnd),
    examDate: normalizeStringOrNull(unit.examDate),
    isDemoData: !!unit.isDemoData,
    seats: normalizeSeats(unit.seats),
    eligibility: normalizeEligibility(unit.eligibility),
    eligibilityCriteria: normalizeEligibilityCriteria(unit.eligibilityCriteria),
    examPattern: normalizeStringOrNull(unit.examPattern),
    subjects: Array.isArray(unit.subjects)
      ? unit.subjects
          .filter((s) => s && normalizeStringOrNull(s.nameBn))
          .map((s) => ({ nameBn: s.nameBn.trim(), marks: typeof s.marks === "number" ? s.marks : 0 }))
      : [],
    resultMethod: normalizeStringOrNull(unit.resultMethod),
    circularUrl: normalizeStringOrNull(unit.circularUrl),
  };
}

function normalizeUniversity(uni) {
  return {
    id: uni.id,
    nameBn: uni.nameBn,
    nameEn: uni.nameEn,
    shortName: uni.shortName,
    category: uni.category,
    subGroupBn: normalizeStringOrNull(uni.subGroupBn) || undefined,
    admissionSession: uni.admissionSession,
    introBn: normalizeStringOrNull(uni.introBn) || undefined,
    units: Array.isArray(uni.units) && uni.units.length > 0
      ? uni.units.map(normalizeUnit)
      : [normalizeUnit({ id: "default" })],
  };
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Universities source directory not found: ${SOURCE_DIR}`);
  }

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const universities = files.map((file) => {
    const fullPath = path.join(SOURCE_DIR, file);
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (err) {
      throw new Error(`Invalid JSON in ${file}: ${err.message}`);
    }
    if (!parsed.id) throw new Error(`${file} is missing required field "id"`);
    if (path.basename(file, ".json") !== parsed.id) {
      throw new Error(`${file}: filename must match the "id" field ("${parsed.id}")`);
    }
    return normalizeUniversity(parsed);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(universities, null, 2) + "\n", "utf8");
  console.log(`✓ Generated ${OUTPUT_FILE} from ${files.length} university file(s).`);

  syncDatesFile(universities);
  writeContentFile(universities);
}

// public/content.json is the server-editable copy of institutions and notices.
// It is always rewritten here from the source files; the site prefers it at
// runtime when present, so cPanel edits to it take effect without a rebuild.
function writeContentFile(universities) {
  const noticesFile = path.join(__dirname, "..", "src", "data", "notices.json");
  const notices = JSON.parse(fs.readFileSync(noticesFile, "utf8")).notices;
  const contentFile = path.join(__dirname, "..", "public", "content.json");
  const textsFile = path.join(__dirname, "..", "src", "data", "texts.json");
  const texts = JSON.parse(fs.readFileSync(textsFile, "utf8"));
  fs.writeFileSync(contentFile, JSON.stringify({ universities, notices, texts }, null, 2) + "\n", "utf8");
  console.log(`✓ Wrote ${contentFile}`);
}

// public/dates.json is the file the site owner edits directly on the server
// (cPanel / hPanel File Manager) to change dates without rebuilding. This only
// ADDS missing units and refreshes the human-readable labels; any date value
// already present is preserved so local edits are never overwritten.
function syncDatesFile(universities) {
  const datesFile = path.join(__dirname, "..", "public", "dates.json");
  let existing = {};
  if (fs.existsSync(datesFile)) {
    try {
      existing = JSON.parse(fs.readFileSync(datesFile, "utf8"));
    } catch (err) {
      console.warn(`! public/dates.json is not valid JSON, leaving it untouched: ${err.message}`);
      return;
    }
  }

  const out = {
    _নির্দেশনা:
      'প্রতিটি ইউনিটের তারিখ YYYY-MM-DD ফরম্যাটে লিখুন (যেমন 2026-03-15)। ফাঁকা "" বা null রাখলে সাইটের মূল তারিখই থাকবে। শুধু তারিখের মান বদলান — নাম/কী (key) বদলাবেন না।',
  };
  for (const uni of universities) {
    for (const unit of uni.units) {
      const key = `${uni.id}/${unit.id}`;
      const prev = existing[key] || {};
      out[key] = {
        _নাম: unit.nameBn ? `${uni.nameBn} — ${unit.nameBn}` : uni.nameBn,
        applicationStart: prev.applicationStart !== undefined ? prev.applicationStart : unit.applicationStart,
        applicationEnd: prev.applicationEnd !== undefined ? prev.applicationEnd : unit.applicationEnd,
        examDate: prev.examDate !== undefined ? prev.examDate : unit.examDate,
      };
    }
  }
  fs.writeFileSync(datesFile, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`✓ Synced ${datesFile}`);
}

main();

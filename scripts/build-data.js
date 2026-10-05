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

  writeContentFolder(universities);
}

// public/content/ holds every server-editable file. The site fetches them at
// runtime, so cPanel edits take effect without a rebuild. Each file is written
// here from the source data; the deploy workflow keeps them off the deploy branch.
function writeContentFolder(universities) {
  const outDir = path.join(__dirname, "..", "public", "content");
  fs.mkdirSync(outDir, { recursive: true });
  const write = (name, data) => {
    fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`✓ Wrote public/content/${name}`);
  };

  write("admissions.json", {
    universities: universities.map((u) => ({
      id: u.id,
      nameBn: u.nameBn,
      nameEn: u.nameEn,
      shortName: u.shortName,
      category: u.category,
      subGroupBn: u.subGroupBn ?? null,
      admissionSession: u.admissionSession,
      units: u.units.map((unit) => ({
        id: unit.id,
        nameBn: unit.nameBn,
        applicationStart: unit.applicationStart,
        applicationEnd: unit.applicationEnd,
        examDate: unit.examDate,
        isDemoData: unit.isDemoData,
      })),
    })),
  });

  const info = {};
  const eligibility = {};
  for (const u of universities) {
    info[u.id] = {
      introBn: u.introBn ?? null,
      units: {},
    };
    for (const unit of u.units) {
      info[u.id].units[unit.id] = {
        seats: unit.seats,
        eligibility: unit.eligibility,
        examPattern: unit.examPattern,
        subjects: unit.subjects,
        resultMethod: unit.resultMethod,
        circularUrl: unit.circularUrl,
      };
      if (unit.eligibilityCriteria) {
        eligibility[u.id] = eligibility[u.id] || {};
        eligibility[u.id][unit.id] = unit.eligibilityCriteria;
      }
    }
  }
  write("info.json", info);
  write("eligibility.json", eligibility);

  const noticesSource = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "data", "notices.json"), "utf8"));
  write("notices.json", noticesSource);

  const textsSource = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "data", "texts.json"), "utf8"));
  write("site-texts.json", textsSource);
}

main();

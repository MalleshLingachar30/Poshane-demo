// What happens to land a department gives us.
//
// A departmental offer is a proposal, not a parcel. It carries an OFFER REFERENCE
// from the moment it is submitted, and it earns a LOCATION ID only after a
// verification officer has walked the boundary, the geometry has cleared the gate,
// and a custodian has been assigned. The two identifiers are deliberately distinct:
// if a Location ID appeared at intake, the approval gate would be decorative.

export type OfferState =
  | "submitted"      // 1  Identified — recorded, nothing checked
  | "queued"         // 3  Pending verification — waiting for a cadre officer
  | "assigned"       // 4  Under verification — officer allocated
  | "rejected"       // 5a Rejected, with a structured reason
  | "verified"       // 5b Verified, custodian not yet assigned
  | "approved";      // 7  Approved — custody assigned, Location ID issued

export type Found = {
  offered?: string;
  vegetation?: string;
  encroach?: string;
  dispute?: string;
  access?: string;
  water?: string;
  notesEn?: string;
  notesKn?: string;
};

/**
 * The boundary walk itself. Until this exists there is no polygon, and without a
 * polygon the overlap gate and the area reconciliation have nothing to run on.
 * The raw track is written once and never edited; the working polygon is the
 * simplified version every later check uses. Schematic G2.
 */
export type WalkMode = "ring" | "line";

export type Walk = {
  mode: WalkMode;
  points: [number, number][];   // [lng, lat] in walk order; closed for a ring
  vertexCount: number;          // raw vertices before simplification
  gpsAccuracyM: number;
  deviceId: string;
  startedAt: string;
  endedAt: string;
  perimeterM: number;
  areaHa: number;               // ring mode: computed from the ring, never typed
  lengthKm: number;             // line mode: computed from the trace
  widthM: number;               // line mode: the planted strip width, declared
  centroid: [number, number];
  geomVersion: number;          // increments if a boundary is ever re-walked
  simplifyToleranceM: number;
};

export type Gate = {
  validGeometry: boolean;
  vertices: number;
  walkedHa: number;
  rtcHa: number;
  overlapPct: number;
  overlapWith?: string;
};

/** What the officer recorded on site. A separate record, entered separately. */
/**
 * Karnataka's ten agro-climatic zones. The species plan for a parcel is driven
 * from the zone plus what the officer found in the soil, not from what the
 * department wrote on a form — which is why these fields are collected here and
 * not at intake.
 *
 * The species lists below are illustrative for the demonstration. In production
 * the species master is issued by the Forest Department and IAFT, and the
 * platform reads it as reference data (Layer 5) rather than holding opinions of
 * its own.
 */
export const ZONES: { key: string; en: string; kn: string }[] = [
  { key: "necoast", en: "Coastal Zone", kn: "ಕರಾವಳಿ ವಲಯ" },
  { key: "hilly", en: "Hilly Zone", kn: "ಗುಡ್ಡಗಾಡು ವಲಯ" },
  { key: "sthtrans", en: "Southern Transition Zone", kn: "ದಕ್ಷಿಣ ಪರಿವರ್ತನ ವಲಯ" },
  { key: "nthtrans", en: "Northern Transition Zone", kn: "ಉತ್ತರ ಪರಿವರ್ತನ ವಲಯ" },
  { key: "sthdry", en: "Southern Dry Zone", kn: "ದಕ್ಷಿಣ ಒಣ ವಲಯ" },
  { key: "eastdry", en: "Eastern Dry Zone", kn: "ಪೂರ್ವ ಒಣ ವಲಯ" },
  { key: "centdry", en: "Central Dry Zone", kn: "ಮಧ್ಯ ಒಣ ವಲಯ" },
  { key: "nthdry", en: "Northern Dry Zone", kn: "ಉತ್ತರ ಒಣ ವಲಯ" },
  { key: "nedry", en: "North Eastern Dry Zone", kn: "ಈಶಾನ್ಯ ಒಣ ವಲಯ" },
  { key: "netrans", en: "North Eastern Transition Zone", kn: "ಈಶಾನ್ಯ ಪರಿವರ್ತನ ವಲಯ" },
];

export const SOILS: { key: string; en: string; kn: string }[] = [
  { key: "redloam", en: "Red loamy", kn: "ಕೆಂಪು ಜೇಡಿ ಮಣ್ಣು" },
  { key: "redsandy", en: "Red sandy", kn: "ಕೆಂಪು ಮರಳು ಮಣ್ಣು" },
  { key: "blackdeep", en: "Black cotton — deep", kn: "ಎರೆ ಮಣ್ಣು — ಆಳ" },
  { key: "blackshallow", en: "Black cotton — shallow", kn: "ಎರೆ ಮಣ್ಣು — ತೆಳು" },
  { key: "laterite", en: "Lateritic", kn: "ಜಂಬಿಟ್ಟಿಗೆ ಮಣ್ಣು" },
  { key: "alluvial", en: "Alluvial", kn: "ಮೆಕ್ಕಲು ಮಣ್ಣು" },
  { key: "gravel", en: "Gravelly / murram", kn: "ಜಲ್ಲಿ / ಮುರಂ" },
  { key: "saline", en: "Saline or alkaline", kn: "ಲವಣಯುಕ್ತ / ಕ್ಷಾರೀಯ" },
];

export const DEPTHS: { key: string; en: string; kn: string }[] = [
  { key: "shallow", en: "Shallow — under 30 cm", kn: "ತೆಳು — 30 ಸೆಂ.ಮೀ ಒಳಗೆ" },
  { key: "medium", en: "Medium — 30 to 75 cm", kn: "ಮಧ್ಯಮ — 30 ರಿಂದ 75 ಸೆಂ.ಮೀ" },
  { key: "deep", en: "Deep — over 75 cm", kn: "ಆಳ — 75 ಸೆಂ.ಮೀ ಮೇಲೆ" },
];

export const SLOPES: { key: string; en: string; kn: string }[] = [
  { key: "level", en: "Level — under 3%", kn: "ಸಮತಟ್ಟು — 3% ಒಳಗೆ" },
  { key: "gentle", en: "Gentle — 3 to 8%", kn: "ಸೌಮ್ಯ — 3 ರಿಂದ 8%" },
  { key: "moderate", en: "Moderate — 8 to 15%", kn: "ಮಧ್ಯಮ — 8 ರಿಂದ 15%" },
  { key: "steep", en: "Steep — over 15%", kn: "ಕಡಿದಾದ — 15% ಮೇಲೆ" },
];

export const DRAINAGE: { key: string; en: string; kn: string }[] = [
  { key: "well", en: "Well drained", kn: "ಉತ್ತಮ ಬಸಿತ" },
  { key: "moderate", en: "Moderately drained", kn: "ಮಧ್ಯಮ ಬಸಿತ" },
  { key: "poor", en: "Poorly drained — waterlogs", kn: "ಕಳಪೆ ಬಸಿತ — ನೀರು ನಿಲ್ಲುತ್ತದೆ" },
];

/** Illustrative species sets. Production reads the Forest Department master. */
const SPECIES: Record<string, string[]> = {
  centdry: ["Honge (Pongamia pinnata)", "Bevu / Neem (Azadirachta indica)", "Hunase / Tamarind (Tamarindus indica)", "Nerale / Jamun (Syzygium cumini)", "Bilwara (Acacia leucophloea)"],
  eastdry: ["Honge (Pongamia pinnata)", "Bevu / Neem (Azadirachta indica)", "Hunase / Tamarind (Tamarindus indica)", "Nelli / Amla (Phyllanthus emblica)"],
  sthdry:  ["Honge (Pongamia pinnata)", "Bevu / Neem (Azadirachta indica)", "Srigandha / Sandalwood (Santalum album)", "Nerale / Jamun (Syzygium cumini)"],
  nthdry:  ["Bevu / Neem (Azadirachta indica)", "Hunase / Tamarind (Tamarindus indica)", "Jali (Acacia nilotica)", "Bilwara (Acacia leucophloea)"],
  nedry:   ["Bevu / Neem (Azadirachta indica)", "Jali (Acacia nilotica)", "Hunase / Tamarind (Tamarindus indica)"],
  netrans: ["Nerale / Jamun (Syzygium cumini)", "Honge (Pongamia pinnata)", "Bevu / Neem (Azadirachta indica)"],
  nthtrans:["Nerale / Jamun (Syzygium cumini)", "Honge (Pongamia pinnata)", "Beete / Rosewood (Dalbergia latifolia)"],
  sthtrans:["Srigandha / Sandalwood (Santalum album)", "Nerale / Jamun (Syzygium cumini)", "Beete / Rosewood (Dalbergia latifolia)", "Halasu / Jackfruit (Artocarpus heterophyllus)"],
  hilly:   ["Halasu / Jackfruit (Artocarpus heterophyllus)", "Beete / Rosewood (Dalbergia latifolia)", "Bamboo (Bambusa bambos)"],
  necoast: ["Halasu / Jackfruit (Artocarpus heterophyllus)", "Bamboo (Bambusa bambos)", "Nerale / Jamun (Syzygium cumini)"],
};

export type SitePlan = {
  species: string[];
  excluded: { name: string; reasonEn: string; reasonKn: string }[];
  spacing: string;
  pit: string;
  perHa: number;
};

/**
 * Derives a site plan from what the officer recorded. Advisory only — it
 * proposes; a human confirms. Nothing here alters a record of fact.
 */
export function sitePlan(zone: string, soil: string, depth: string, slope: string, drainage: string): SitePlan {
  const base = SPECIES[zone] ?? [];
  const excluded: SitePlan["excluded"] = [];
  let species = [...base];

  if (soil === "saline") {
    species = species.filter((s) => /Neem|Jali|Acacia/.test(s));
    excluded.push({ name: "moisture-demanding species", reasonEn: "saline or alkaline soil", reasonKn: "ಲವಣಯುಕ್ತ ಅಥವಾ ಕ್ಷಾರೀಯ ಮಣ್ಣು" });
  }
  if (depth === "shallow") {
    const deepRooted = species.filter((s) => /Rosewood|Jackfruit|Jamun/.test(s));
    species = species.filter((s) => !deepRooted.includes(s));
    deepRooted.forEach((n) => excluded.push({ name: n, reasonEn: "soil under 30 cm deep", reasonKn: "30 ಸೆಂ.ಮೀ ಗಿಂತ ತೆಳು ಮಣ್ಣು" }));
  }
  if (drainage === "poor") {
    const dry = species.filter((s) => /Sandalwood|Acacia|Jali/.test(s));
    species = species.filter((s) => !dry.includes(s));
    dry.forEach((n) => excluded.push({ name: n, reasonEn: "waterlogging", reasonKn: "ನೀರು ನಿಲ್ಲುವಿಕೆ" }));
  }

  const steep = slope === "steep";
  const spacing = steep ? "3 m × 3 m along the contour" : depth === "shallow" ? "3 m × 3 m" : "4 m × 4 m";
  const perHa = steep ? 1100 : depth === "shallow" ? 1100 : 625;
  const pit = depth === "shallow" ? "45 × 45 × 45 cm" : "60 × 60 × 60 cm";

  return { species, excluded, spacing, pit, perHa };
}

export type Verification = {
  ref: string;            // the offer it verifies
  officerKey: string;
  officerEn: string;
  officerKn: string;
  visitedOn: string;
  offered: string;        // area actually walked
  vegetation: string;
  water: string;
  access: string;
  encroach: string;
  dispute: string;
  terrain: string;
  zone?: string;
  soil?: string;
  depth?: string;
  slope?: string;
  drainage?: string;
  waterDistance?: string;
  addressEn?: string;
  landTypeConfirmed?: string;
  notesEn: string;
  notesKn: string;
  walk?: Walk;
  gate: Gate;
  decision: "verified" | "rejected";
  rejectionEn?: string;
  rejectionKn?: string;
  custodyEn?: string;
  custodyKn?: string;
  locationId?: string;
  issuedOn?: string;
  isNew?: boolean;
};

export type Offer = {
  ref: string;
  submittedOn: string;
  deptEn: string;
  deptKn: string;
  submitterEn: string;
  submitterKn: string;
  district: string;
  districtKn: string;
  taluk: string;
  talukKn: string;
  hobli: string;
  village: string;
  survey: string;
  category: string;
  categoryKn: string;
  rtc: number;
  offered: number;
  lat: number;
  lng: number;
  terrain: string;
  vegetation: string;
  water: string;
  access: string;
  encroach: string;
  dispute: string;
  custodianProposed: string;
  season: string;
  state: OfferState;
  rejectCount?: number;
  isNew?: boolean;
};

/** The verification cadre — two retired officers per taluk, per §7.3. */
export const CADRE: { key: string; en: string; kn: string; district: string; taluk: string }[] = [
  { key: "hsd-1", en: "S. Rangappa, RFO (retd)", kn: "ಎಸ್. ರಂಗಪ್ಪ, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Hosadurga" },
  { key: "hsd-2", en: "B. Manjunath, DRFO (retd)", kn: "ಬಿ. ಮಂಜುನಾಥ್, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Hosadurga" },
  { key: "clk-1", en: "H. Thippeswamy, RFO (retd)", kn: "ಎಚ್. ತಿಪ್ಪೇಸ್ವಾಮಿ, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Challakere" },
  { key: "clk-2", en: "G. Sharadamma, DRFO (retd)", kn: "ಜಿ. ಶಾರದಮ್ಮ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Challakere" },
  { key: "sir-1", en: "M. Latha, RFO (retd)", kn: "ಎಂ. ಲತಾ, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Tumakuru", taluk: "Sira" },
  { key: "sir-2", en: "K. Devaraju, DRFO (retd)", kn: "ಕೆ. ದೇವರಾಜು, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Tumakuru", taluk: "Sira" },
  { key: "svd-1", en: "R. Patil, RFO (retd)", kn: "ಆರ್. ಪಾಟೀಲ್, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Belagavi", taluk: "Savadatti" },
  { key: "svd-2", en: "S. Kulkarni, DRFO (retd)", kn: "ಎಸ್. ಕುಲಕರ್ಣಿ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Belagavi", taluk: "Savadatti" },
];

export const STATE_LABEL: Record<OfferState, { en: string; kn: string; step: number }> = {
  submitted: { en: "Submitted", kn: "ಸಲ್ಲಿಕೆಯಾಗಿದೆ", step: 1 },
  queued:    { en: "Awaiting verification", kn: "ಪರಿಶೀಲನೆಗೆ ಕಾಯುತ್ತಿದೆ", step: 2 },
  assigned:  { en: "Officer assigned", kn: "ಅಧಿಕಾರಿ ನಿಯೋಜನೆ", step: 3 },
  rejected:  { en: "Not accepted", kn: "ಸ್ವೀಕರಿಸಿಲ್ಲ", step: 4 },
  verified:  { en: "Verified — custody pending", kn: "ಪರಿಶೀಲಿತ — ಪಾಲನೆ ಬಾಕಿ", step: 4 },
  approved:  { en: "Approved — Location ID issued", kn: "ಅನುಮೋದಿತ — ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗಿದೆ", step: 5 },
};

export const JOURNEY: { en: string; kn: string }[] = [
  { en: "Department submits", kn: "ಇಲಾಖೆ ಸಲ್ಲಿಸುತ್ತದೆ" },
  { en: "Enters the queue", kn: "ಸರತಿಗೆ ಸೇರುತ್ತದೆ" },
  { en: "Officer assigned", kn: "ಅಧಿಕಾರಿ ನಿಯೋಜನೆ" },
  { en: "Boundary walked, gate run", kn: "ಗಡಿ ನಡೆದು, ಪರಿಶೀಲನೆ" },
  { en: "Custody assigned, Location ID issued", kn: "ಪಾಲನೆ ನಿಗದಿ, ಲೊಕೇಶನ್ ಐಡಿ" },
];

const D = {
  ctd: ["Chitradurga", "ಚಿತ್ರದುರ್ಗ"],
  tum: ["Tumakuru", "ತುಮಕೂರು"],
  blg: ["Belagavi", "ಬೆಳಗಾವಿ"],
} as const;

const T = {
  hsd: ["Hosadurga", "ಹೊಸದುರ್ಗ", "Janakal", "Banasihalli"],
  clk: ["Challakere", "ಚಳ್ಳಕೆರೆ", "Parashurampura", "Siddeswaranadurga"],
  sir: ["Sira", "ಸಿರಾ", "Kallambella", "Seebi Agrahara"],
  svd: ["Savadatti", "ಸವದತ್ತಿ", "Kitada", "Akkisagara"],
} as const;

const DEPT = {
  forest: ["Karnataka Forest Department", "ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ"],
  revenue: ["Revenue Department", "ಕಂದಾಯ ಇಲಾಖೆ"],
  mi: ["Minor Irrigation Department", "ಸಣ್ಣ ನೀರಾವರಿ ಇಲಾಖೆ"],
  pwd: ["Public Works Department", "ಲೋಕೋಪಯೋಗಿ ಇಲಾಖೆ"],
  gp: ["Gram Panchayat", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ"],
  edu: ["Education Department", "ಶಿಕ್ಷಣ ಇಲಾಖೆ"],
  health: ["Health Department", "ಆರೋಗ್ಯ ಇಲಾಖೆ"],
} as const;

const CAT = {
  waste: ["Revenue wasteland (Bane/Banjar)", "ಕಂದಾಯ ಬಂಜರು ಭೂಮಿ"],
  gomala: ["Gomala / grazing land", "ಗೋಮಾಳ / ಮೇವಿನ ಭೂಮಿ"],
  degraded: ["Forest land - degraded", "ಅರಣ್ಯ ಭೂಮಿ - ಕ್ಷೀಣಿಸಿದ"],
  blank: ["Forest land - blank area", "ಅರಣ್ಯ ಭೂಮಿ - ಖಾಲಿ ಪ್ರದೇಶ"],
  tank: ["Tank foreshore / bund", "ಕೆರೆ ಅಂಗಳ / ಏರಿ"],
  canal: ["Canal bank", "ಕಾಲುವೆ ದಂಡೆ"],
  road: ["Roadside / avenue strip", "ರಸ್ತೆ ಬದಿ"],
  campus: ["Institutional campus (school, hospital, office)", "ಸಂಸ್ಥೆಯ ಆವರಣ"],
  pty: ["Panchayat land", "ಪಂಚಾಯಿತಿ ಭೂಮಿ"],
} as const;

type Seed = {
  n: number;
  t: keyof typeof T;
  d: keyof typeof D;
  dept: keyof typeof DEPT;
  sub: [string, string];
  cat: keyof typeof CAT;
  survey: string;
  rtc: number;
  offered: number;
  veg: string;
  water: string;
  access: string;
  enc: string;
  disp: string;
  terrain: string;
  state: OfferState;
  cadre?: string;
  found?: Found;
  gate?: Gate;
  rej?: [string, string];
  rejectCount?: number;
  custody?: [string, string];
  loc?: string;
  day: string;
};

const S: Seed[] = [
  // ---- Chitradurga / Hosadurga --------------------------------------------
  { n: 41, t: "hsd", d: "ctd", dept: "forest", sub: ["Deputy Conservator of Forests, Chitradurga", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಚಿತ್ರದುರ್ಗ"], cat: "degraded", survey: "142/3", rtc: 3.20, offered: 3.20, veg: "Scattered scrub", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Gently undulating", state: "approved", cadre: "hsd-1", day: "2 Jun 2026",
    found: { offered: "2.85", vegetation: "Scattered scrub", encroach: "No", dispute: "No", notesEn: "North-east corner falls away to a nala; excluded from the walk.", notesKn: "ಈಶಾನ್ಯ ಮೂಲೆ ಹಳ್ಳಕ್ಕೆ ಇಳಿಯುತ್ತದೆ; ನಡಿಗೆಯಿಂದ ಹೊರಗಿಡಲಾಗಿದೆ." },
    gate: { validGeometry: true, vertices: 214, walkedHa: 2.85, rtcHa: 3.20, overlapPct: 1.4, overlapWith: "KA-CTD-HSD-0417" },
    custody: ["Gram Panchayat, Banasihalli", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಬನಸಿಹಳ್ಳಿ"], loc: "KA-CTD-HSD-0512" },

  { n: 43, t: "hsd", d: "ctd", dept: "revenue", sub: ["Tahsildar, Hosadurga", "ತಹಸೀಲ್ದಾರ್, ಹೊಸದುರ್ಗ"], cat: "waste", survey: "88/2", rtc: 4.10, offered: 4.10, veg: "Bare - no vegetation", water: "Source 500 m to 2 km", access: "Cart track only", enc: "No", disp: "No", terrain: "Flat", state: "approved", cadre: "hsd-2", day: "5 Jun 2026",
    found: { offered: "4.02", vegetation: "Grass / weed cover only", encroach: "No", dispute: "No", notesEn: "Extent as recorded. Cart track passable in dry season only.", notesKn: "ವಿಸ್ತೀರ್ಣ ದಾಖಲೆಯಂತೆ. ಗಾಡಿ ದಾರಿ ಒಣ ಹವೆಯಲ್ಲಿ ಮಾತ್ರ." },
    gate: { validGeometry: true, vertices: 187, walkedHa: 4.02, rtcHa: 4.10, overlapPct: 0, },
    custody: ["Gram Panchayat, Banasihalli", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಬನಸಿಹಳ್ಳಿ"], loc: "KA-CTD-HSD-0514" },

  { n: 47, t: "hsd", d: "ctd", dept: "forest", sub: ["Deputy Conservator of Forests, Chitradurga", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಚಿತ್ರದುರ್ಗ"], cat: "blank", survey: "97", rtc: 6.40, offered: 6.40, veg: "Bare - no vegetation", water: "No source within 2 km", access: "Foot access only", enc: "No", disp: "No", terrain: "Steep / hilly", state: "rejected", cadre: "hsd-1", day: "6 Jun 2026",
    found: { vegetation: "Existing tree cover present", water: "No source within 2 km", access: "Foot access only", notesEn: "Regeneration already established across most of the block. Not a blank area.", notesKn: "ಬಹುಪಾಲು ಪ್ರದೇಶದಲ್ಲಿ ನೈಸರ್ಗಿಕ ಪುನರುತ್ಪತ್ತಿ ಆಗಿದೆ. ಖಾಲಿ ಪ್ರದೇಶವಲ್ಲ." },
    rej: ["Existing vegetation — natural regeneration established; planting would displace it", "ಈಗಿರುವ ಸಸ್ಯವರ್ಗ — ನೈಸರ್ಗಿಕ ಪುನರುತ್ಪತ್ತಿ ಆಗಿದೆ; ನೆಡುವಿಕೆ ಅದನ್ನು ಹಾಳುಮಾಡುತ್ತದೆ"] },

  { n: 52, t: "hsd", d: "ctd", dept: "gp", sub: ["Panchayat Development Officer, Banasihalli", "ಪಂಚಾಯಿತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ, ಬನಸಿಹಳ್ಳಿ"], cat: "pty", survey: "12/1", rtc: 1.60, offered: 1.60, veg: "Grass / weed cover only", water: "Perennial source within 500 m", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "verified", cadre: "hsd-2", day: "11 Jun 2026",
    found: { offered: "1.58", encroach: "No", dispute: "No", notesEn: "Suitable. Custodian body not yet confirmed by the panchayat.", notesKn: "ಸೂಕ್ತವಾಗಿದೆ. ಪಾಲಕ ಸಂಸ್ಥೆಯನ್ನು ಪಂಚಾಯಿತಿ ಇನ್ನೂ ದೃಢಪಡಿಸಿಲ್ಲ." },
    gate: { validGeometry: true, vertices: 96, walkedHa: 1.58, rtcHa: 1.60, overlapPct: 0 } },

  { n: 55, t: "hsd", d: "ctd", dept: "edu", sub: ["Block Education Officer, Hosadurga", "ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿ, ಹೊಸದುರ್ಗ"], cat: "campus", survey: "204", rtc: 0.80, offered: 0.42, veg: "Bare - no vegetation", water: "Piped / tanker supply arranged", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "approved", cadre: "hsd-1", day: "18 Jun 2026",
    found: { offered: "0.40", encroach: "No", dispute: "No", notesEn: "School compound, inside the boundary wall. Watering by the school.", notesKn: "ಶಾಲಾ ಆವರಣ, ಗೋಡೆಯ ಒಳಗೆ. ನೀರುಣಿಸುವಿಕೆ ಶಾಲೆಯಿಂದ." },
    gate: { validGeometry: true, vertices: 72, walkedHa: 0.40, rtcHa: 0.80, overlapPct: 0 },
    custody: ["Government High School, Banasihalli", "ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಬನಸಿಹಳ್ಳಿ"], loc: "KA-CTD-HSD-0519" },

  { n: 58, t: "hsd", d: "ctd", dept: "revenue", sub: ["Tahsildar, Hosadurga", "ತಹಸೀಲ್ದಾರ್, ಹೊಸದುರ್ಗ"], cat: "gomala", survey: "63", rtc: 5.20, offered: 5.20, veg: "Grass / weed cover only", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "Not known", disp: "No", terrain: "Gently undulating", state: "queued", day: "24 Jun 2026" },

  { n: 61, t: "hsd", d: "ctd", dept: "forest", sub: ["Deputy Conservator of Forests, Chitradurga", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಚಿತ್ರದುರ್ಗ"], cat: "degraded", survey: "118/2", rtc: 2.90, offered: 2.90, veg: "Dense scrub", water: "Source 500 m to 2 km", access: "Cart track only", enc: "No", disp: "No", terrain: "Undulating", state: "queued", day: "27 Jun 2026" },

  // ---- Chitradurga / Challakere -------------------------------------------
  { n: 44, t: "clk", d: "ctd", dept: "mi", sub: ["Assistant Executive Engineer, Minor Irrigation", "ಸಹಾಯಕ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಭಿಯಂತರ, ಸಣ್ಣ ನೀರಾವರಿ"], cat: "tank", survey: "31", rtc: 7.80, offered: 6.20, veg: "Bare - no vegetation", water: "Perennial source within 500 m", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "approved", cadre: "clk-1", day: "3 Jun 2026",
    found: { offered: "6.05", encroach: "No", dispute: "No", notesEn: "Foreshore band walked above the full tank level line.", notesKn: "ಕೆರೆ ತುಂಬಿದ ಮಟ್ಟದ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಅಂಗಳ ನಡೆಯಲಾಗಿದೆ." },
    gate: { validGeometry: true, vertices: 341, walkedHa: 6.05, rtcHa: 7.80, overlapPct: 0 },
    custody: ["Minor Irrigation Department, Challakere", "ಸಣ್ಣ ನೀರಾವರಿ ಇಲಾಖೆ, ಚಳ್ಳಕೆರೆ"], loc: "KA-CTD-CLK-0208" },

  { n: 49, t: "clk", d: "ctd", dept: "revenue", sub: ["Tahsildar, Challakere", "ತಹಸೀಲ್ದಾರ್, ಚಳ್ಳಕೆರೆ"], cat: "waste", survey: "205/1", rtc: 3.40, offered: 3.40, veg: "Bare - no vegetation", water: "Source 500 m to 2 km", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "rejected", cadre: "clk-2", rejectCount: 2, day: "7 Jun 2026",
    found: { encroach: "Yes", dispute: "Yes", notesEn: "Two structures standing on the southern portion. A civil matter is pending.", notesKn: "ದಕ್ಷಿಣ ಭಾಗದಲ್ಲಿ ಎರಡು ಕಟ್ಟಡಗಳಿವೆ. ದಾವೆ ಬಾಕಿ ಇದೆ." },
    rej: ["Encroachment and boundary dispute — twice rejected, referred to district review", "ಒತ್ತುವರಿ ಮತ್ತು ಗಡಿ ವಿವಾದ — ಎರಡು ಬಾರಿ ತಿರಸ್ಕೃತ, ಜಿಲ್ಲಾ ಪರಿಶೀಲನೆಗೆ"] },

  { n: 53, t: "clk", d: "ctd", dept: "pwd", sub: ["Assistant Engineer, PWD, Challakere", "ಸಹಾಯಕ ಅಭಿಯಂತರ, ಲೋಕೋಪಯೋಗಿ, ಚಳ್ಳಕೆರೆ"], cat: "road", survey: "—", rtc: 2.10, offered: 2.10, veg: "Grass / weed cover only", water: "Piped / tanker supply arranged", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "verified", cadre: "clk-1", day: "13 Jun 2026",
    found: { offered: "2.10", notesEn: "Avenue strip, 4 m wide, both sides for 2.6 km. Below the floor for satellite corroboration.", notesKn: "4 ಮೀ ಅಗಲದ ರಸ್ತೆ ಬದಿ, 2.6 ಕಿಮೀ ಎರಡೂ ಬದಿ. ಉಪಗ್ರಹ ಪರಿಶೀಲನೆಗೆ ಸಾಲದು." },
    gate: { validGeometry: true, vertices: 412, walkedHa: 2.10, rtcHa: 2.10, overlapPct: 0 } },

  { n: 57, t: "clk", d: "ctd", dept: "gp", sub: ["Panchayat Development Officer, Siddeswaranadurga", "ಪಂಚಾಯಿತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ, ಸಿದ್ದೇಶ್ವರನದುರ್ಗ"], cat: "pty", survey: "44/2", rtc: 0.90, offered: 0.90, veg: "Scattered scrub", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "queued", day: "21 Jun 2026" },

  { n: 62, t: "clk", d: "ctd", dept: "mi", sub: ["Assistant Executive Engineer, Minor Irrigation", "ಸಹಾಯಕ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಭಿಯಂತರ, ಸಣ್ಣ ನೀರಾವರಿ"], cat: "canal", survey: "—", rtc: 1.40, offered: 1.40, veg: "Grass / weed cover only", water: "Perennial source within 500 m", access: "Cart track only", enc: "Not known", disp: "No", terrain: "Flat", state: "submitted", day: "1 Jul 2026" },

  // ---- Tumakuru / Sira -----------------------------------------------------
  { n: 42, t: "sir", d: "tum", dept: "forest", sub: ["Deputy Conservator of Forests, Tumakuru", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ತುಮಕೂರು"], cat: "degraded", survey: "76/1", rtc: 5.60, offered: 5.60, veg: "Scattered scrub", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Undulating", state: "approved", cadre: "sir-1", day: "2 Jun 2026",
    found: { offered: "5.41", encroach: "No", dispute: "No", notesEn: "Rocky outcrop on the western edge excluded.", notesKn: "ಪಶ್ಚಿಮ ಅಂಚಿನ ಬಂಡೆ ಪ್ರದೇಶ ಹೊರಗಿಡಲಾಗಿದೆ." },
    gate: { validGeometry: true, vertices: 268, walkedHa: 5.41, rtcHa: 5.60, overlapPct: 0.8, overlapWith: "KA-TUM-SIR-0203" },
    custody: ["Gram Panchayat, Seebi Agrahara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಸೀಬಿ ಅಗ್ರಹಾರ"], loc: "KA-TUM-SIR-0311" },

  { n: 48, t: "sir", d: "tum", dept: "revenue", sub: ["Tahsildar, Sira", "ತಹಸೀಲ್ದಾರ್, ಸಿರಾ"], cat: "gomala", survey: "119", rtc: 8.20, offered: 8.20, veg: "Grass / weed cover only", water: "Source 500 m to 2 km", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "approved", cadre: "sir-2", day: "6 Jun 2026",
    found: { offered: "7.90", encroach: "No", dispute: "No", notesEn: "Grazing in active use; custodian has agreed to a rotational arrangement.", notesKn: "ಮೇಯಿಸುವಿಕೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ; ಸರದಿ ವ್ಯವಸ್ಥೆಗೆ ಪಾಲಕರು ಒಪ್ಪಿದ್ದಾರೆ." },
    gate: { validGeometry: true, vertices: 402, walkedHa: 7.90, rtcHa: 8.20, overlapPct: 0 },
    custody: ["Gram Panchayat, Seebi Agrahara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಸೀಬಿ ಅಗ್ರಹಾರ"], loc: "KA-TUM-SIR-0314" },

  { n: 51, t: "sir", d: "tum", dept: "health", sub: ["Taluk Health Officer, Sira", "ತಾಲ್ಲೂಕು ಆರೋಗ್ಯಾಧಿಕಾರಿ, ಸಿರಾ"], cat: "campus", survey: "3/1", rtc: 1.20, offered: 0.30, veg: "Bare - no vegetation", water: "Piped / tanker supply arranged", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "verified", cadre: "sir-1", day: "12 Jun 2026",
    found: { offered: "0.28", notesEn: "Hospital compound. Under 0.5 ha — assured by ground evidence alone.", notesKn: "ಆಸ್ಪತ್ರೆ ಆವರಣ. 0.5 ಹೆ.ಗಿಂತ ಕಡಿಮೆ — ನೆಲದ ಸಾಕ್ಷ್ಯದಿಂದ ಮಾತ್ರ ಖಾತ್ರಿ." },
    gate: { validGeometry: true, vertices: 64, walkedHa: 0.28, rtcHa: 1.20, overlapPct: 0 } },

  { n: 54, t: "sir", d: "tum", dept: "pwd", sub: ["Assistant Engineer, PWD, Sira", "ಸಹಾಯಕ ಅಭಿಯಂತರ, ಲೋಕೋಪಯೋಗಿ, ಸಿರಾ"], cat: "road", survey: "—", rtc: 3.30, offered: 3.30, veg: "Grass / weed cover only", water: "No source within 2 km", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "rejected", cadre: "sir-2", day: "14 Jun 2026",
    found: { water: "No source within 2 km", notesEn: "No water source and no tanker arrangement offered. Survival cannot be assured.", notesKn: "ನೀರಿನ ಮೂಲವಿಲ್ಲ, ಟ್ಯಾಂಕರ್ ವ್ಯವಸ್ಥೆಯೂ ಇಲ್ಲ. ಉಳಿವನ್ನು ಖಾತ್ರಿಪಡಿಸಲಾಗದು." },
    rej: ["Water availability — no source within 2 km and no supply arrangement", "ನೀರಿನ ಲಭ್ಯತೆ — 2 ಕಿಮೀ ಒಳಗೆ ಮೂಲವಿಲ್ಲ, ಪೂರೈಕೆ ವ್ಯವಸ್ಥೆಯೂ ಇಲ್ಲ"] },

  { n: 59, t: "sir", d: "tum", dept: "forest", sub: ["Deputy Conservator of Forests, Tumakuru", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ತುಮಕೂರು"], cat: "blank", survey: "88", rtc: 4.70, offered: 4.70, veg: "Bare - no vegetation", water: "Seasonal source within 500 m", access: "Cart track only", enc: "No", disp: "No", terrain: "Undulating", state: "approved", cadre: "sir-2", day: "25 Jun 2026",
    found: { offered: "4.55", encroach: "No", dispute: "No", notesEn: "Blank area confirmed. Cart track will need improvement before nursery dispatch.", notesKn: "ಖಾಲಿ ಪ್ರದೇಶ ದೃಢಪಟ್ಟಿದೆ. ನರ್ಸರಿ ಸಾಗಣೆಗೂ ಮೊದಲು ಗಾಡಿ ದಾರಿ ಸುಧಾರಿಸಬೇಕು." },
    gate: { validGeometry: true, vertices: 241, walkedHa: 4.55, rtcHa: 4.70, overlapPct: 0 },
    custody: ["Gram Panchayat, Seebi Agrahara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಸೀಬಿ ಅಗ್ರಹಾರ"], loc: "KA-TUM-SIR-0322" },

  { n: 63, t: "sir", d: "tum", dept: "gp", sub: ["Panchayat Development Officer, Seebi Agrahara", "ಪಂಚಾಯಿತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ, ಸೀಬಿ ಅಗ್ರಹಾರ"], cat: "pty", survey: "27", rtc: 2.30, offered: 2.30, veg: "Scattered scrub", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "submitted", day: "2 Jul 2026" },

  // ---- Belagavi / Savadatti -----------------------------------------------
  { n: 45, t: "svd", d: "blg", dept: "forest", sub: ["Deputy Conservator of Forests, Belagavi", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಬೆಳಗಾವಿ"], cat: "degraded", survey: "210/4", rtc: 4.90, offered: 4.90, veg: "Scattered scrub", water: "Perennial source within 500 m", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Gently undulating", state: "approved", cadre: "svd-1", day: "4 Jun 2026",
    found: { offered: "4.88", encroach: "No", dispute: "No", notesEn: "Extent as recorded. Good access throughout.", notesKn: "ವಿಸ್ತೀರ್ಣ ದಾಖಲೆಯಂತೆ. ಎಲ್ಲೆಡೆ ಉತ್ತಮ ದಾರಿ." },
    gate: { validGeometry: true, vertices: 233, walkedHa: 4.88, rtcHa: 4.90, overlapPct: 0 },
    custody: ["Gram Panchayat, Akkisagara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಅಕ್ಕಿಸಾಗರ"], loc: "KA-BLG-SVD-0122" },

  { n: 50, t: "svd", d: "blg", dept: "mi", sub: ["Assistant Executive Engineer, Minor Irrigation", "ಸಹಾಯಕ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಭಿಯಂತರ, ಸಣ್ಣ ನೀರಾವರಿ"], cat: "tank", survey: "17", rtc: 6.10, offered: 5.00, veg: "Bare - no vegetation", water: "Perennial source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "verified", cadre: "svd-2", day: "9 Jun 2026",
    found: { offered: "4.62", vegetation: "Grass / weed cover only", encroach: "No", dispute: "No", notesEn: "Foreshore walked above full tank level. Custodian body awaiting departmental confirmation.", notesKn: "ಕೆರೆ ತುಂಬಿದ ಮಟ್ಟದ ಮೇಲೆ ಅಂಗಳ ನಡೆಯಲಾಗಿದೆ. ಪಾಲಕ ಸಂಸ್ಥೆಗೆ ಇಲಾಖಾ ದೃಢೀಕರಣ ಬಾಕಿ." },
    gate: { validGeometry: true, vertices: 287, walkedHa: 4.62, rtcHa: 6.10, overlapPct: 0 } },

  { n: 56, t: "svd", d: "blg", dept: "revenue", sub: ["Tahsildar, Savadatti", "ತಹಸೀಲ್ದಾರ್, ಸವದತ್ತಿ"], cat: "waste", survey: "92/1", rtc: 3.70, offered: 3.70, veg: "Grass / weed cover only", water: "Source 500 m to 2 km", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "rejected", cadre: "svd-1", day: "17 Jun 2026",
    found: { notesEn: "Boundary walk closed on itself twice; the officer's track crosses. Returned for a fresh walk.", notesKn: "ಗಡಿ ನಡಿಗೆ ತನ್ನನ್ನೇ ಎರಡು ಬಾರಿ ಕತ್ತರಿಸಿದೆ. ಮತ್ತೆ ನಡೆಯಲು ಮರಳಿಸಲಾಗಿದೆ." },
    gate: { validGeometry: false, vertices: 158, walkedHa: 0, rtcHa: 3.70, overlapPct: 0 },
    rej: ["Invalid geometry — the recorded boundary crosses itself; a fresh walk is required", "ಅಮಾನ್ಯ ಗಡಿ — ದಾಖಲಾದ ಗಡಿ ತನ್ನನ್ನೇ ಕತ್ತರಿಸುತ್ತದೆ; ಮತ್ತೆ ನಡೆಯಬೇಕು"] },

  { n: 60, t: "svd", d: "blg", dept: "pwd", sub: ["Assistant Engineer, PWD, Savadatti", "ಸಹಾಯಕ ಅಭಿಯಂತರ, ಲೋಕೋಪಯೋಗಿ, ಸವದತ್ತಿ"], cat: "road", survey: "—", rtc: 1.80, offered: 1.80, veg: "Grass / weed cover only", water: "Piped / tanker supply arranged", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "queued", day: "26 Jun 2026" },

  { n: 64, t: "svd", d: "blg", dept: "edu", sub: ["Block Education Officer, Savadatti", "ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿ, ಸವದತ್ತಿ"], cat: "campus", survey: "58", rtc: 0.60, offered: 0.35, veg: "Bare - no vegetation", water: "Piped / tanker supply arranged", access: "Motorable road up to site", enc: "No", disp: "No", terrain: "Flat", state: "submitted", day: "3 Jul 2026" },

  { n: 65, t: "svd", d: "blg", dept: "gp", sub: ["Panchayat Development Officer, Akkisagara", "ಪಂಚಾಯಿತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ, ಅಕ್ಕಿಸಾಗರ"], cat: "pty", survey: "71/3", rtc: 2.60, offered: 2.60, veg: "Scattered scrub", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Gently undulating", state: "queued", day: "29 Jun 2026" },

  // ---- the one left pending, for a live verification in the room -----------
  { n: 66, t: "hsd", d: "ctd", dept: "revenue", sub: ["Tahsildar, Hosadurga", "ತಹಸೀಲ್ದಾರ್, ಹೊಸದುರ್ಗ"], cat: "waste", survey: "156/1", rtc: 3.60, offered: 3.60, veg: "Grass / weed cover only", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Gently undulating", state: "assigned", cadre: "hsd-1", day: "5 Jul 2026" },


  // ---- two more, to complete the 28 ---------------------------------------
  { n: 68, t: "sir", d: "tum", dept: "revenue", sub: ["Tahsildar, Sira", "ತಹಸೀಲ್ದಾರ್, ಸಿರಾ"], cat: "waste", survey: "204/2", rtc: 3.90, offered: 3.90, veg: "Bare - no vegetation", water: "Seasonal source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Flat", state: "approved", cadre: "sir-1", day: "8 Jun 2026",
    found: { offered: "3.76", encroach: "No", dispute: "No", notesEn: "Extent broadly as recorded. Bund on the southern edge intact.", notesKn: "ವಿಸ್ತೀರ್ಣ ಬಹುತೇಕ ದಾಖಲೆಯಂತೆ. ದಕ್ಷಿಣ ಅಂಚಿನ ಏರಿ ಸುಸ್ಥಿತಿಯಲ್ಲಿದೆ." },
    gate: { validGeometry: true, vertices: 198, walkedHa: 3.76, rtcHa: 3.90, overlapPct: 0 },
    custody: ["Gram Panchayat, Seebi Agrahara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಸೀಬಿ ಅಗ್ರಹಾರ"], loc: "KA-TUM-SIR-0318" },

  { n: 69, t: "svd", d: "blg", dept: "gp", sub: ["Panchayat Development Officer, Akkisagara", "ಪಂಚಾಯಿತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ, ಅಕ್ಕಿಸಾಗರ"], cat: "gomala", survey: "103", rtc: 4.40, offered: 4.40, veg: "Grass / weed cover only", water: "Perennial source within 500 m", access: "Motorable within 500 m", enc: "No", disp: "No", terrain: "Gently undulating", state: "approved", cadre: "svd-2", day: "10 Jun 2026",
    found: { offered: "4.31", encroach: "No", dispute: "No", notesEn: "Grazing corridor along the northern edge left unplanted by agreement.", notesKn: "ಉತ್ತರ ಅಂಚಿನ ಮೇಯಿಸುವ ದಾರಿಯನ್ನು ಒಪ್ಪಂದದಂತೆ ನೆಡದೆ ಬಿಡಲಾಗಿದೆ." },
    gate: { validGeometry: true, vertices: 224, walkedHa: 4.31, rtcHa: 4.40, overlapPct: 0 },
    custody: ["Gram Panchayat, Akkisagara", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಅಕ್ಕಿಸಾಗರ"], loc: "KA-BLG-SVD-0129" },
  { n: 67, t: "clk", d: "ctd", dept: "forest", sub: ["Deputy Conservator of Forests, Chitradurga", "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಚಿತ್ರದುರ್ಗ"], cat: "degraded", survey: "133", rtc: 5.10, offered: 5.10, veg: "Dense scrub", water: "Source 500 m to 2 km", access: "Cart track only", enc: "No", disp: "No", terrain: "Undulating", state: "assigned", cadre: "clk-2", day: "6 Jul 2026" },
];

function build(s: Seed): Offer {
  const [dName, dKn] = D[s.d];
  const [tName, tKn, hobli, village] = T[s.t];
  const [deptEn, deptKn] = DEPT[s.dept];
  const [catEn, catKn] = CAT[s.cat];
  const code = { ctd: "CTD", tum: "TUM", blg: "BLG" }[s.d];
  const tcode = { hsd: "HSD", clk: "CLK", sir: "SIR", svd: "SVD" }[s.t];
  return {
    ref: `OFR-${code}-${tcode}-${String(s.n).padStart(4, "0")}`,
    submittedOn: s.day,
    deptEn, deptKn,
    submitterEn: s.sub[0], submitterKn: s.sub[1],
    district: dName, districtKn: dKn,
    taluk: tName, talukKn: tKn,
    hobli, village, survey: s.survey,
    category: catEn, categoryKn: catKn,
    rtc: s.rtc, offered: s.offered,
    lat: 14.2 + s.n * 0.004, lng: 76.4 + s.n * 0.006,
    terrain: s.terrain, vegetation: s.veg, water: s.water, access: s.access,
    encroach: s.enc, dispute: s.disp,
    custodianProposed: `Gram Panchayat, ${village}`,
    season: "Monsoon 2027",
    state: s.state,
    rejectCount: s.rejectCount,
  } as Offer;
}

const VISIT_DAY: Record<string, string> = {};

/** Zones for the four demonstration taluks. */
const ZONE_BY_TALUK: Record<string, string> = {
  hsd: "centdry", clk: "centdry", sir: "eastdry", svd: "nthtrans",
};
const SOIL_BY_SEED = ["redloam", "redsandy", "blackdeep", "redloam", "gravel"];

/** One walk per seed, so the same parcel always produces the same ring. */
const WALK_CACHE = new Map<number, Walk>();
function walkFor(s: Seed): Walk {
  const hit = WALK_CACHE.get(s.n);
  if (hit) return hit;
  const lat = 14.2 + s.n * 0.004;
  const lng = 76.4 + s.n * 0.006;
  const dev = `VER-${({ ctd: "CTD", tum: "TUM", blg: "BLG" } as Record<string, string>)[s.d]}-${String(s.n).padStart(3, "0")}`;
  const isLine = s.cat === "road" || s.cat === "canal" || s.cat === "campus";
  const w = isLine
    ? makeLineWalk(lat, lng, 1.4 + (s.n % 5) * 0.6, s.cat === "campus" ? 6 : 5, `${s.t}${s.n}L`, dev)
    : makeWalk(lat, lng, Number(s.found?.offered ?? s.offered), `${s.t}${s.n}W`, dev);
  WALK_CACHE.set(s.n, w);
  return w;
}

function buildVerification(s: Seed): Verification | null {
  if (!s.cadre || !s.found) return null;
  const cad = CADRE.find((c) => c.key === s.cadre)!;
  const code = { ctd: "CTD", tum: "TUM", blg: "BLG" }[s.d];
  const tcode = { hsd: "HSD", clk: "CLK", sir: "SIR", svd: "SVD" }[s.t];
  const ref = `OFR-${code}-${tcode}-${String(s.n).padStart(4, "0")}`;
  const verified = s.state === "approved" || s.state === "verified";
  return {
    ref,
    officerKey: cad.key, officerEn: cad.en, officerKn: cad.kn,
    visitedOn: VISIT_DAY[ref] ?? s.day.replace(/^\d+/, (d) => String(Number(d) + 9)),
    offered: String(walkFor(s).areaHa),
    vegetation: s.found.vegetation ?? s.veg,
    water: s.found.water ?? s.water,
    access: s.found.access ?? s.access,
    encroach: s.found.encroach ?? s.enc,
    dispute: s.found.dispute ?? s.disp,
    terrain: s.terrain,
    zone: ZONE_BY_TALUK[s.t],
    soil: SOIL_BY_SEED[s.n % 5],
    depth: s.terrain === "Steep / hilly" || s.terrain === "Rocky" ? "shallow" : s.n % 3 === 0 ? "deep" : "medium",
    slope: s.terrain === "Steep / hilly" ? "steep" : s.terrain === "Flat" ? "level" : s.terrain === "Undulating" ? "moderate" : "gentle",
    drainage: s.cat === "tank" || s.cat === "canal" ? "moderate" : "well",
    waterDistance: String(180 + (s.n % 7) * 210),
    addressEn: `${T[s.t][3]}, ${T[s.t][0]} taluk — reached from the ${T[s.t][2]} hobli road`,
    landTypeConfirmed: CAT[s.cat][0],
    notesEn: s.found.notesEn ?? "", notesKn: s.found.notesKn ?? "",
    walk: walkFor(s),
    gate: {
      validGeometry: s.gate ? s.gate.validGeometry : true,
      vertices: walkFor(s).vertexCount,
      walkedHa: walkFor(s).areaHa,
      rtcHa: s.rtc,
      overlapPct: s.gate?.overlapPct ?? 0,
      overlapWith: s.gate?.overlapWith,
    },
    decision: verified ? "verified" : "rejected",
    rejectionEn: s.rej?.[0], rejectionKn: s.rej?.[1],
    custodyEn: s.custody?.[0], custodyKn: s.custody?.[1],
    locationId: s.loc,
    issuedOn: s.loc ? s.day.replace(/^\d+/, (d) => String(Number(d) + 12)) : undefined,
  };
}

export const SEED_OFFERS: Offer[] = S.map(build);
export const SEED_VERIFICATIONS: Verification[] =
  S.map(buildVerification).filter((v): v is Verification => v !== null);

/** Deterministic pseudo-random, so a given parcel always walks the same ring. */
function seeded(key: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let x = h >>> 0;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5; x >>>= 0;
    return x / 4294967296;
  };
}

/**
 * Produces a plausible walked ring around a parcel centre for the given area.
 * In the field this comes from the handset; here it is derived so that every
 * seeded record carries actual coordinates rather than an assertion.
 */
/**
 * A centre-line trace. A roadside strip or a canal bank is a run, not an area:
 * the officer walks the line and declares the planted width. Length in
 * kilometres is what the linear planting models are quoted against.
 */
export function makeLineWalk(
  lat: number,
  lng: number,
  approxKm: number,
  widthM: number,
  seedKey: string,
  device: string,
): Walk {
  const r = seeded(seedKey);
  const mPerDegLng = 111320 * Math.cos((lat * Math.PI) / 180);
  const mPerDegLat = 110540;
  const legs = 6 + Math.floor(r() * 5);
  const legM = (approxKm * 1000) / legs;

  const points: [number, number][] = [[+lng.toFixed(6), +lat.toFixed(6)]];
  let bearing = r() * Math.PI * 2;
  for (let i = 0; i < legs; i++) {
    bearing += (r() - 0.5) * 0.5;            // a road bends, it does not zigzag
    const last = points[points.length - 1];
    points.push([
      +(last[0] + (Math.sin(bearing) * legM) / mPerDegLng).toFixed(6),
      +(last[1] + (Math.cos(bearing) * legM) / mPerDegLat).toFixed(6),
    ]);
  }

  let lengthM = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i][0] - points[i - 1][0]) * mPerDegLng;
    const dy = (points[i][1] - points[i - 1][1]) * mPerDegLat;
    lengthM += Math.sqrt(dx * dx + dy * dy);
  }

  const mid = points[Math.floor(points.length / 2)];
  const mins = 22 + Math.floor(approxKm * 14);
  const h = 9 + Math.floor(r() * 3);
  const m0 = 5 + Math.floor(r() * 40);
  const end = m0 + mins;

  return {
    mode: "line",
    points,
    vertexCount: 90 + Math.round(lengthM / 12),
    gpsAccuracyM: 3 + Math.floor(r() * 4),
    deviceId: device,
    startedAt: `${String(h).padStart(2, "0")}:${String(m0 % 60).padStart(2, "0")}`,
    endedAt: `${String(h + Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`,
    perimeterM: Math.round(lengthM),
    areaHa: +((lengthM * widthM) / 10000).toFixed(2),   // the strip it occupies
    lengthKm: +(lengthM / 1000).toFixed(2),
    widthM,
    centroid: mid,
    geomVersion: 1,
    simplifyToleranceM: 2.5,
  };
}

export function makeWalk(
  lat: number,
  lng: number,
  approxHa: number,
  seedKey: string,
  device: string,
): Walk {
  const r = seeded(seedKey);
  const sides = 8 + Math.floor(r() * 5);
  // the officer walks the ground, not a target figure — the ring is irregular
  // and its enclosed area falls where it falls
  const radiusM = Math.sqrt((approxHa * 10000) / Math.PI) * (0.9 + r() * 0.14);
  const mPerDegLng = 111320 * Math.cos((lat * Math.PI) / 180);
  const mPerDegLat = 110540;

  const points: [number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const ang = (i / sides) * Math.PI * 2;
    const jitter = 0.82 + r() * 0.36;
    points.push([
      +(lng + (Math.sin(ang) * radiusM * jitter) / mPerDegLng).toFixed(6),
      +(lat + (Math.cos(ang) * radiusM * jitter) / mPerDegLat).toFixed(6),
    ]);
  }
  points.push(points[0]);

  // perimeter: sum of the leg distances
  let perim = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i][0] - points[i - 1][0]) * mPerDegLng;
    const dy = (points[i][1] - points[i - 1][1]) * mPerDegLat;
    perim += Math.sqrt(dx * dx + dy * dy);
  }

  // area: shoelace over the ring, in metres, then to hectares
  let twiceArea = 0;
  let cx = 0, cy = 0;
  for (let i = 1; i < points.length; i++) {
    const x1 = (points[i - 1][0] - lng) * mPerDegLng;
    const y1 = (points[i - 1][1] - lat) * mPerDegLat;
    const x2 = (points[i][0] - lng) * mPerDegLng;
    const y2 = (points[i][1] - lat) * mPerDegLat;
    const cross = x1 * y2 - x2 * y1;
    twiceArea += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  const areaM2 = Math.abs(twiceArea) / 2;
  const areaHa = +(areaM2 / 10000).toFixed(2);
  const centroid: [number, number] = twiceArea === 0
    ? [+lng.toFixed(6), +lat.toFixed(6)]
    : [
        +(lng + cx / (3 * twiceArea) / mPerDegLng).toFixed(6),
        +(lat + cy / (3 * twiceArea) / mPerDegLat).toFixed(6),
      ];

  const mins = 18 + Math.floor(areaHa * 9);
  const h = 9 + Math.floor(r() * 3);
  const m0 = 5 + Math.floor(r() * 40);
  const end = m0 + mins;

  return {
    mode: "ring",
    points,
    vertexCount: 120 + Math.round(areaHa * 47),
    gpsAccuracyM: 3 + Math.floor(r() * 4),
    deviceId: device,
    startedAt: `${String(h).padStart(2, "0")}:${String(m0 % 60).padStart(2, "0")}`,
    endedAt: `${String(h + Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`,
    perimeterM: Math.round(perim),
    areaHa,
    lengthKm: 0,
    widthM: 0,
    centroid,
    geomVersion: 1,
    simplifyToleranceM: 2.5,
  };
}

/** Runs the §6 gate on a walked boundary. Mirrors schematic G2. */
export function runGate(o: Offer, walkedHa: number, valid: boolean): Gate {
  return {
    validGeometry: valid,
    vertices: 120 + Math.round(walkedHa * 47),
    walkedHa,
    rtcHa: o.rtc,
    overlapPct: 0,
  };
}

export function nextLocationId(o: Offer, done: Verification[]): string {
  const code = o.ref.split("-").slice(1, 3).join("-");
  const used = done.filter((v) => v.locationId?.includes(code)).length;
  return `KA-${code}-${String(600 + used * 7).padStart(4, "0")}`;
}

/** The one screen that pairs the two records. */
export type Pair = { offer: Offer; verification?: Verification };

export function pairs(offers: Offer[], vs: Verification[]): Pair[] {
  return offers.map((o) => ({ offer: o, verification: vs.find((v) => v.ref === o.ref) }));
}

export function differences(p: Pair, lang: "en" | "kn"): { field: string; declared: string; found: string }[] {
  const v = p.verification;
  if (!v) return [];
  const en = lang === "en";
  const rows: { field: string; declared: string; found: string }[] = [
    { field: en ? "Area offered" : "ನೀಡಿದ ವಿಸ್ತೀರ್ಣ", declared: `${p.offer.offered.toFixed(2)} ha`, found: `${(+v.offered).toFixed(2)} ha` },
    { field: en ? "Vegetation" : "ಸಸ್ಯವರ್ಗ", declared: p.offer.vegetation, found: v.vegetation },
    { field: en ? "Water" : "ನೀರು", declared: p.offer.water, found: v.water },
    { field: en ? "Access" : "ದಾರಿ", declared: p.offer.access, found: v.access },
    { field: en ? "Encroachment" : "ಒತ್ತುವರಿ", declared: p.offer.encroach, found: v.encroach },
    { field: en ? "Boundary dispute" : "ಗಡಿ ವಿವಾದ", declared: p.offer.dispute, found: v.dispute },
  ];
  return rows;
}

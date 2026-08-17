import { VILLAGES } from "./villages";

export type Status = "active" | "flagged" | "rectification";

export type CaptureImage = {
  ref: string;
  tagTap: string;
  gps: string;
  gpsAccuracyM: number;
  deviceTime: string;
  serverTime: string;
  capturedByEn: string;
  capturedByKn: string;
  device: string;
  frame: "rows" | "pit" | "canopy" | "gap";
};

export type EvidenceEvent = {
  kind: "canopy" | "census" | "audit" | "planting" | "verification" | "escalation";
  labelEn: string;
  labelKn: string;
  date: string;
  metaEn: string;
  metaKn: string;
  cadreEn?: string;
  cadreKn?: string;
  restricted?: boolean;
  publicVisible?: boolean;
  images?: CaptureImage[];
};

const FRAMES: CaptureImage["frame"][] = ["rows", "pit", "canopy", "gap"];

function shots(
  seed: string,
  date: string,
  n: number,
  byEn: string,
  byKn: string,
  device: string,
  baseLat = 14.2001,
  baseLng = 76.4003,
): CaptureImage[] {
  return Array.from({ length: n }, (_, i) => {
    const mins = 9 * 60 + 14 + i * 7;
    const hh = String(Math.floor(mins / 60)).padStart(2, "0");
    const mm = String(mins % 60).padStart(2, "0");
    const lag = 3 + ((i * 5) % 9);
    const ss = String(11 + ((i * 13) % 40)).padStart(2, "0");
    const ss2 = String((11 + ((i * 13) % 40) + lag) % 60).padStart(2, "0");
    return {
      ref: `EV-${seed}-${String(i + 1).padStart(3, "0")}`,
      tagTap: `${seed}-TAP-${String(i + 1).padStart(2, "0")}`,
      gps: `${(baseLat + i * 0.00008).toFixed(5)}, ${(baseLng + i * 0.00011).toFixed(5)}`,
      gpsAccuracyM: 3 + (i % 4),
      deviceTime: `${date} ${hh}:${mm}:${ss}`,
      serverTime: `${date} ${hh}:${mm}:${ss2}`,
      capturedByEn: byEn,
      capturedByKn: byKn,
      device: device,
      frame: FRAMES[i % FRAMES.length],
    };
  });
}

export type Parcel = {
  id: string;
  district: string;
  districtKn: string;
  taluk: string;
  talukKn: string;
  /**
   * Village, once a site is registered with one.
   *
   * Absent on every seeded site here: these carry a district and a taluk only,
   * which is why the map draws them inside their taluk rather than at a point.
   * The field app captures a village at registration, so real sites arrive with
   * this filled and the map pins them to the village centroid instead — the
   * only change needed is the centroid lookup.
   */
  village?: string;
  villageKn?: string;
  areaHa: number;
  plantedOn: string;
  verifiedOn: string;
  saplings: number;
  speciesCount: number;
  zone: number;
  survival: number;
  survivalCountedOn: string;
  nextCensus: string;
  status: Status;
  // Provenance. A planted parcel is the far end of the same chain a new offer
  // enters today: a department offered it, an officer walked it, IAFT approved
  // a plan for it. Without these a 2027 parcel looks like it appeared by itself.
  offerRef?: string;
  zoneLabel?: string;
  walk?: import("@/lib/offers").Walk;
  sitePair?: import("@/components/SiteCompare").SitePair;   // the officer's own track, for the imagery overlay      // silvi zone by name, where an agro-climatic number is not held
  deptEn?: string;
  deptKn?: string;
  verifiedByEn?: string;
  verifiedByKn?: string;
  planApprovedOn?: string;
  season?: string;
  rectification?: {
    ownerEn: string;
    ownerKn: string;
    deadline: string;
    overdueDays: number;
    reasonEn: string;
    reasonKn: string;
  };
  polygon: [number, number][];
  events: EvidenceEvent[];
};

const ev = (
  kind: EvidenceEvent["kind"],
  labelEn: string,
  labelKn: string,
  date: string,
  metaEn: string,
  metaKn: string,
  extra: Partial<EvidenceEvent> = {},
): EvidenceEvent => ({ kind, labelEn, labelKn, date, metaEn, metaKn, ...extra });

const VERIFY_CADRE_EN = "Verification cadre";
const VERIFY_CADRE_KN = "ಪರಿಶೀಲನಾ ದಳ";
const AUDIT_CADRE_EN = "Audit cadre — independent";
const AUDIT_CADRE_KN = "ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಳ — ಸ್ವತಂತ್ರ";
const AGENCY_EN = "Implementing agency";
const AGENCY_KN = "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ";

export const PARCELS: Parcel[] = [
  {
    id: "KA-CTD-HSD-0417",
    district: "Chitradurga",
    districtKn: "ಚಿತ್ರದುರ್ಗ",
    taluk: "Hosadurga",
    talukKn: "ಹೊಸದುರ್ಗ",
    areaHa: 2.04,
    plantedOn: "12 Jul 2027",
    verifiedOn: "3 May 2027",
    saplings: 1020,
    speciesCount: 7,
    zone: 4,
    survival: 91,
    survivalCountedOn: "14 Mar 2029",
    nextCensus: "Mar 2030",
    status: "active",
    polygon: [
      [78, 34],
      [186, 40],
      [180, 96],
      [72, 88],
    ],
    events: [
      ev("canopy", "Canopy indicator recorded", "ಮೇಲಾವರಣ ಸೂಚಕ ದಾಖಲಾಗಿದೆ", "2 Mar 2029", "Sentinel-2 · 4% cloud · derived", "ಸೆಂಟಿನೆಲ್-2 · 4% ಮೋಡ · ಪಡೆದ ಮಾಹಿತಿ"),
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "14 Mar 2029", "18 photographs", "18 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, publicVisible: true,
        images: shots("0417C", "14 Mar 2029", 4, "S. Rangappa, DRFO (retd)", "ಎಸ್. ರಂಗಪ್ಪ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", "AUD-CTD-014"),
      }),
      ev("audit", "Audit inspection, cleared", "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ತೀರುವಳಿ", "9 Nov 2028", "11 photographs", "11 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, restricted: true,
        images: shots("0417A", "9 Nov 2028", 3, "S. Rangappa, DRFO (retd)", "ಎಸ್. ರಂಗಪ್ಪ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", "AUD-CTD-014"),
      }),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "12 Jul 2027", "24 photographs", "24 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AGENCY_EN, cadreKn: AGENCY_KN, publicVisible: true,
        images: shots("0417P", "12 Jul 2027", 4, "Malnad Green Trust field team", "ಮಲೆನಾಡು ಗ್ರೀನ್ ಟ್ರಸ್ಟ್ ಕ್ಷೇತ್ರ ತಂಡ", "FLD-CTD-207"),
      }),
      ev("verification", "Land verified and approved", "ಭೂಮಿ ಪರಿಶೀಲಿಸಿ ಅನುಮೋದಿಸಲಾಗಿದೆ", "3 May 2027", "Location ID issued", "ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗಿದೆ"),
    ],
  },
  {
    id: "KA-CTD-HSD-0431",
    district: "Chitradurga",
    districtKn: "ಚಿತ್ರದುರ್ಗ",
    taluk: "Hosadurga",
    talukKn: "ಹೊಸದುರ್ಗ",
    areaHa: 1.36,
    plantedOn: "28 Jul 2027",
    verifiedOn: "19 May 2027",
    saplings: 680,
    speciesCount: 5,
    zone: 4,
    survival: 62,
    survivalCountedOn: "17 Mar 2029",
    nextCensus: "Mar 2030",
    status: "rectification",
    rectification: {
      ownerEn: "Implementing agency — Malnad Green Trust",
      ownerKn: "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ — ಮಲೆನಾಡು ಗ್ರೀನ್ ಟ್ರಸ್ಟ್",
      deadline: "30 Apr 2029",
      overdueDays: 41,
      reasonEn: "Casualty replacement not completed after census shortfall",
      reasonKn: "ಗಣತಿಯಲ್ಲಿ ಕೊರತೆ ಕಂಡ ನಂತರ ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಪೂರ್ಣಗೊಂಡಿಲ್ಲ",
    },
    polygon: [
      [70, 40],
      [176, 34],
      [184, 92],
      [78, 98],
    ],
    events: [
      ev("escalation", "Escalated to district command", "ಜಿಲ್ಲಾ ನಿಯಂತ್ರಣಕ್ಕೆ ಉನ್ನತೀಕರಿಸಲಾಗಿದೆ", "1 May 2029", "Rectification deadline passed", "ಸರಿಪಡಿಸುವಿಕೆ ಗಡುವು ಮೀರಿದೆ"),
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "17 Mar 2029", "62% — below threshold · 14 photographs", "62% — ಮಿತಿಗಿಂತ ಕಡಿಮೆ · 14 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, publicVisible: true,
        images: shots("0431C", "17 Mar 2029", 4, "S. Rangappa, DRFO (retd)", "ಎಸ್. ರಂಗಪ್ಪ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", "AUD-CTD-014", 14.2014, 76.4021),
      }),
      ev("audit", "Audit inspection, flagged", "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ಗುರುತಿಸಲಾಗಿದೆ", "8 Feb 2029", "Maintenance gaps recorded · 9 photographs", "ನಿರ್ವಹಣೆ ಕೊರತೆ ದಾಖಲು · 9 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, restricted: true,
        images: shots("0431A", "8 Feb 2029", 4, "S. Rangappa, DRFO (retd)", "ಎಸ್. ರಂಗಪ್ಪ, ಡಿಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", "AUD-CTD-014", 14.2016, 76.4019),
      }),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "28 Jul 2027", "16 photographs", "16 ಛಾಯಾಚಿತ್ರಗಳು", {
        cadreEn: AGENCY_EN, cadreKn: AGENCY_KN, publicVisible: true,
        images: shots("0431P", "28 Jul 2027", 3, "Malnad Green Trust field team", "ಮಲೆನಾಡು ಗ್ರೀನ್ ಟ್ರಸ್ಟ್ ಕ್ಷೇತ್ರ ತಂಡ", "FLD-CTD-207", 14.2015, 76.4020),
      }),
    ],
  },
  {
    id: "KA-CTD-HSD-0448",
    district: "Chitradurga",
    districtKn: "ಚಿತ್ರದುರ್ಗ",
    taluk: "Hosadurga",
    talukKn: "ಹೊಸದುರ್ಗ",
    areaHa: 3.12,
    plantedOn: "5 Aug 2027",
    verifiedOn: "2 Jun 2027",
    saplings: 1560,
    speciesCount: 9,
    zone: 4,
    survival: 88,
    survivalCountedOn: "17 Mar 2029",
    nextCensus: "Mar 2030",
    status: "active",
    polygon: [
      [64, 30],
      [190, 38],
      [186, 100],
      [70, 92],
    ],
    events: [
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "17 Mar 2029", "21 photographs", "21 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "5 Aug 2027", "31 photographs", "31 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
  {
    id: "KA-CTD-CLK-0126",
    district: "Chitradurga",
    districtKn: "ಚಿತ್ರದುರ್ಗ",
    taluk: "Challakere",
    talukKn: "ಚಳ್ಳಕೆರೆ",
    areaHa: 4.48,
    plantedOn: "19 Jul 2027",
    verifiedOn: "11 May 2027",
    saplings: 2240,
    speciesCount: 6,
    zone: 3,
    survival: 79,
    survivalCountedOn: "21 Mar 2029",
    nextCensus: "Mar 2030",
    status: "flagged",
    polygon: [
      [72, 36],
      [182, 32],
      [188, 94],
      [76, 98],
    ],
    events: [
      ev("canopy", "Canopy indicator diverges from report", "ಮೇಲಾವರಣ ಸೂಚಕ ವರದಿಯಿಂದ ಭಿನ್ನ", "6 Mar 2029", "Sentinel-2 · 11% cloud · audit task raised", "ಸೆಂಟಿನೆಲ್-2 · 11% ಮೋಡ · ಲೆಕ್ಕಪರಿಶೋಧನೆ ಕಾರ್ಯ ಸೃಷ್ಟಿ"),
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "21 Mar 2029", "27 photographs", "27 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "19 Jul 2027", "38 photographs", "38 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
  {
    id: "KA-TUM-SIR-0203",
    district: "Tumakuru",
    districtKn: "ತುಮಕೂರು",
    taluk: "Sira",
    talukKn: "ಸಿರಾ",
    areaHa: 2.75,
    plantedOn: "22 Jul 2027",
    verifiedOn: "14 May 2027",
    saplings: 1375,
    speciesCount: 8,
    zone: 4,
    survival: 94,
    survivalCountedOn: "19 Mar 2029",
    nextCensus: "Mar 2030",
    status: "active",
    polygon: [
      [76, 32],
      [184, 38],
      [178, 98],
      [70, 90],
    ],
    events: [
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "19 Mar 2029", "23 photographs", "23 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "22 Jul 2027", "29 photographs", "29 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
  {
    id: "KA-TUM-PAV-0088",
    district: "Tumakuru",
    districtKn: "ತುಮಕೂರು",
    taluk: "Pavagada",
    talukKn: "ಪಾವಗಡ",
    areaHa: 5.20,
    plantedOn: "30 Jul 2027",
    verifiedOn: "21 May 2027",
    saplings: 2600,
    speciesCount: 5,
    zone: 3,
    survival: 71,
    survivalCountedOn: "23 Mar 2029",
    nextCensus: "Mar 2030",
    status: "flagged",
    polygon: [
      [66, 34],
      [188, 30],
      [192, 96],
      [72, 100],
    ],
    events: [
      ev("audit", "Audit inspection, flagged", "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ಗುರುತಿಸಲಾಗಿದೆ", "2 Apr 2029", "Irrigation gaps recorded · 12 photographs", "ನೀರಾವರಿ ಕೊರತೆ ದಾಖಲು · 12 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "23 Mar 2029", "33 photographs", "33 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "30 Jul 2027", "44 photographs", "44 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
  {
    id: "KA-BLG-BLK-0512",
    district: "Belagavi",
    districtKn: "ಬೆಳಗಾವಿ",
    taluk: "Bailhongal",
    talukKn: "ಬೈಲಹೊಂಗಲ",
    areaHa: 1.92,
    plantedOn: "8 Jul 2027",
    verifiedOn: "2 May 2027",
    saplings: 960,
    speciesCount: 10,
    zone: 8,
    survival: 96,
    survivalCountedOn: "11 Mar 2029",
    nextCensus: "Mar 2030",
    status: "active",
    polygon: [
      [74, 36],
      [180, 34],
      [186, 96],
      [74, 94],
    ],
    events: [
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "11 Mar 2029", "19 photographs", "19 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "8 Jul 2027", "26 photographs", "26 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
  {
    id: "KA-KLB-CTG-0341",
    district: "Kalaburagi",
    districtKn: "ಕಲಬುರಗಿ",
    taluk: "Chittapur",
    talukKn: "ಚಿತ್ತಾಪುರ",
    areaHa: 6.05,
    plantedOn: "2 Aug 2027",
    verifiedOn: "26 May 2027",
    saplings: 3025,
    speciesCount: 6,
    zone: 2,
    survival: 83,
    survivalCountedOn: "26 Mar 2029",
    nextCensus: "Mar 2030",
    status: "active",
    polygon: [
      [68, 32],
      [186, 36],
      [182, 98],
      [72, 94],
    ],
    events: [
      ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", "26 Mar 2029", "41 photographs", "41 ಛಾಯಾಚಿತ್ರಗಳು"),
      ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", "2 Aug 2027", "52 photographs", "52 ಛಾಯಾಚಿತ್ರಗಳು"),
    ],
  },
];


// ---------------------------------------------------------------------------
// Generated fill — deterministic, so every run of the demo looks identical.
// The eight parcels above are hand-authored and carry the demo narrative;
// these exist so district and state aggregates have realistic mass beneath them.
// ---------------------------------------------------------------------------

type TalukSpec = { name: string; kn: string; code: string; n: number };
type DistrictSpec = {
  name: string;
  kn: string;
  code: string;
  zone: number;
  taluks: TalukSpec[];
};

const DISTRICTS: DistrictSpec[] = [
  { name: "Chitradurga", kn: "ಹಿತ್ತಲ", code: "CTD", zone: 4, taluks: [
    { name: "Hiriyur", kn: "ಹಿರಿಯೂರು", code: "HIR", n: 4 },
    { name: "Holalkere", kn: "ಹೊಳಲ್ಕೆರೆ", code: "HLK", n: 3 },
  ]},
  { name: "Tumakuru", kn: "ತುಮಕೂರು", code: "TUM", zone: 5, taluks: [
    { name: "Madhugiri", kn: "ಮಧುಗಿರಿ", code: "MDG", n: 4 },
    { name: "Koratagere", kn: "ಕೊರಟಗೆರೆ", code: "KRT", n: 3 },
  ]},
  { name: "Belagavi", kn: "ಬೆಳಗಾವಿ", code: "BLG", zone: 8, taluks: [
    { name: "Savadatti", kn: "ಸವದತ್ತಿ", code: "SVD", n: 4 },
    { name: "Ramdurg", kn: "ರಾಮದುರ್ಗ", code: "RMD", n: 3 },
  ]},
  { name: "Kalaburagi", kn: "ಕಲಬುರಗಿ", code: "KLB", zone: 2, taluks: [
    { name: "Afzalpur", kn: "ಅಫಜಲಪುರ", code: "AFZ", n: 4 },
    { name: "Aland", kn: "ಆಳಂದ", code: "ALD", n: 3 },
  ]},
  { name: "Ballari", kn: "ಬಳ್ಳಾರಿ", code: "BLR", zone: 3, taluks: [
    { name: "Sandur", kn: "ಸಂಡೂರು", code: "SND", n: 4 },
    { name: "Siruguppa", kn: "ಸಿರುಗುಪ್ಪ", code: "SRG", n: 3 },
  ]},
  { name: "Vijayapura", kn: "ವಿಜಯಪುರ", code: "VJP", zone: 3, taluks: [
    { name: "Indi", kn: "ಇಂಡಿ", code: "IND", n: 4 },
    { name: "Sindagi", kn: "ಸಿಂದಗಿ", code: "SDG", n: 3 },
  ]},
  { name: "Raichur", kn: "ರಾಯಚೂರು", code: "RCR", zone: 2, taluks: [
    { name: "Manvi", kn: "ಮಾನ್ವಿ", code: "MNV", n: 4 },
    { name: "Devadurga", kn: "ದೇವದುರ್ಗ", code: "DVD", n: 3 },
  ]},
  { name: "Chikkamagaluru", kn: "ಚಿಕ್ಕಮಗಳೂರು", code: "CKM", zone: 7, taluks: [
    { name: "Kadur", kn: "ಕಡೂರು", code: "KDR", n: 4 },
    { name: "Tarikere", kn: "ತರೀಕೆರೆ", code: "TRK", n: 3 },
  ]},
  { name: "Hassan", kn: "ಹಾಸನ", code: "HSN", zone: 7, taluks: [
    { name: "Arsikere", kn: "ಅರಸೀಕೆರೆ", code: "ARS", n: 4 },
    { name: "Channarayapatna", kn: "ಚನ್ನರಾಯಪಟ್ಟಣ", code: "CRP", n: 3 },
  ]},
  { name: "Mysuru", kn: "ಮೈಸೂರು", code: "MYS", zone: 6, taluks: [
    { name: "Hunsur", kn: "ಹುಣಸೂರು", code: "HNS", n: 4 },
    { name: "Nanjangud", kn: "ನಂಜನಗೂಡು", code: "NJG", n: 3 },
  ]},
];

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

const MAR = ["9", "11", "13", "16", "18", "21", "24", "26"];
const JUL = ["6", "11", "16", "21", "26", "31"];

function makeParcel(d: DistrictSpec, t: TalukSpec, i: number): Parcel {
  const id = `KA-${d.code}-${t.code}-${String(100 + i * 37 + (d.code.charCodeAt(0) % 40)).padStart(4, "0")}`;
  const r = seeded(id);
  const areaHa = Math.round((0.8 + r() * 5.6) * 100) / 100;
  const saplings = Math.round(areaHa * 500);
  const roll = r();
  const survival =
    roll < 0.08 ? 58 + Math.floor(r() * 10)
    : roll < 0.22 ? 70 + Math.floor(r() * 6)
    : 80 + Math.floor(r() * 18);
  const status: Status =
    survival < 68 ? "rectification" : survival < 80 ? "flagged" : "active";
  const plantedOn = `${JUL[Math.floor(r() * JUL.length)]} Jul 2027`;
  const countedOn = `${MAR[Math.floor(r() * MAR.length)]} Mar 2029`;
  const lat = 13.4 + r() * 3.6;
  const lng = 75.4 + r() * 2.6;
  const dev = `${d.code}-${String(i + 1).padStart(3, "0")}`;

  const events: EvidenceEvent[] = [];
  if (status === "rectification") {
    events.push(ev("escalation", "Escalated to district command", "ಜಿಲ್ಲಾ ನಿಯಂತ್ರಣಕ್ಕೆ ಉನ್ನತೀಕರಿಸಲಾಗಿದೆ", "2 May 2029", "Rectification deadline passed", "ಸರಿಪಡಿಸುವಿಕೆ ಗಡುವು ಮೀರಿದೆ"));
  }
  const cPhotos = 10 + Math.floor(r() * 24);
  events.push(ev("census", "Survival census, two signatures", "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ", countedOn, `${survival}% · ${cPhotos} photographs`, `${survival}% · ${cPhotos} ಛಾಯಾಚಿತ್ರಗಳು`, {
    cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, publicVisible: true,
    images: shots(`${d.code}${t.code}${i}C`, countedOn, 3, `Audit officer, ${t.name}`, `ಲೆಕ್ಕಪರಿಶೋಧನಾ ಅಧಿಕಾರಿ, ${t.kn}`, `AUD-${dev}`, lat, lng),
  }));
  if (status !== "active") {
    events.push(ev("audit", "Audit inspection, flagged", "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ಗುರುತಿಸಲಾಗಿದೆ", "12 Feb 2029", "Maintenance gaps recorded", "ನಿರ್ವಹಣೆ ಕೊರತೆ ದಾಖಲು", {
      cadreEn: AUDIT_CADRE_EN, cadreKn: AUDIT_CADRE_KN, restricted: true,
      images: shots(`${d.code}${t.code}${i}A`, "12 Feb 2029", 3, `Audit officer, ${t.name}`, `ಲೆಕ್ಕಪರಿಶೋಧನಾ ಅಧಿಕಾರಿ, ${t.kn}`, `AUD-${dev}`, lat, lng),
    }));
  }
  const pPhotos = 14 + Math.floor(r() * 30);
  events.push(ev("planting", "Planting recorded", "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ", plantedOn, `${pPhotos} photographs`, `${pPhotos} ಛಾಯಾಚಿತ್ರಗಳು`, {
    cadreEn: AGENCY_EN, cadreKn: AGENCY_KN, publicVisible: true,
    images: shots(`${d.code}${t.code}${i}P`, plantedOn, 3, "Implementing agency field team", "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ ಕ್ಷೇತ್ರ ತಂಡ", `FLD-${dev}`, lat, lng),
  }));

  return {
    id,
    district: d.name, districtKn: d.kn,
    taluk: t.name, talukKn: t.kn,
    areaHa, plantedOn,
    verifiedOn: "May 2027",
    saplings,
    speciesCount: 5 + Math.floor(r() * 6),
    zone: d.zone,
    survival,
    survivalCountedOn: countedOn,
    nextCensus: "Mar 2030",
    status,
    rectification: status === "rectification" ? {
      ownerEn: `Implementing agency — ${t.name} cluster`,
      ownerKn: `ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ — ${t.kn} ಕ್ಲಸ್ಟರ್`,
      deadline: "30 Apr 2029",
      overdueDays: 12 + Math.floor(r() * 50),
      reasonEn: "Casualty replacement not completed after census shortfall",
      reasonKn: "ಗಣತಿಯಲ್ಲಿ ಕೊರತೆ ಕಂಡ ನಂತರ ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಪೂರ್ಣಗೊಂಡಿಲ್ಲ",
    } : undefined,
    polygon: [[70, 34], [184, 38], [180, 96], [74, 92]],
    events,
  };
}

const GENERATED: Parcel[] = DISTRICTS.flatMap((d) =>
  d.taluks.flatMap((t) => Array.from({ length: t.n }, (_, i) => makeParcel(d, t, i))),
);


// ---------------------------------------------------------------------------
// Provenance for the planted cohort.
//
// These parcels were verified and approved in the 2027 cycle. The full walk,
// survey and plan records for them sit in the programme archive; what is kept
// here is the chain of responsibility, so any planted parcel can be traced back
// to the department that offered it and the officer who walked it.
// ---------------------------------------------------------------------------

const PROV_DEPTS: [string, string][] = [
  ["Karnataka Forest Department", "ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ"],
  ["Revenue Department", "ಕಂದಾಯ ಇಲಾಖೆ"],
  ["Minor Irrigation Department", "ಸಣ್ಣ ನೀರಾವರಿ ಇಲಾಖೆ"],
  ["Gram Panchayat", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ"],
  ["Public Works Department", "ಲೋಕೋಪಯೋಗಿ ಇಲಾಖೆ"],
];

/**
 * The verification cadre is posted by taluk: two officers to each, and an
 * officer verifies only in the taluk they are posted to. So the officer named
 * on a parcel is derived from that parcel's taluk, and their rank stays fixed —
 * a DFO reading this would notice at once if a Hosadurga officer appeared on a
 * Ballari parcel, or if the same person changed rank between screens.
 */
const CADRE_NAMES = [
  "N. Basavaraj", "P. Shivakumar", "A. Nagaveni", "T. Girish",
  "V. Mallikarjun", "D. Chandrashekar", "L. Vijayalakshmi", "C. Ramesh",
  "J. Prakash", "U. Savitha", "Y. Halappa", "E. Sridhar",
  "F. Ibrahim Sab", "Q. Yashodha", "W. Kotresh", "Z. Anantha",
  "S. Netravathi", "B. Lokesh", "H. Rudramma", "G. Puttaswamy",
  "M. Sharanappa", "K. Bhagyamma", "R. Sangappa", "S. Meenakshi",
  "N. Hanumanthappa", "P. Jyothi", "A. Veeresh", "T. Kamala",
  "V. Somashekar", "D. Renuka", "L. Basanagouda", "C. Padmavathi",
  "J. Nagaraj", "U. Shobha", "Y. Chennabasappa", "E. Lalitha",
  "F. Mahadevappa", "Q. Sunanda", "W. Siddappa", "Z. Roopa",
  "S. Gangadhar", "B. Vasantha", "H. Muniyappa", "G. Indira",
];

/**
 * The four taluks the verification module covers have named officers there;
 * the same people must appear here, or the same name turns up in two postings.
 */
const NAMED_POSTINGS: Record<string, [string, string]> = {
  Hosadurga: ["S. Rangappa", "RFO"],
  Challakere: ["H. Thippeswamy", "RFO"],
  Sira: ["M. Latha", "RFO"],
  Savadatti: ["R. Patil", "RFO"],
};

/**
 * One officer per taluk, assigned by position rather than by hash so that no
 * name can land in two postings. Taluks are sorted first, so the assignment is
 * stable whatever order the parcels arrive in.
 */
const POSTING = new Map<string, { en: string; kn: string }>();

function assignPostings(taluks: string[]) {
  let next = 0;
  [...new Set(taluks)].sort().forEach((t) => {
    const named = NAMED_POSTINGS[t];
    if (named) {
      const [n, rk] = named;
      POSTING.set(t, {
        en: `${n}, ${rk} (retd) — ${t}`,
        kn: `${n}, ${rk === "RFO" ? "ಆರ್‌ಎಫ್‌ಒ" : "ಡಿಆರ್‌ಎಫ್‌ಒ"} (ನಿವೃತ್ತ) — ${t}`,
      });
      return;
    }
    const name = CADRE_NAMES[next % CADRE_NAMES.length];
    const rank = next % 2 === 0 ? "RFO" : "DRFO";
    next += 1;
    POSTING.set(t, {
      en: `${name}, ${rank} (retd) — ${t}`,
      kn: `${name}, ${rank === "RFO" ? "ಆರ್‌ಎಫ್‌ಒ" : "ಡಿಆರ್‌ಎಫ್‌ಒ"} (ನಿವೃತ್ತ) — ${t}`,
    });
  });
}

function cadreForTaluk(taluk: string): { en: string; kn: string } {
  return POSTING.get(taluk) ?? { en: `Verification officer — ${taluk}`, kn: `ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ — ${taluk}` };
}

/**
 * Camera stations, for the before-and-after comparison.
 *
 * A station has to be a thing an officer can find again in three years without
 * the app — a survey peg, a boundary stone, a rock. "Twenty metres north of the
 * gate" is a description, not a station, and the next officer will stand
 * somewhere else.
 */
const STATIONS: [string, string][] = [
  ["the survey peg at the north-west corner", "ವಾಯುವ್ಯ ಮೂಲೆಯ ಸರ್ವೆ ಗೂಟ"],
  ["the boundary stone beside the cart track", "ಗಾಡಿ ದಾರಿಯ ಪಕ್ಕದ ಗಡಿ ಕಲ್ಲು"],
  ["the rock outcrop on the eastern edge", "ಪೂರ್ವ ಅಂಚಿನ ಬಂಡೆ"],
  ["the electricity pole at the entrance", "ಪ್ರವೇಶದ್ವಾರದ ವಿದ್ಯುತ್ ಕಂಬ"],
  ["the old tamarind at the southern boundary", "ದಕ್ಷಿಣ ಗಡಿಯ ಹಳೆಯ ಹುಣಸೆ ಮರ"],
  ["the tank bund at the north end", "ಉತ್ತರ ತುದಿಯ ಕೆರೆ ಏರಿ"],
];

const BEARINGS: [string, string][] = [
  ["north-east", "ಈಶಾನ್ಯ"], ["south-east", "ಆಗ್ನೇಯ"],
  ["north-west", "ವಾಯುವ್ಯ"], ["south-west", "ನೈಋತ್ಯ"],
  ["north", "ಉತ್ತರ"], ["east", "ಪೂರ್ವ"],
];

function provenance(p: Parcel, i: number): Parcel {
  const r = seeded(p.id + "prov");
  const [dEn, dKn] = PROV_DEPTS[Math.floor(r() * PROV_DEPTS.length)];
  const code = p.id.split("-").slice(1, 3).join("-");
  const officer = cadreForTaluk(p.taluk);
  return {
    ...p,
    offerRef: `OFR-${code}-${String(1 + (i * 13) % 900).padStart(4, "0")}`,
    deptEn: dEn,
    deptKn: dKn,
    verifiedByEn: officer.en,
    verifiedByKn: officer.kn,
    planApprovedOn: `${["12", "19", "26"][Math.floor(r() * 3)]} ${["Mar", "Apr", "May"][Math.floor(r() * 3)]} 2027`,
    season: "Monsoon 2027",
    // Every parcel carries a comparison, built from dates it already holds
    // rather than invented: the before frame is the verification visit, the
    // after frame the survival census. Without this the wipe appeared only on
    // a parcel created live in the session, so a component that exists on
    // every public record was visible on none of them.
    //
    // Both halves render as drawn frames until a photograph is placed at
    // /public/evidence/<location-id>-before.jpg. That is the truthful state for
    // year-one land, and it is the reason the drawn frames were built.
    sitePair: {
      locationId: p.id,
      station: STATIONS[Math.floor(r() * STATIONS.length)][0],
      bearing: BEARINGS[Math.floor(r() * BEARINGS.length)][0],
      beforeLabelEn: "Before — at verification",
      beforeLabelKn: "ಮೊದಲು — ಪರಿಶೀಲನೆಯ ವೇಳೆ",
      beforeDate: p.verifiedOn,
      afterLabelEn: "After — at the survival census",
      afterLabelKn: "ನಂತರ — ಉಳಿವಿನ ಗಣತಿಯ ವೇಳೆ",
      afterDate: p.survivalCountedOn,
      afterKind: "canopy" as const,
    },
  };
}

const RAW_PARCELS: Parcel[] = [...PARCELS, ...GENERATED];
assignPostings(RAW_PARCELS.map((p) => p.taluk));

/**
 * A village for each site, from the list the programme supplied.
 *
 * Assigned in order within the taluk rather than at random, so a site keeps the
 * same village across reloads — and across two people's screens in the same
 * meeting, which is the case that would actually embarrass anyone.
 *
 * A village names a site; it does not locate it. There is still no coordinate
 * in the register, so the map continues to seat a site inside its taluk and
 * says as much on screen.
 */
function withVillages(list: Parcel[]): Parcel[] {
  const used = new Map<string, number>();
  return list.map((p) => {
    const names = VILLAGES[p.taluk];
    if (!names?.length) return p;
    const i = used.get(p.taluk) ?? 0;
    used.set(p.taluk, i + 1);
    return { ...p, village: names[i % names.length] };
  });
}

export const ALL_PARCELS: Parcel[] = withVillages(RAW_PARCELS.map(provenance));

/**
 * Where a site is, written the same way on every screen.
 *
 * This was five separate template literals in five files, which is how a
 * village ends up on the public record and missing from the console — and a
 * committee member who sees a place on one screen and a code on the next
 * reasonably wonders which is the real system. One function, one form of
 * words: village, taluk, district.
 *
 * The village falls away silently where a site has none, so this stays correct
 * for sites registered before villages were captured.
 */
export function placeOf(p: Parcel, lang: "en" | "kn", talukWord: string): string {
  const village = lang === "en" ? p.village : (p.villageKn ?? p.village);
  const taluk = lang === "en" ? p.taluk : p.talukKn;
  const district = lang === "en" ? p.district : p.districtKn;
  return `${village ? `${village}, ` : ""}${taluk} ${talukWord}, ${district}`;
}

export const TOTAL_TALUKS = new Set(
  ALL_PARCELS.map((p) => `${p.district}/${p.taluk}`),
).size;

/** Non-active first, then lowest survival — what needs an officer, at the top. */
export function byAttention(list: Parcel[]): Parcel[] {
  const rank = { rectification: 0, flagged: 1, active: 2 } as const;
  return [...list].sort(
    (a, b) => rank[a.status] - rank[b.status] || a.survival - b.survival,
  );
}

export type Role = {
  key: string;
  titleEn: string;
  titleKn: string;
  scopeEn: string;
  scopeKn: string;
  level: "state" | "district" | "taluk";
  district?: string;
  taluk?: string;
};

function slug(x: string): string {
  return x.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Roles are derived from the register, so every officer in the picker has parcels. */
function buildRoles(): Role[] {
  const districts = new Map<string, string>();
  const taluks = new Map<string, { kn: string; district: string; districtKn: string }>();

  for (const p of ALL_PARCELS) {
    districts.set(p.district, p.districtKn);
    if (!taluks.has(p.taluk))
      taluks.set(p.taluk, { kn: p.talukKn, district: p.district, districtKn: p.districtKn });
  }

  const rfos: Role[] = [...taluks.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, t]) => ({
      key: `taluk-${slug(name)}`,
      titleEn: `RFO, ${name}`,
      titleKn: `ಆರ್‌ಎಫ್‌ಒ, ${t.kn}`,
      scopeEn: `${name} taluk only`,
      scopeKn: `${t.kn} ತಾಲ್ಲೂಕು ಮಾತ್ರ`,
      level: "taluk" as const,
      district: t.district,
      taluk: name,
    }));

  const dfos: Role[] = [...districts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, kn]) => ({
      key: `district-${slug(name)}`,
      titleEn: `DFO, ${name}`,
      titleKn: `ಡಿಎಫ್‌ಒ, ${kn}`,
      scopeEn: `All taluks in ${name}`,
      scopeKn: `${kn} ಜಿಲ್ಲೆಯ ಎಲ್ಲಾ ತಾಲ್ಲೂಕುಗಳು`,
      level: "district" as const,
      district: name,
    }));

  const state: Role = {
    key: "state",
    titleEn: "State command, KSLSA · IAFT PMU",
    titleKn: "ರಾಜ್ಯ ನಿಯಂತ್ರಣ, ಕೆಎಸ್‌ಎಲ್‌ಎಸ್‌ಎ · ಐಎಎಫ್‌ಟಿ",
    scopeEn: "All 35 districts",
    scopeKn: "ಎಲ್ಲಾ 35 ಜಿಲ್ಲೆಗಳು",
    level: "state",
  };

  return [...rfos, ...dfos, state];
}

export const ROLES: Role[] = buildRoles();
export const DEFAULT_ROLE_KEY = "taluk-hosadurga";

export function scopedParcels(role: Role): Parcel[] {
  if (role.level === "state") return ALL_PARCELS;
  if (role.level === "district")
    return ALL_PARCELS.filter((p) => p.district === role.district);
  return ALL_PARCELS.filter((p) => p.taluk === role.taluk);
}

export function getParcel(id: string): Parcel | undefined {
  return ALL_PARCELS.find((p) => p.id === id);
}

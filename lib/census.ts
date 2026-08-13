// Census, audit and rectification.
//
// A programme that only records planting proves nothing. What it claims is that
// trees are alive in year three, and that claim rests on two things the earlier
// modules cannot supply: a count made on the ground, and someone independent
// checking that count.
//
// §7.3 is the rule that matters here. The audit cadre is separately constituted,
// and an officer may never audit a parcel they themselves verified. The rule is
// enforced at parcel level, not at roster level — a person can sit on both
// rosters and still be refused for the one parcel where they walked the boundary.

import { CADRE } from "@/lib/offers";
import type { Species } from "@/lib/species";

export type AuditOfficer = {
  key: string;
  en: string;
  kn: string;
  district: string;
  taluk: string;
  /** Set where this person also serves on the verification cadre. */
  alsoVerifies?: string;
};

/**
 * Separately constituted from the verification cadre. Two of these officers also
 * sit on the verification roster — which is permitted, and precisely why the rule
 * has to bite at parcel level rather than at roster level.
 */
export const AUDIT_CADRE: AuditOfficer[] = [
  { key: "a-hsd-1", en: "T. Basavarajappa, ACF (retd)", kn: "ಟಿ. ಬಸವರಾಜಪ್ಪ, ಎಸಿಎಫ್ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Hosadurga" },
  { key: "a-hsd-2", en: "S. Rangappa, RFO (retd)", kn: "ಎಸ್. ರಂಗಪ್ಪ, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Hosadurga", alsoVerifies: "hsd-1" },
  { key: "a-clk-1", en: "P. Shantamma, ACF (retd)", kn: "ಪಿ. ಶಾಂತಮ್ಮ, ಎಸಿಎಫ್ (ನಿವೃತ್ತ)", district: "Chitradurga", taluk: "Challakere" },
  { key: "a-sir-1", en: "N. Chandrappa, ACF (retd)", kn: "ಎನ್. ಚಂದ್ರಪ್ಪ, ಎಸಿಎಫ್ (ನಿವೃತ್ತ)", district: "Tumakuru", taluk: "Sira" },
  { key: "a-sir-2", en: "M. Latha, RFO (retd)", kn: "ಎಂ. ಲತಾ, ಆರ್‌ಎಫ್‌ಒ (ನಿವೃತ್ತ)", district: "Tumakuru", taluk: "Sira", alsoVerifies: "sir-1" },
  { key: "a-svd-1", en: "V. Shivanand, ACF (retd)", kn: "ವಿ. ಶಿವಾನಂದ್, ಎಸಿಎಫ್ (ನಿವೃತ್ತ)", district: "Belagavi", taluk: "Savadatti" },
];

/**
 * May this officer audit this parcel? Not if they walked its boundary.
 * The parcel's verifying officer is the test, never the roster.
 */
export function mayAudit(officer: AuditOfficer, verifiedByKey: string | undefined): boolean {
  if (!officer.alsoVerifies) return true;
  return officer.alsoVerifies !== verifiedByKey;
}

export function verifierName(key: string | undefined): string {
  return CADRE.find((c) => c.key === key)?.en ?? "";
}

export type CensusLine = {
  species: Species;
  planted: number;
  surviving: number;
};

export type Census = {
  locationId: string;
  countedOn: string;
  cycle: string;                // which annual count this is
  agencyEn: string;
  agencyKn: string;
  auditOfficerEn: string;       // the census carries two signatures
  auditOfficerKn: string;
  lines: CensusLine[];
  planted: number;
  surviving: number;
  survival: number;             // computed, never entered
  photographs: number;
  notesEn: string;
  notesKn: string;
  isNew?: boolean;
};

export type Audit = {
  locationId: string;
  inspectedOn: string;
  officerKey: string;
  officerEn: string;
  officerKn: string;
  decision: "cleared" | "flagged";
  findingEn?: string;
  findingKn?: string;
  photographs: number;
  isNew?: boolean;
};

export type Rectification = {
  locationId: string;
  raisedOn: string;
  reasonEn: string;
  reasonKn: string;
  ownerEn: string;
  ownerKn: string;
  deadline: string;
  state: "open" | "closed" | "escalated";
  escalatedToEn?: string;
  closedOn?: string;
  isNew?: boolean;
};

/** The threshold a census is measured against. Held as a parameter, not a constant in logic. */
export const SURVIVAL_THRESHOLD = 75;

export const AUDIT_FINDINGS: [string, string][] = [
  ["Maintenance gaps — weeding and basin work not carried out", "ನಿರ್ವಹಣೆ ಕೊರತೆ — ಕಳೆ ತೆಗೆಯುವಿಕೆ ಮತ್ತು ಪಾತಿ ಕೆಲಸ ಆಗಿಲ್ಲ"],
  ["Irrigation not provided as scheduled", "ನಿಗದಿಯಂತೆ ನೀರಾವರಿ ಒದಗಿಸಿಲ್ಲ"],
  ["Protection failed — grazing damage across the parcel", "ರಕ್ಷಣೆ ವಿಫಲ — ಜಮೀನಿನಾದ್ಯಂತ ಮೇಯಿಸುವಿಕೆಯಿಂದ ಹಾನಿ"],
  ["Count does not reconcile with the census recorded", "ದಾಖಲಾದ ಗಣತಿಯೊಂದಿಗೆ ಎಣಿಕೆ ಹೊಂದುತ್ತಿಲ್ಲ"],
  ["Casualty replacement not carried out after the previous cycle", "ಹಿಂದಿನ ಚಕ್ರದ ನಂತರ ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಆಗಿಲ್ಲ"],
];

export function survivalOf(lines: CensusLine[]): { planted: number; surviving: number; survival: number } {
  const planted = lines.reduce((a, l) => a + l.planted, 0);
  const surviving = lines.reduce((a, l) => a + l.surviving, 0);
  return {
    planted,
    surviving,
    survival: planted ? Math.round((surviving / planted) * 100) : 0,
  };
}

/** A census below threshold raises a rectification against a named owner. */
export function rectificationFor(
  c: Census,
  agencyEn: string,
  agencyKn: string,
  lang: "en" | "kn",
): Rectification | null {
  if (c.survival >= SURVIVAL_THRESHOLD) return null;
  return {
    locationId: c.locationId,
    raisedOn: c.countedOn,
    reasonEn: `Survival at ${c.survival}% — below the ${SURVIVAL_THRESHOLD}% threshold at the ${c.cycle} count. Casualty replacement required.`,
    reasonKn: `${c.cycle} ಗಣತಿಯಲ್ಲಿ ಉಳಿವು ${c.survival}% — ${SURVIVAL_THRESHOLD}% ಮಿತಿಗಿಂತ ಕಡಿಮೆ. ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಅಗತ್ಯ.`,
    ownerEn: agencyEn,
    ownerKn: agencyKn,
    deadline: lang === "en" ? "60 days from the count" : "ಗಣತಿಯಿಂದ 60 ದಿನ",
    state: "open",
  };
}

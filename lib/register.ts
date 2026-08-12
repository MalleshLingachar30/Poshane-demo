// The programme register — one spine, keyed by Location ID.
//
// A 2026–2034 programme is never at a single stage. At any moment some parcels
// are planted and under survival monitoring, some are approved and waiting for
// the next monsoon, and some are still in verification. The mistake would be to
// report them as one number, or to keep them in two systems that never meet.
//
// Everything here is a view over records that already exist. Nothing is
// duplicated, and the two cohorts are counted separately because they are
// separately true.

import { ALL_PARCELS, type Parcel } from "@/lib/data";
import type { Offer, Verification } from "@/lib/offers";
import type { Ssp } from "@/lib/ssp";

export type Stage =
  | "offered"      // a department has offered it; nothing checked
  | "verifying"    // assigned to a cadre officer, or walked and awaiting comparison
  | "notAccepted"  // the officer did not accept it
  | "approved"     // Location ID issued, plan approved, awaiting the planting season
  | "planted";     // in the ground and under survival monitoring

export type RegisterEntry = {
  key: string;              // Location ID once issued, offer reference before that
  locationId?: string;
  offerRef?: string;
  stage: Stage;
  district: string;
  taluk: string;
  village?: string;
  season: string;
  areaHa: number;
  deptEn?: string;
  survival?: number;
};

export const STAGE_LABEL: Record<Stage, { en: string; kn: string }> = {
  offered:     { en: "Offered", kn: "ನೀಡಲಾಗಿದೆ" },
  verifying:   { en: "In verification", kn: "ಪರಿಶೀಲನೆಯಲ್ಲಿ" },
  notAccepted: { en: "Not accepted", kn: "ಸ್ವೀಕರಿಸಿಲ್ಲ" },
  approved:    { en: "Approved, awaiting planting", kn: "ಅನುಮೋದಿತ, ನೆಡುವಿಕೆಗೆ ಬಾಕಿ" },
  planted:     { en: "Planted, under monitoring", kn: "ನೆಟ್ಟಿದೆ, ನಿಗಾದಲ್ಲಿ" },
};

/** The season a parcel belongs to, whichever cohort it is in. */
export const PLANTED_SEASON = "Monsoon 2027";
export const PIPELINE_SEASON = "Monsoon 2028";

export function buildRegister(
  offers: Offer[],
  verifications: Verification[],
  plans: Ssp[],
): RegisterEntry[] {
  const planted: RegisterEntry[] = ALL_PARCELS.map((p: Parcel) => ({
    key: p.id,
    locationId: p.id,
    offerRef: p.offerRef,
    stage: "planted",
    district: p.district,
    taluk: p.taluk,
    season: p.season ?? PLANTED_SEASON,
    areaHa: p.areaHa,
    deptEn: p.deptEn,
    survival: p.survival,
  }));

  const pipeline: RegisterEntry[] = offers.map((o) => {
    const v = verifications.find((x) => x.ref === o.ref);
    const stage: Stage =
      v?.locationId ? "approved"
      : v?.decision === "rejected" ? "notAccepted"
      : v ? "verifying"
      : o.state === "assigned" || o.state === "queued" ? "verifying"
      : "offered";
    return {
      key: v?.locationId ?? o.ref,
      locationId: v?.locationId,
      offerRef: o.ref,
      stage,
      district: o.district,
      taluk: o.taluk,
      village: o.village,
      season: PIPELINE_SEASON,
      areaHa: v ? Number(v.offered) || o.offered : o.offered,
      deptEn: o.deptEn,
    };
  });

  return [...planted, ...pipeline];
}

export type Cohort = {
  season: string;
  planted: number;
  approved: number;
  verifying: number;
  offered: number;
  notAccepted: number;
  areaHa: number;
};

export function cohorts(reg: RegisterEntry[]): Cohort[] {
  const bySeason = new Map<string, Cohort>();
  reg.forEach((e) => {
    const c = bySeason.get(e.season) ?? {
      season: e.season, planted: 0, approved: 0, verifying: 0,
      offered: 0, notAccepted: 0, areaHa: 0,
    };
    c[e.stage === "planted" ? "planted"
      : e.stage === "approved" ? "approved"
      : e.stage === "verifying" ? "verifying"
      : e.stage === "notAccepted" ? "notAccepted"
      : "offered"] += 1;
    if (e.stage !== "notAccepted") c.areaHa += e.areaHa;
    bySeason.set(e.season, c);
  });
  return [...bySeason.values()].sort((a, b) => a.season.localeCompare(b.season));
}

/** Taluks where both cohorts are present — the programme visibly in motion. */
export function overlappingTaluks(reg: RegisterEntry[]): string[] {
  const planted = new Set(reg.filter((e) => e.stage === "planted").map((e) => e.taluk));
  const pipeline = new Set(reg.filter((e) => e.stage !== "planted").map((e) => e.taluk));
  return [...planted].filter((t) => pipeline.has(t)).sort();
}

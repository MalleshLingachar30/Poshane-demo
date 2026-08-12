// Site-Specific Plan (SSP) and the nursery raising statement that follows it.
//
// Three records are kept apart, deliberately:
//   verified fact  — what the officer found on the ground
//   plan           — what the platform proposes from it
//   approval       — what IAFT sanctions
//
// The platform proposes; it never decides. Soil, depth and drainage findings
// become notes for the reviewer, never silent exclusions — a scientist removes
// a species, not an algorithm.

import { MODELS, SILVI_ZONES, modelFor, speciesFor, zoneFor, type Species } from "@/lib/species";
import type { Offer, Verification } from "@/lib/offers";

export type SspState = "draft" | "submitted" | "approved" | "returned";

export type SspLine = {
  species: Species;
  count: number;
  included: boolean;
};

export type Ssp = {
  ref: string;              // the offer reference it derives from
  locationId: string;
  district: string;
  taluk: string;
  village: string;
  zoneKey: string;
  modelKey: string;
  areaHa: number;
  lengthKm: number;
  capture: "area" | "line";
  density: number;
  densityUnit: "ha" | "km";
  totalSaplings: number;
  lines: SspLine[];
  notes: { en: string; kn: string }[];   // advisory flags for the reviewer
  state: SspState;
  reviewerEn?: string;
  reviewedOn?: string;
  remarksEn?: string;
  isNew?: boolean;
};

/** The IAFT reviewing team. Approval sits with them, not with the platform. */
export const REVIEWERS = [
  { key: "am", en: "Shri Ajay Mishra — Principal Scientific Advisor, IAFT", kn: "ಶ್ರೀ ಅಜಯ್ ಮಿಶ್ರಾ — ಪ್ರಧಾನ ವೈಜ್ಞಾನಿಕ ಸಲಹೆಗಾರರು, ಐಎಎಫ್‌ಟಿ" },
  { key: "sci1", en: "Scientist, IAFT review team", kn: "ವಿಜ್ಞಾನಿ, ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನಾ ತಂಡ" },
];

/** Casualty replacement margin. Tunable — no programme standard is set yet. */
export const DEFAULT_MARGIN = 10;

/**
 * Builds a draft plan from a verified parcel. Every input is a recorded fact:
 * the district fixes the silvi zone, the land category fixes the model, and the
 * walked area fixes the count. Nothing here is a judgement about species.
 */
export function buildSsp(offer: Offer, v: Verification): Ssp {
  const zoneKey = zoneFor(offer.district);
  const modelKey = modelFor(offer.category);
  const m = MODELS.find((x) => x.key === modelKey)!;
  const area = Number(v.offered) || offer.offered;
  const km = v.walk?.lengthKm ?? 0;
  const list = speciesFor(zoneKey, modelKey);

  // quantity follows the way the ground was measured: hectares for a block or
  // bund planting, kilometres of run for a line
  const total = m.capture === "line"
    ? Math.round(m.density * km)
    : Math.round(m.density * area);

  // even split across the eligible list, rounded to whole saplings
  const per = list.length ? Math.floor(total / list.length) : 0;
  const lines: SspLine[] = list.map((sp, i) => ({
    species: sp,
    count: i === 0 ? total - per * (list.length - 1) : per,
    included: true,
  }));

  const notes: { en: string; kn: string }[] = [];
  if (v.depth === "shallow")
    notes.push({
      en: "Soil recorded as under 30 cm. The reviewer may wish to reconsider deep-rooted species for this parcel.",
      kn: "ಮಣ್ಣು 30 ಸೆಂ.ಮೀ ಗಿಂತ ತೆಳು ಎಂದು ದಾಖಲಾಗಿದೆ. ಆಳ ಬೇರಿನ ಪ್ರಭೇದಗಳನ್ನು ಪರಿಶೀಲಕರು ಮರುಪರಿಶೀಲಿಸಬಹುದು.",
    });
  if (v.drainage === "poor")
    notes.push({
      en: "Poor drainage recorded — waterlogging observed. Species intolerant of standing water may need substitution.",
      kn: "ಕಳಪೆ ಬಸಿತ ದಾಖಲಾಗಿದೆ — ನೀರು ನಿಲ್ಲುತ್ತದೆ. ನೀರು ನಿಲ್ಲುವುದನ್ನು ಸಹಿಸದ ಪ್ರಭೇದಗಳನ್ನು ಬದಲಿಸಬೇಕಾಗಬಹುದು.",
    });
  if (v.soil === "saline")
    notes.push({
      en: "Saline or alkaline soil recorded.",
      kn: "ಲವಣಯುಕ್ತ ಅಥವಾ ಕ್ಷಾರೀಯ ಮಣ್ಣು ದಾಖಲಾಗಿದೆ.",
    });
  if (v.slope === "steep")
    notes.push({
      en: "Steep slope recorded — contour planting and closer spacing may be appropriate.",
      kn: "ಕಡಿದಾದ ಇಳಿಜಾರು ದಾಖಲಾಗಿದೆ — ಸಮೋಚ್ಚ ರೇಖೆಯಲ್ಲಿ ಮತ್ತು ಹತ್ತಿರದ ಅಂತರದಲ್ಲಿ ನೆಡುವುದು ಸೂಕ್ತವಾಗಬಹುದು.",
    });
  if (m.capture === "line" && km === 0)
    notes.push({
      en: "This is a linear planting but no centre-line was traced, so no quantity can be computed. The parcel needs a line trace before the plan is meaningful.",
      kn: "ಇದು ರೇಖೀಯ ನೆಡುವಿಕೆ, ಆದರೆ ಕೇಂದ್ರ ರೇಖೆಯನ್ನು ದಾಖಲಿಸಿಲ್ಲ, ಆದ್ದರಿಂದ ಸಂಖ್ಯೆ ಲೆಕ್ಕಹಾಕಲಾಗದು. ಯೋಜನೆ ಅರ್ಥಪೂರ್ಣವಾಗಲು ರೇಖೆಯ ದಾಖಲೆ ಬೇಕು.",
    });
  if (m.capture === "line" && km > 0)
    notes.push({
      en: `Linear planting — ${km.toFixed(2)} km traced at ${v.walk?.widthM ?? 0} m width. Below the floor for satellite corroboration at any length; assured by ground evidence alone.`,
      kn: `ರೇಖೀಯ ನೆಡುವಿಕೆ — ${v.walk?.widthM ?? 0} ಮೀ ಅಗಲದಲ್ಲಿ ${km.toFixed(2)} ಕಿಮೀ. ಯಾವ ಉದ್ದಕ್ಕೂ ಉಪಗ್ರಹ ಪರಿಶೀಲನೆಗೆ ಸಾಲದು; ನೆಲದ ಸಾಕ್ಷ್ಯದಿಂದ ಮಾತ್ರ ಖಾತ್ರಿ.`,
    });
  if (m.capture === "area" && area < 0.5)
    notes.push({
      en: "Under 0.5 ha — below the floor for satellite corroboration; assured by ground evidence alone.",
      kn: "0.5 ಹೆ.ಗಿಂತ ಕಡಿಮೆ — ಉಪಗ್ರಹ ಪರಿಶೀಲನೆಗೆ ಸಾಲದು; ನೆಲದ ಸಾಕ್ಷ್ಯದಿಂದ ಮಾತ್ರ ಖಾತ್ರಿ.",
    });

  return {
    ref: offer.ref,
    locationId: v.locationId!,
    district: offer.district,
    taluk: offer.taluk,
    village: offer.village,
    zoneKey,
    modelKey,
    areaHa: area,
    lengthKm: km,
    capture: m.capture,
    density: m.density,
    densityUnit: m.densityUnit,
    totalSaplings: total,
    lines,
    notes,
    state: "draft",
  };
}

export const sspTotal = (s: Ssp) =>
  s.lines.filter((l) => l.included).reduce((a, l) => a + l.count, 0);

/** Demand for one district, by species and bag size, from approved plans only. */
export type DemandLine = {
  species: Species;
  bag: string;
  planned: number;
  withMargin: number;
  parcels: number;
  taluks: string[];        // where the demand came from, so it can be raised nearby
};

export type DistrictDemand = {
  district: string;
  zoneEn: string;
  parcels: number;
  planned: number;
  withMargin: number;
  lines: DemandLine[];
};

export function nurseryDemand(plans: Ssp[], marginPct: number): DistrictDemand[] {
  const approved = plans.filter((p) => p.state === "approved");
  const byDistrict = new Map<string, Ssp[]>();
  approved.forEach((p) => {
    const arr = byDistrict.get(p.district) ?? [];
    arr.push(p);
    byDistrict.set(p.district, arr);
  });

  const out: DistrictDemand[] = [];
  for (const [district, ps] of byDistrict) {
    const acc = new Map<string, DemandLine>();
    ps.forEach((p) => {
      const m = MODELS.find((x) => x.key === p.modelKey)!;
      p.lines.filter((l) => l.included).forEach((l) => {
        const key = `${l.species.sci}|${m.bag}`;
        const cur = acc.get(key);
        if (cur) {
          cur.planned += l.count;
          cur.parcels += 1;
          if (!cur.taluks.includes(p.taluk)) cur.taluks.push(p.taluk);
        } else {
          acc.set(key, {
            species: l.species, bag: m.bag, planned: l.count,
            withMargin: 0, parcels: 1, taluks: [p.taluk],
          });
        }
      });
    });
    const lines = [...acc.values()]
      .map((l) => ({ ...l, withMargin: Math.ceil(l.planned * (1 + marginPct / 100)) }))
      .sort((a, b) => b.planned - a.planned);
    const planned = lines.reduce((a, l) => a + l.planned, 0);
    out.push({
      district,
      zoneEn: SILVI_ZONES.find((z) => z.key === zoneFor(district))?.en ?? "",
      parcels: ps.length,
      planned,
      withMargin: lines.reduce((a, l) => a + l.withMargin, 0),
      lines,
    });
  }
  return out.sort((a, b) => b.withMargin - a.withMargin);
}

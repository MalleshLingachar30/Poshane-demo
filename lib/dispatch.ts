// Dispatch and planting — the last two links, and the ones that decide whether
// an approved plan became a fact on the ground.
//
// A plan approved by IAFT names species. A nursery dispatches what it has. An
// agency plants what arrives. Substitution anywhere along that line is the
// easiest way for a plan to quietly become fiction, so every dispatch is checked
// against the approved plan for that Location ID and a departure is flagged —
// not blocked, because there are legitimate reasons, but never silent.

import type { Ssp } from "@/lib/ssp";
import type { Species } from "@/lib/species";

export type DispatchLine = {
  species: Species;
  quantity: number;
  inPlan: boolean;          // was this species in the approved plan for the parcel
};

export type Batch = {
  id: string;               // nursery batch identifier
  locationId: string;
  nurseryName: string;
  bag: string;
  raisedSeason: string;
  dispatchedOn: string;
  receivedByEn: string;
  receivedByKn: string;
  vehicle: string;
  lines: DispatchLine[];
  total: number;
  isNew?: boolean;
};

export type PlantingLine = {
  species: Species;
  dispatched: number;
  planted: number;
};

export type Planting = {
  locationId: string;
  plantedOn: string;
  agencyEn: string;
  agencyKn: string;
  lines: PlantingLine[];
  planted: number;
  dispatched: number;
  pitsDug: number;
  photographs: number;
  tagId: string;            // the tag fixed on the ground, bound to the parcel
  notesEn: string;
  notesKn: string;
  isNew?: boolean;
};

export const AGENCIES: { key: string; en: string; kn: string; district: string }[] = [
  { key: "malnad", en: "Malnad Green Trust", kn: "ಮಲೆನಾಡು ಗ್ರೀನ್ ಟ್ರಸ್ಟ್", district: "Chitradurga" },
  { key: "vanasiri", en: "Vanasiri Foundation", kn: "ವನಶ್ರೀ ಫೌಂಡೇಶನ್", district: "Tumakuru" },
  { key: "malaprabha", en: "Malaprabha Vanikaran Samiti", kn: "ಮಲಪ್ರಭಾ ವನೀಕರಣ ಸಮಿತಿ", district: "Belagavi" },
];

/** Species dispatched but not in the approved plan for that parcel. */
export function offPlan(batch: Batch): DispatchLine[] {
  return batch.lines.filter((l) => !l.inPlan);
}

export function checkAgainstPlan(
  locationId: string,
  lines: { species: Species; quantity: number }[],
  plans: Ssp[],
): DispatchLine[] {
  const plan = plans.find((p) => p.locationId === locationId);
  const approved = new Set(
    (plan?.lines ?? []).filter((l) => l.included).map((l) => l.species.sci),
  );
  return lines.map((l) => ({ ...l, inPlan: approved.has(l.species.sci) }));
}

/** Planted against dispatched, per species — the shortfall that matters. */
export function plantingGap(p: Planting): number {
  return p.dispatched - p.planted;
}

export function seedDispatches(plans: Ssp[]): Batch[] {
  // the earliest approved plans have been dispatched; the rest are still waiting
  const ready = plans.filter((p) => p.state === "approved").slice(0, 4);
  return ready.map((p, i) => {
    const lines: DispatchLine[] = p.lines
      .filter((l) => l.included)
      .slice(0, 4)
      .map((l) => ({ species: l.species, quantity: l.count, inPlan: true }));

    // one batch carries a substitution the nursery made on its own
    if (i === 1 && lines.length > 1) {
      lines[lines.length - 1] = {
        species: { sci: "Casuarina equisetifolia", local: "Casurina" },
        quantity: lines[lines.length - 1].quantity,
        inPlan: false,
      };
    }

    const total = lines.reduce((a, l) => a + l.quantity, 0);
    return {
      id: `BAT-${p.locationId.split("-").slice(1, 3).join("-")}-${String(101 + i * 7)}`,
      locationId: p.locationId,
      nurseryName: `${p.taluk} Range Nursery`,
      bag: '14" × 20"',
      raisedSeason: "Raised 2026–27",
      dispatchedOn: ["8 Jun 2027", "14 Jun 2027", "19 Jun 2027", "27 Jun 2027"][i],
      receivedByEn: `Site supervisor, ${p.village}`,
      receivedByKn: `ಸ್ಥಳ ಮೇಲ್ವಿಚಾರಕ, ${p.village}`,
      vehicle: `KA ${16 + i} B ${4200 + i * 137}`,
      lines,
      total,
    };
  });
}

export function seedPlantings(batches: Batch[]): Planting[] {
  // two of the four dispatched batches have been planted
  return batches.slice(0, 2).map((b, i) => {
    const lines: PlantingLine[] = b.lines.map((l, j) => ({
      species: l.species,
      dispatched: l.quantity,
      // a few casualties in transit and handling, as there always are
      planted: j === 0 ? l.quantity - (i === 0 ? 4 : 11) : l.quantity,
    }));
    const dispatched = lines.reduce((a, l) => a + l.dispatched, 0);
    const planted = lines.reduce((a, l) => a + l.planted, 0);
    const agency = AGENCIES[i % AGENCIES.length];
    return {
      locationId: b.locationId,
      plantedOn: ["3 Jul 2027", "9 Jul 2027"][i],
      agencyEn: agency.en,
      agencyKn: agency.kn,
      lines,
      planted,
      dispatched,
      pitsDug: dispatched,
      photographs: 24 + i * 9,
      tagId: `TAG-${b.locationId.replace("KA-", "")}`,
      notesEn: i === 0
        ? "Planted over two days with the panchayat present. Four seedlings damaged in transit and set aside."
        : "Eleven seedlings arrived wilted and were not planted; replacement requested from the nursery.",
      notesKn: i === 0
        ? "ಪಂಚಾಯಿತಿ ಸಮ್ಮುಖದಲ್ಲಿ ಎರಡು ದಿನಗಳಲ್ಲಿ ನೆಡಲಾಗಿದೆ. ಸಾಗಣೆಯಲ್ಲಿ ನಾಲ್ಕು ಸಸಿ ಹಾಳಾಗಿ ಪಕ್ಕಕ್ಕಿಡಲಾಗಿದೆ."
        : "ಹನ್ನೊಂದು ಸಸಿಗಳು ಬಾಡಿ ಬಂದ ಕಾರಣ ನೆಡಲಿಲ್ಲ; ನರ್ಸರಿಯಿಂದ ಬದಲಿ ಕೋರಲಾಗಿದೆ.",
    };
  });
}

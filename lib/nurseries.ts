// Nursery raising requirement — what each nursery location must raise for this
// programme, and by when.
//
// Two things this module deliberately does NOT do.
//
// It does not draw on existing stock. Seedlings standing in a Forest Department
// nursery today were raised for other schemes — public distribution, departmental
// planting — and are not available to this programme. What we issue is a
// requirement to raise, additional to whatever the nursery already holds.
//
// It does not assume capacity. The department knows its own capacity; we do not.
// The platform states the requirement by location and leaves the decision of
// where to raise it — in-house or through accredited private nurseries — with
// the Forest Department.
//
// The nursery location list is published by KFD through e-Nursery
// (aranya.gov.in/enursery) and the departmental asset register. In production it
// is read from there; the list below is illustrative for the demonstration.

import type { DistrictDemand } from "@/lib/ssp";

export type Nursery = {
  key: string;
  name: string;
  district: string;
  taluk: string;
  division: string;
  serves: string[];      // taluks this nursery location serves
};

export const NURSERIES: Nursery[] = [
  { key: "ctd-hsd", name: "Hosadurga Range Nursery", district: "Chitradurga", taluk: "Hosadurga", division: "Chitradurga Division", serves: ["Hosadurga", "Holalkere"] },
  { key: "ctd-clk", name: "Challakere Range Nursery", district: "Chitradurga", taluk: "Challakere", division: "Chitradurga Division", serves: ["Challakere", "Molakalmuru"] },
  { key: "ctd-hir", name: "Hiriyur Range Nursery", district: "Chitradurga", taluk: "Hiriyur", division: "Chitradurga Division", serves: ["Hiriyur", "Chitradurga"] },

  { key: "tum-sir", name: "Sira Range Nursery", district: "Tumakuru", taluk: "Sira", division: "Tumakuru Division", serves: ["Sira", "Pavagada"] },
  { key: "tum-mdg", name: "Madhugiri Range Nursery", district: "Tumakuru", taluk: "Madhugiri", division: "Tumakuru Division", serves: ["Madhugiri", "Koratagere"] },
  { key: "tum-tum", name: "Tumakuru Division Nursery", district: "Tumakuru", taluk: "Tumakuru", division: "Tumakuru Division", serves: ["Tumakuru", "Gubbi", "Kunigal", "Tiptur"] },

  { key: "blg-svd", name: "Savadatti Range Nursery", district: "Belagavi", taluk: "Savadatti", division: "Belagavi Division", serves: ["Savadatti", "Ramdurg"] },
  { key: "blg-blk", name: "Bailhongal Range Nursery", district: "Belagavi", taluk: "Bailhongal", division: "Belagavi Division", serves: ["Bailhongal", "Khanapur"] },
  { key: "blg-blg", name: "Belagavi Division Nursery", district: "Belagavi", taluk: "Belagavi", division: "Belagavi Division", serves: ["Belagavi", "Hukkeri", "Chikkodi"] },
];

/**
 * Raising lead time by polybag size, in months before planting.
 * Tunable — the Forest Department's nursery manual governs.
 */
export const LEAD_MONTHS: Record<string, number> = {
  '14" × 20"': 14,
  '8" × 12"': 8,
};

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export function sowingMonth(plantingMonthIndex: number, plantingYear: number, lead: number) {
  const total = plantingMonthIndex - lead;
  const yearShift = Math.floor(total / 12);
  const idx = ((total % 12) + 12) % 12;
  return { month: MONTHS[idx], year: plantingYear + yearShift };
}

/** Which nursery location serves a given taluk. */
export function nurseryFor(district: string, taluk: string): Nursery | undefined {
  return (
    NURSERIES.find((n) => n.district === district && n.serves.includes(taluk)) ??
    NURSERIES.find((n) => n.district === district && n.taluk === taluk) ??
    NURSERIES.find((n) => n.district === district)
  );
}

export type RaisingLine = {
  sci: string;
  local: string;
  bag: string;
  quantity: number;
};

export type NurseryRequirement = {
  nursery: Nursery;
  total: number;
  byBag: { bag: string; quantity: number; lines: RaisingLine[] }[];
};

export type DistrictRequirement = {
  district: string;
  total: number;
  nurseries: NurseryRequirement[];
  unassigned: number;      // demand with no nursery location on record
};

/**
 * Turns a district's demand into a raising requirement per nursery location.
 * Demand follows the parcel's taluk to the nursery that serves it.
 */
export function requirementFor(demand: DistrictDemand): DistrictRequirement {
  const perNursery = new Map<string, NurseryRequirement>();
  let unassigned = 0;

  demand.lines.forEach((line) => {
    // a demand line may span several taluks; split it evenly across them
    const taluks = line.taluks;
    const share = taluks.length ? Math.round(line.withMargin / taluks.length) : 0;
    const spread = taluks.length ? taluks : [];

    if (!spread.length) {
      unassigned += line.withMargin;
      return;
    }

    spread.forEach((t, i) => {
      const qty = i === spread.length - 1
        ? line.withMargin - share * (spread.length - 1)
        : share;
      const n = nurseryFor(demand.district, t);
      if (!n) {
        unassigned += qty;
        return;
      }
      const cur = perNursery.get(n.key) ?? { nursery: n, total: 0, byBag: [] };
      cur.total += qty;
      let bag = cur.byBag.find((b) => b.bag === line.bag);
      if (!bag) {
        bag = { bag: line.bag, quantity: 0, lines: [] };
        cur.byBag.push(bag);
      }
      bag.quantity += qty;
      const ex = bag.lines.find((l) => l.sci === line.species.sci);
      if (ex) ex.quantity += qty;
      else bag.lines.push({ sci: line.species.sci, local: line.species.local, bag: line.bag, quantity: qty });
      perNursery.set(n.key, cur);
    });
  });

  const nurseries = [...perNursery.values()].sort((a, b) => b.total - a.total);
  nurseries.forEach((n) => {
    n.byBag.sort((a, b) => b.quantity - a.quantity);
    n.byBag.forEach((b) => b.lines.sort((a, c) => c.quantity - a.quantity));
  });

  return {
    district: demand.district,
    total: nurseries.reduce((a, n) => a + n.total, 0) + unassigned,
    nurseries,
    unassigned,
  };
}

/** The raising requirement as a sheet the Forest Department can work from. */
export function demandCsv(
  reqs: DistrictRequirement[],
  plantingMonth: number,
  plantingYear: number,
  marginPct: number,
): string {
  const esc = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
  const head = [
    "District", "Division", "Nursery location", "Taluk", "Polybag size",
    "Species (botanical)", "Species (local)", "Quantity to raise",
    "Sowing to begin", "Planting season",
  ].map(esc).join(",");

  const rows: string[] = [];
  reqs.forEach((d) => {
    d.nurseries.forEach((n) => {
      n.byBag.forEach((b) => {
        const lead = LEAD_MONTHS[b.bag] ?? 12;
        const sow = sowingMonth(plantingMonth, plantingYear, lead);
        b.lines.forEach((l) => {
          rows.push([
            d.district, n.nursery.division, n.nursery.name, n.nursery.taluk,
            b.bag, l.sci, l.local, l.quantity,
            `${sow.month} ${sow.year}`,
            `${MONTHS[plantingMonth]} ${plantingYear}`,
          ].map(esc).join(","));
        });
      });
    });
    if (d.unassigned > 0) {
      rows.push([
        d.district, "", "— no nursery location on record —", "", "", "", "",
        d.unassigned, "", `${MONTHS[plantingMonth]} ${plantingYear}`,
      ].map(esc).join(","));
    }
  });

  const note = [
    "",
    esc("This is a requirement to raise for the KSLSA programme."),
    esc("It is additional to existing nursery stock, which is committed to other schemes and is not drawn on here."),
    esc(`Casualty replacement margin applied: ${marginPct}%`),
    esc("Raising lead times are tunable pending the Forest Department's nursery manual."),
    esc("Nursery locations in this demonstration are illustrative; production reads the department's e-Nursery location list."),
  ].join("\n");

  return [head, ...rows].join("\n") + "\n" + note;
}

export const MONTH_NAMES = MONTHS;

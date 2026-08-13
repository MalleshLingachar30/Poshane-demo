"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SEED_OFFERS, SEED_VERIFICATIONS, type Offer, type Verification } from "@/lib/offers";
import { buildSsp, type Ssp } from "@/lib/ssp";
import { seedDispatches, seedPlantings, type Batch, type Planting } from "@/lib/dispatch";
import type { Audit, Census, Rectification } from "@/lib/census";
import type { Parcel } from "@/lib/data";
import { SILVI_ZONES } from "@/lib/species";

/**
 * The programme store sits at the root, not inside the intake module, because a
 * parcel planted in the field module has to be visible on the public record —
 * that is the whole point of planting it. Keeping it inside the module left the
 * public pages reading a separate dataset, so a parcel planted a minute earlier
 * appeared nowhere and its tag resolved to nothing.
 *
 * Everything lives for the length of the browser tab. There is no database in
 * this build, so a parcel planted here cannot be served to a second device.
 */
type Store = {
  offers: Offer[];
  verifications: Verification[];
  plans: Ssp[];
  batches: Batch[];
  plantings: Planting[];
  addBatch: (b: Batch) => void;
  addPlanting: (p: Planting) => void;
  addOffer: (o: Offer) => void;
  addVerification: (v: Verification) => void;
  setOfferState: (ref: string, state: Offer["state"]) => void;
  updatePlan: (ref: string, patch: Partial<Ssp>) => void;
  addPlan: (o: Offer, v: Verification) => void;
  censuses: Census[];
  audits: Audit[];
  rectifications: Rectification[];
  addCensus: (c: Census) => void;
  addAudit: (a: Audit) => void;
  addRectification: (r: Rectification) => void;
  closeRectification: (locationId: string, escalate: boolean) => void;
  /** Parcels planted during this session, shaped for the public record. */
  sessionParcels: Parcel[];
};

const StoreCtx = createContext<Store>({
  offers: [], verifications: [], plans: [], batches: [], plantings: [],
  addBatch: () => {}, addPlanting: () => {},
  addOffer: () => {}, addVerification: () => {}, setOfferState: () => {},
  updatePlan: () => {}, addPlan: () => {},
  censuses: [], audits: [], rectifications: [],
  addCensus: () => {}, addAudit: () => {}, addRectification: () => {},
  closeRectification: () => {},
  sessionParcels: [],
});

export const useOffers = () => useContext(StoreCtx);

export function ProgrammeProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [verifications, setVerifications] = useState<Verification[]>(SEED_VERIFICATIONS);

  const [plans, setPlans] = useState<Ssp[]>(() => {
    const seeded = SEED_VERIFICATIONS
      .filter((v) => v.locationId)
      .map((v) => {
        const o = SEED_OFFERS.find((x) => x.ref === v.ref)!;
        return buildSsp(o, v);
      });
    return seeded.map((p, i) => ({
      ...p,
      state: i % 5 === 4 ? "submitted" : i % 7 === 3 ? "returned" : "approved",
      reviewerEn: i % 5 === 4 ? undefined : "Shri Ajay Mishra — Principal Scientific Advisor, IAFT",
      reviewedOn: i % 5 === 4 ? undefined : "4 Jul 2026",
      remarksEn: i % 7 === 3
        ? "Shallow soil recorded. Substitute the deep-rooted species before resubmission."
        : undefined,
    }));
  });

  const [batches, setBatches] = useState<Batch[]>([]);
  const [plantings, setPlantings] = useState<Planting[]>([]);

  useEffect(() => {
    if (batches.length === 0 && plans.length > 0) {
      const seeded = seedDispatches(plans);
      setBatches(seeded);
      setPlantings(seedPlantings(seeded));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans.length]);


  const addOffer = (o: Offer) => setOffers((xs) => [{ ...o, isNew: true }, ...xs]);
  const addVerification = (v: Verification) =>
    setVerifications((xs) => [{ ...v, isNew: true }, ...xs.filter((x) => x.ref !== v.ref)]);
  const setOfferState = (ref: string, state: Offer["state"]) =>
    setOffers((xs) => xs.map((x) => (x.ref === ref ? { ...x, state } : x)));
  const updatePlan = (ref: string, patch: Partial<Ssp>) =>
    setPlans((xs) => xs.map((x) => (x.ref === ref ? { ...x, ...patch } : x)));
  const addPlan = (o: Offer, v: Verification) =>
    setPlans((xs) => [{ ...buildSsp(o, v), isNew: true }, ...xs.filter((x) => x.ref !== o.ref)]);
  const addBatch = (b: Batch) =>
    setBatches((xs) => [{ ...b, isNew: true }, ...xs.filter((x) => x.id !== b.id)]);
  const addPlanting = (p: Planting) =>
    setPlantings((xs) => [{ ...p, isNew: true }, ...xs.filter((x) => x.locationId !== p.locationId)]);

  const [censuses, setCensuses] = useState<Census[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [rectifications, setRectifications] = useState<Rectification[]>([]);

  const addCensus = (c: Census) =>
    setCensuses((xs) => [{ ...c, isNew: true }, ...xs.filter((x) => x.locationId !== c.locationId)]);
  const addAudit = (a: Audit) =>
    setAudits((xs) => [{ ...a, isNew: true }, ...xs.filter((x) => x.locationId !== a.locationId)]);
  const addRectification = (r: Rectification) =>
    setRectifications((xs) => [{ ...r, isNew: true }, ...xs.filter((x) => x.locationId !== r.locationId)]);
  const closeRectification = (locationId: string, escalate: boolean) =>
    setRectifications((xs) => xs.map((x) => x.locationId === locationId
      ? {
          ...x,
          state: escalate ? "escalated" : "closed",
          escalatedToEn: escalate ? "District command — DFO" : undefined,
          closedOn: escalate ? undefined : "today",
        }
      : x));

  /**
   * A planted parcel, assembled from the records that produced it. Survival is
   * deliberately absent — nothing has been counted yet, and showing a figure
   * before the first census would be an invention.
   */
  const sessionParcels: Parcel[] = plantings.map((pl) => {
    const plan = plans.find((p) => p.locationId === pl.locationId);
    const v = verifications.find((x) => x.locationId === pl.locationId);
    const o = offers.find((x) => x.ref === v?.ref);
    const batch = batches.find((b) => b.locationId === pl.locationId);
    const census = censuses.find((c) => c.locationId === pl.locationId);
    const audit = audits.find((a) => a.locationId === pl.locationId);
    const rect = rectifications.find((r) => r.locationId === pl.locationId && r.state !== "closed");

    // the evidence timeline, from the records that actually produced it
    const events = [
      ...(census ? [{
        kind: "census" as const,
        labelEn: "Survival census, two signatures",
        labelKn: "ಉಳಿವಿನ ಗಣತಿ, ಎರಡು ಸಹಿ",
        date: census.countedOn,
        metaEn: `${census.survival}% — ${census.surviving.toLocaleString("en-IN")} of ${census.planted.toLocaleString("en-IN")} · ${census.photographs} photographs`,
        metaKn: `${census.survival}% — ${census.planted.toLocaleString("en-IN")} ರಲ್ಲಿ ${census.surviving.toLocaleString("en-IN")} · ${census.photographs} ಛಾಯಾಚಿತ್ರಗಳು`,
        cadreEn: "Audit cadre — independent",
        cadreKn: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಳ — ಸ್ವತಂತ್ರ",
        publicVisible: true,
      }] : []),
      ...(audit ? [{
        kind: "audit" as const,
        labelEn: audit.decision === "cleared" ? "Audit inspection, cleared" : "Audit inspection, flagged",
        labelKn: audit.decision === "cleared" ? "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ತೀರುವಳಿ" : "ಲೆಕ್ಕಪರಿಶೋಧನೆ, ಗುರುತಿಸಲಾಗಿದೆ",
        date: audit.inspectedOn,
        metaEn: `${audit.officerEn} · ${audit.photographs} photographs`,
        metaKn: `${audit.officerKn} · ${audit.photographs} ಛಾಯಾಚಿತ್ರಗಳು`,
        cadreEn: "Audit cadre — independent",
        cadreKn: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಳ — ಸ್ವತಂತ್ರ",
        restricted: audit.decision === "flagged",
      }] : []),
      {
        kind: "planting" as const,
        labelEn: "Planting recorded",
        labelKn: "ನೆಡುವಿಕೆ ದಾಖಲಾಗಿದೆ",
        date: pl.plantedOn,
        metaEn: `${pl.planted.toLocaleString("en-IN")} planted by ${pl.agencyEn} · ${pl.photographs} photographs`,
        metaKn: `${pl.agencyKn} ${pl.planted.toLocaleString("en-IN")} ನೆಟ್ಟಿದೆ · ${pl.photographs} ಛಾಯಾಚಿತ್ರಗಳು`,
        cadreEn: "Implementing agency",
        cadreKn: "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ",
        publicVisible: true,
      },
      ...(batch ? [{
        kind: "verification" as const,
        labelEn: "Seedlings received from the nursery",
        labelKn: "ನರ್ಸರಿಯಿಂದ ಸಸಿಗಳು ಸ್ವೀಕೃತ",
        date: batch.dispatchedOn,
        metaEn: `${batch.total.toLocaleString("en-IN")} in ${batch.bag} from ${batch.nurseryName} · batch ${batch.id}`,
        metaKn: `${batch.nurseryName} ಇಂದ ${batch.bag} ನಲ್ಲಿ ${batch.total.toLocaleString("en-IN")} · ಬ್ಯಾಚ್ ${batch.id}`,
      }] : []),
      ...(v ? [{
        kind: "verification" as const,
        labelEn: "Land verified and Location ID issued",
        labelKn: "ಭೂಮಿ ಪರಿಶೀಲಿಸಿ ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗಿದೆ",
        date: v.visitedOn,
        metaEn: `Boundary walked by ${v.officerEn}`,
        metaKn: `${v.officerKn} ಗಡಿ ನಡೆದಿದ್ದಾರೆ`,
      }] : []),
    ];

    // the walked boundary, normalised into the map's own box
    const pts = v?.walk?.points ?? [];
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    const w = xs.length ? Math.max(...xs) - Math.min(...xs) || 1e-6 : 1;
    const h = ys.length ? Math.max(...ys) - Math.min(...ys) || 1e-6 : 1;
    const polygon: [number, number][] = pts.length
      ? pts.map((q) => [
          22 + ((q[0] - Math.min(...xs)) / w) * 216,
          110 - ((q[1] - Math.min(...ys)) / h) * 88,
        ] as [number, number])
      : [[70, 34], [184, 38], [180, 96], [74, 92]];

    return {
      id: pl.locationId,
      district: o?.district ?? plan?.district ?? "",
      districtKn: o?.districtKn ?? "",
      taluk: o?.taluk ?? plan?.taluk ?? "",
      talukKn: o?.talukKn ?? "",
      areaHa: plan?.areaHa ?? (Number(v?.offered) || 0),
      plantedOn: pl.plantedOn,
      verifiedOn: v?.visitedOn ?? "",
      saplings: pl.planted,
      speciesCount: pl.lines.filter((l) => l.planted > 0).length,
      zone: 0,
      zoneLabel: SILVI_ZONES.find((z) => z.key === plan?.zoneKey)?.en,
      survival: census?.survival ?? 0,
      survivalCountedOn: census?.countedOn ?? "",
      // annual cycle: the first count comes the March after planting
      nextCensus: `Mar ${Number((pl.plantedOn.match(/\d{4}/) ?? ["2028"])[0]) + 1}`,
      status: rect ? "rectification" : audit?.decision === "flagged" ? "flagged" : "active",
      rectification: rect ? {
        ownerEn: rect.ownerEn,
        ownerKn: rect.ownerKn,
        deadline: rect.deadline,
        overdueDays: 0,
        reasonEn: rect.reasonEn,
        reasonKn: rect.reasonKn,
      } : undefined,
      offerRef: o?.ref,
      deptEn: o?.deptEn,
      deptKn: o?.deptKn,
      verifiedByEn: v?.officerEn,
      verifiedByKn: v?.officerKn,
      planApprovedOn: plan?.reviewedOn,
      season: "Monsoon 2028",
      events,
      polygon,
      walk: v?.walk,
      sitePair: {
        locationId: pl.locationId,
        bearing: "north-east",
        station: "the survey peg at the north-west corner",
        beforeLabelEn: "Before — at verification",
        beforeLabelKn: "ಮೊದಲು — ಪರಿಶೀಲನೆಯ ವೇಳೆ",
        beforeDate: v?.visitedOn ?? "",
        afterLabelEn: census ? "After — at the survival census" : "After — at planting",
        afterLabelKn: census ? "ನಂತರ — ಉಳಿವಿನ ಗಣತಿಯ ವೇಳೆ" : "ನಂತರ — ನೆಟ್ಟ ವೇಳೆ",
        afterDate: census?.countedOn ?? pl.plantedOn,
        afterKind: census ? "canopy" : "planted",
      },
    } as Parcel;
  });

  return (
    <StoreCtx.Provider value={{
      offers, verifications, plans, batches, plantings,
      addBatch, addPlanting, addOffer, addVerification, setOfferState,
      updatePlan, addPlan,
      censuses, audits, rectifications,
      addCensus, addAudit, addRectification, closeRectification,
      sessionParcels,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

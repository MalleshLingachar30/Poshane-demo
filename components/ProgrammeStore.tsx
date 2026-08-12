"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SEED_OFFERS, SEED_VERIFICATIONS, type Offer, type Verification } from "@/lib/offers";
import { buildSsp, type Ssp } from "@/lib/ssp";
import { seedDispatches, seedPlantings, type Batch, type Planting } from "@/lib/dispatch";
import type { Parcel } from "@/lib/data";

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
  /** Parcels planted during this session, shaped for the public record. */
  sessionParcels: Parcel[];
};

const StoreCtx = createContext<Store>({
  offers: [], verifications: [], plans: [], batches: [], plantings: [],
  addBatch: () => {}, addPlanting: () => {},
  addOffer: () => {}, addVerification: () => {}, setOfferState: () => {},
  updatePlan: () => {}, addPlan: () => {}, sessionParcels: [],
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

  /**
   * A planted parcel, assembled from the records that produced it. Survival is
   * deliberately absent — nothing has been counted yet, and showing a figure
   * before the first census would be an invention.
   */
  const sessionParcels: Parcel[] = plantings.map((pl) => {
    const plan = plans.find((p) => p.locationId === pl.locationId);
    const v = verifications.find((x) => x.locationId === pl.locationId);
    const o = offers.find((x) => x.ref === v?.ref);
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
      survival: 0,
      survivalCountedOn: "",
      nextCensus: "Mar 2029",
      status: "active",
      offerRef: o?.ref,
      deptEn: o?.deptEn,
      deptKn: o?.deptKn,
      verifiedByEn: v?.officerEn,
      verifiedByKn: v?.officerKn,
      planApprovedOn: plan?.reviewedOn,
      season: "Monsoon 2028",
    } as Parcel;
  });

  return (
    <StoreCtx.Provider value={{
      offers, verifications, plans, batches, plantings,
      addBatch, addPlanting, addOffer, addVerification, setOfferState,
      updatePlan, addPlan, sessionParcels,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

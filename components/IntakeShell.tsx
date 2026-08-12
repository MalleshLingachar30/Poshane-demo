"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useDemo } from "@/components/DemoContext";
import { tr, SUBMITTERS, scopeLabel, type Submitter } from "@/lib/intake";
import { SEED_OFFERS, SEED_VERIFICATIONS, type Offer, type Verification } from "@/lib/offers";
import { buildSsp, type Ssp } from "@/lib/ssp";
import { seedDispatches, seedPlantings, type Batch, type Planting } from "@/lib/dispatch";

const SubCtx = createContext<Submitter>(SUBMITTERS[0]);
export const useSubmitter = () => useContext(SubCtx);

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
};
const StoreCtx = createContext<Store>({
  offers: [], verifications: [], plans: [], batches: [], plantings: [],
  addBatch: () => {}, addPlanting: () => {},
  addOffer: () => {}, addVerification: () => {}, setOfferState: () => {},
  updatePlan: () => {}, addPlan: () => {},
});
export const useOffers = () => useContext(StoreCtx);

type NavKey = "navAdd" | "navUpload" | "navRegister" | "navTemplate" | "navRecord" | "navVerifyReg" | "navCompare" | "navPlans" | "navReview" | "navNursery" | "navAllocation" | "navDispatch" | "navPlanting";

const INTAKE_NAV: { href: string; key: NavKey }[] = [
  { href: "/intake", key: "navAdd" },
  { href: "/intake/upload", key: "navUpload" },
  { href: "/intake/register", key: "navRegister" },
  { href: "/intake/template", key: "navTemplate" },
];

const VERIFY_NAV: { href: string; key: NavKey }[] = [
  { href: "/intake/verify", key: "navRecord" },
  { href: "/intake/verified", key: "navVerifyReg" },
  { href: "/intake/compare", key: "navCompare" },
];

const FIELD_NAV: { href: string; key: NavKey }[] = [
  { href: "/intake/dispatch", key: "navDispatch" },
  { href: "/intake/planting", key: "navPlanting" },
];

const PLAN_NAV: { href: string; key: NavKey }[] = [
  { href: "/intake/plans", key: "navPlans" },
  { href: "/intake/review", key: "navReview" },
  { href: "/intake/nursery", key: "navNursery" },
  { href: "/intake/allocation", key: "navAllocation" },
];

export default function IntakeShell({ children }: { children: ReactNode }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const path = usePathname();
  const [key, setKey] = useState(SUBMITTERS[0].key);
  const who = SUBMITTERS.find((s) => s.key === key) ?? SUBMITTERS[0];

  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [verifications, setVerifications] = useState<Verification[]>(SEED_VERIFICATIONS);

  // A plan exists only once a Location ID has been issued. Most arrive already
  // reviewed, so the demand statement below has something real to aggregate.
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

  // seeded once the plans exist, so the registers are not empty on first view
  useEffect(() => {
    if (batches.length === 0 && plans.length > 0) {
      const seeded = seedDispatches(plans);
      setBatches(seeded);
      setPlantings(seedPlantings(seeded));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans.length]);

  const addBatch = (b: Batch) =>
    setBatches((xs) => [{ ...b, isNew: true }, ...xs.filter((x) => x.id !== b.id)]);
  const addPlanting = (p: Planting) =>
    setPlantings((xs) => [{ ...p, isNew: true }, ...xs.filter((x) => x.locationId !== p.locationId)]);

  const updatePlan = (ref: string, patch: Partial<Ssp>) =>
    setPlans((xs) => xs.map((x) => (x.ref === ref ? { ...x, ...patch } : x)));

  const addOffer = (o: Offer) => setOffers((xs) => [{ ...o, isNew: true }, ...xs]);
  const addPlan = (o: Offer, v: Verification) =>
    setPlans((xs) => [{ ...buildSsp(o, v), isNew: true }, ...xs.filter((x) => x.ref !== o.ref)]);
  const addVerification = (v: Verification) =>
    setVerifications((xs) => [{ ...v, isNew: true }, ...xs.filter((x) => x.ref !== v.ref)]);
  const setOfferState = (ref: string, state: Offer["state"]) =>
    setOffers((xs) => xs.map((x) => (x.ref === ref ? { ...x, state } : x)));

  const onIntakeForm = path === "/intake" || path === "/intake/upload";

  // Each section is a different activity, done by a different person.
  const onField = ["/intake/dispatch", "/intake/planting"].includes(path);
  const onPlanning = ["/intake/plans", "/intake/review", "/intake/nursery", "/intake/allocation"].includes(path);
  const onVerification = !onPlanning && !onField && (path.startsWith("/intake/verif") || path === "/intake/compare");

  const heading =
    path === "/intake/plans" ? "hPlans"
    : path === "/intake/review" ? "hReview"
    : path === "/intake/nursery" ? "hNursery"
    : path === "/intake/allocation" ? "hAllocation"
    : path === "/intake/dispatch" ? "hDispatch"
    : path === "/intake/planting" ? "hPlanting"
    : path === "/intake/compare" ? "hCompare"
    : onVerification ? "hVerify" : "hIntake";
  const lede =
    path === "/intake/plans" ? "ledePlans"
    : path === "/intake/review" ? "ledeReview"
    : path === "/intake/nursery" ? "ledeNursery"
    : path === "/intake/allocation" ? "ledeAllocation"
    : path === "/intake/dispatch" ? "ledeDispatch"
    : path === "/intake/planting" ? "ledePlanting"
    : path === "/intake/compare" ? "ledeCompare"
    : onVerification ? "ledeVerify" : "ledeIntake";
  const nav = onField ? FIELD_NAV : onPlanning ? PLAN_NAV : onVerification ? VERIFY_NAV : INTAKE_NAV;
  const navHead = onField ? "grpField" : onPlanning ? "grpPlans" : onVerification ? "grpVerify" : "grpIntake";

  return (
    <StoreCtx.Provider value={{
      offers, verifications, plans, batches, plantings,
      addBatch, addPlanting, addOffer, addVerification, setOfferState, updatePlan, addPlan,
    }}>
      <main>
        <div className="ik-head">
          <h1 className="ik-title">{tr(heading, lang)}</h1>
        </div>

        <p className="ik-lede">{tr(lede, lang)}</p>

        {onIntakeForm && (
          <div className="ik-who">
            <div className="ik-who-row">
              <span className="k">{tr("submittingAs", lang)}</span>
              <select className="ik-who-sel" value={key} onChange={(e) => setKey(e.target.value)}>
                {SUBMITTERS.map((s) => (
                  <option key={s.key} value={s.key}>{en ? s.en : s.kn}</option>
                ))}
              </select>
            </div>
            <div className="ik-who-sub">
              {en ? who.deptEn : who.deptKn} · <strong>{scopeLabel(who, lang)}</strong>
            </div>
          </div>
        )}

        <div className="ik-body">
          <nav className="ik-side">
            <div className="ik-side-group">
              <div className="ik-side-head">{tr(navHead, lang)}</div>
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>
                  {tr(n.key, lang)}
                </Link>
              ))}
            </div>
          </nav>
          <div className="ik-main">
            <SubCtx.Provider value={who}>{children}</SubCtx.Provider>
          </div>
        </div>
      </main>
    </StoreCtx.Provider>
  );
}

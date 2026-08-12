"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from "react";
import { useDemo } from "@/components/DemoContext";
import { tr, SUBMITTERS, scopeLabel, type Submitter } from "@/lib/intake";
import { SEED_OFFERS, SEED_VERIFICATIONS, type Offer, type Verification } from "@/lib/offers";
import { buildSsp, type Ssp } from "@/lib/ssp";

const SubCtx = createContext<Submitter>(SUBMITTERS[0]);
export const useSubmitter = () => useContext(SubCtx);

type Store = {
  offers: Offer[];
  verifications: Verification[];
  plans: Ssp[];
  addOffer: (o: Offer) => void;
  addVerification: (v: Verification) => void;
  setOfferState: (ref: string, state: Offer["state"]) => void;
  updatePlan: (ref: string, patch: Partial<Ssp>) => void;
};
const StoreCtx = createContext<Store>({
  offers: [], verifications: [], plans: [],
  addOffer: () => {}, addVerification: () => {}, setOfferState: () => {}, updatePlan: () => {},
});
export const useOffers = () => useContext(StoreCtx);

type NavKey = "navAdd" | "navUpload" | "navRegister" | "navTemplate" | "navRecord" | "navVerifyReg" | "navCompare" | "navPlans" | "navReview" | "navNursery";

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

const PLAN_NAV: { href: string; key: NavKey }[] = [
  { href: "/intake/plans", key: "navPlans" },
  { href: "/intake/review", key: "navReview" },
  { href: "/intake/nursery", key: "navNursery" },
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
  const onPlanning = ["/intake/plans", "/intake/review", "/intake/nursery"].includes(path);
  const onVerification = !onPlanning && (path.startsWith("/intake/verif") || path === "/intake/compare");

  const heading =
    path === "/intake/plans" ? "hPlans"
    : path === "/intake/review" ? "hReview"
    : path === "/intake/nursery" ? "hNursery"
    : path === "/intake/compare" ? "hCompare"
    : onVerification ? "hVerify" : "hIntake";
  const lede =
    path === "/intake/plans" ? "ledePlans"
    : path === "/intake/review" ? "ledeReview"
    : path === "/intake/nursery" ? "ledeNursery"
    : path === "/intake/compare" ? "ledeCompare"
    : onVerification ? "ledeVerify" : "ledeIntake";
  const nav = onPlanning ? PLAN_NAV : onVerification ? VERIFY_NAV : INTAKE_NAV;
  const navHead = onPlanning ? "grpPlans" : onVerification ? "grpVerify" : "grpIntake";

  return (
    <StoreCtx.Provider value={{ offers, verifications, plans, addOffer, addVerification, setOfferState, updatePlan }}>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from "react";
import { useDemo } from "@/components/DemoContext";
import { tr, SUBMITTERS, scopeLabel, type Submitter } from "@/lib/intake";
export { useOffers } from "@/components/ProgrammeStore";

const SubCtx = createContext<Submitter>(SUBMITTERS[0]);
export const useSubmitter = () => useContext(SubCtx);

type NavKey = "stage1" | "stage2" | "stage3" | "stage4" | "stage5" | "navAdd" | "navUpload" | "navRegister" | "navTemplate" | "navRecord" | "navVerifyReg" | "navCompare" | "navPlans" | "navReview" | "navNursery" | "navAllocation" | "navDispatch" | "navPlanting" | "navCensus" | "navAudit";

/**
 * The five stages are not peers of one another the way "Tags" and "Public
 * record" are — they are consecutive steps in one pipeline. Showing them as
 * separate top-level menus hid that, and put nine items in a row that wrapped.
 * Numbered and shown whole, the sidebar becomes the story: an officer can see
 * the entire process and where in it they are standing.
 */
const STAGES: { head: string; items: { href: string; key: NavKey }[] }[] = [
  {
    head: "stage1",
    items: [
      { href: "/intake", key: "navAdd" },
      { href: "/intake/upload", key: "navUpload" },
      { href: "/intake/register", key: "navRegister" },
      { href: "/intake/template", key: "navTemplate" },
    ],
  },
  {
    head: "stage2",
    items: [
      { href: "/intake/verify", key: "navRecord" },
      { href: "/intake/verified", key: "navVerifyReg" },
      { href: "/intake/compare", key: "navCompare" },
    ],
  },
  {
    head: "stage3",
    items: [
      { href: "/intake/plans", key: "navPlans" },
      { href: "/intake/review", key: "navReview" },
      { href: "/intake/nursery", key: "navNursery" },
      { href: "/intake/allocation", key: "navAllocation" },
    ],
  },
  {
    head: "stage4",
    items: [
      { href: "/intake/dispatch", key: "navDispatch" },
      { href: "/intake/planting", key: "navPlanting" },
    ],
  },
  {
    head: "stage5",
    items: [
      { href: "/intake/census", key: "navCensus" },
      { href: "/intake/audit", key: "navAudit" },
    ],
  },
];

export default function IntakeShell({ children }: { children: ReactNode }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const path = usePathname();
  const [key, setKey] = useState(SUBMITTERS[0].key);
  const who = SUBMITTERS.find((s) => s.key === key) ?? SUBMITTERS[0];

  // A plan exists only once a Location ID has been issued. Most arrive already
  // reviewed, so the demand statement below has something real to aggregate.
  const onIntakeForm = path === "/intake" || path === "/intake/upload";

  // Each section is a different activity, done by a different person.
  const onCensus = ["/intake/census", "/intake/audit"].includes(path);
  const onField = ["/intake/dispatch", "/intake/planting"].includes(path);
  const onPlanning = !onCensus && ["/intake/plans", "/intake/review", "/intake/nursery", "/intake/allocation"].includes(path);
  const onVerification = !onPlanning && !onField && !onCensus && (path.startsWith("/intake/verif") || path === "/intake/compare");

  const heading =
    path === "/intake/plans" ? "hPlans"
    : path === "/intake/review" ? "hReview"
    : path === "/intake/nursery" ? "hNursery"
    : path === "/intake/allocation" ? "hAllocation"
    : path === "/intake/dispatch" ? "hDispatch"
    : path === "/intake/planting" ? "hPlanting"
    : path === "/intake/census" ? "hCensus"
    : path === "/intake/audit" ? "hAudit"
    : path === "/intake/compare" ? "hCompare"
    : onVerification ? "hVerify" : "hIntake";
  const lede =
    path === "/intake/plans" ? "ledePlans"
    : path === "/intake/review" ? "ledeReview"
    : path === "/intake/nursery" ? "ledeNursery"
    : path === "/intake/allocation" ? "ledeAllocation"
    : path === "/intake/dispatch" ? "ledeDispatch"
    : path === "/intake/planting" ? "ledePlanting"
    : path === "/intake/census" ? "ledeCensus"
    : path === "/intake/audit" ? "ledeAudit"
    : path === "/intake/compare" ? "ledeCompare"
    : onVerification ? "ledeVerify" : "ledeIntake";
  const activeStage = STAGES.findIndex((g) => g.items.some((i) => i.href === path));

  return (
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
            {STAGES.map((g, i) => {
              const here = i === activeStage;
              return (
                <div key={g.head} className={`ik-side-group${here ? " here" : ""}`}>
                  {/* only the stage in hand opens; the rest stay as headings so
                      the whole sequence is visible without scrolling */}
                  <Link href={g.items[0].href} className="ik-side-head">
                    <span className="n">{i + 1}</span>
                    {tr(g.head as NavKey, lang)}
                  </Link>
                  {here && g.items.map((n) => (
                    <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>
                      {tr(n.key, lang)}
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
          <div className="ik-main">
            <SubCtx.Provider value={who}>{children}</SubCtx.Provider>
          </div>
        </div>
    </main>
  );
}

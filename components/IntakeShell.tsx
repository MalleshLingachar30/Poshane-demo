"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from "react";
import { useDemo } from "@/components/DemoContext";
import { tr, SUBMITTERS, scopeLabel, type Submitter } from "@/lib/intake";

const Ctx = createContext<Submitter>(SUBMITTERS[0]);
export const useSubmitter = () => useContext(Ctx);

const NAV = [
  { href: "/intake", key: "navAdd" as const },
  { href: "/intake/upload", key: "navUpload" as const },
  { href: "/intake/template", key: "navTemplate" as const },
];

export default function IntakeShell({ children }: { children: ReactNode }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const path = usePathname();
  const [key, setKey] = useState(SUBMITTERS[0].key);
  const who = SUBMITTERS.find((s) => s.key === key) ?? SUBMITTERS[0];

  return (
    <main>
      <div className="ik-head">
        <h1 className="ik-title">{tr("title", lang)}</h1>
      </div>

      <p className="ik-lede">{tr("lede", lang)}</p>

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

      <div className="ik-body">
        <nav className="ik-side">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>
              {tr(n.key, lang)}
            </Link>
          ))}
        </nav>
        <div className="ik-main">
          <Ctx.Provider value={who}>{children}</Ctx.Provider>
        </div>
      </div>
    </main>
  );
}

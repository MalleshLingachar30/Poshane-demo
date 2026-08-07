"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "./DemoContext";
import { tr } from "@/lib/i18n";
import { ROLES } from "@/lib/data";

const NAV = [
  { href: "/", key: "publicRecord" as const },
  { href: "/console", key: "console" as const },
  { href: "/console/submit", key: "submitParcel" as const },
  { href: "/console/state", key: "stateView" as const },
  { href: "/tags", key: "tags" as const },
];

export default function Header() {
  const { lang, setLang, role, setRoleKey } = useDemo();
  const path = usePathname();
  const en = lang === "en";
  const isPublic = path === "/" || path.startsWith("/p/") || path === "/tags";
  const nav = NAV.filter(
    (n) => n.href !== "/console/state" || role.level === "state",
  );

  return (
    <header className="header">
      <div className="header-top">
        <Link href="/" className="brand">
          <span className="brand-mark">{tr("brand", lang)}</span>
          <span className="brand-sub">{tr("brandSub", lang)}</span>
        </Link>

        <div className="header-controls">
        {isPublic ? (
          <span className="public-badge">{tr("publicView", lang)}</span>
        ) : (
          <label className="role-picker">
            <span>{tr("signedInAs", lang)}</span>
            <select
              className="role"
              value={role.key}
              onChange={(e) => setRoleKey(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.key} value={r.key}>
                  {en ? r.titleEn : r.titleKn}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            onClick={() => setLang("en")}
            className={lang === "en" ? "on" : ""}
            aria-pressed={lang === "en"}
          >
            English
          </button>
          <button
            onClick={() => setLang("kn")}
            className={lang === "kn" ? "on" : ""}
            aria-pressed={lang === "kn"}
          >
            ಕನ್ನಡ
          </button>
        </div>
        </div>
      </div>

      <nav className="nav">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={path === n.href ? "nav-link on" : "nav-link"}
          >
            {tr(n.key, lang)}
          </Link>
        ))}
      </nav>

      <p className="demo-banner">{tr("demoBanner", lang)}</p>
    </header>
  );
}

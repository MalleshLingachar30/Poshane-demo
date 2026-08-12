"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { ROLES, DEFAULT_ROLE_KEY, type Role } from "@/lib/data";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  role: Role;
  setRoleKey: (k: string) => void;
};

const DemoCtx = createContext<Ctx | null>(null);

/**
 * The chosen identity and language survive a page reload for the length of the
 * tab. Without this a refresh silently drops the reviewer back to a taluk
 * officer, and screens that are scoped above that level appear to vanish —
 * which reads as a broken build rather than as the scope rule working.
 */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [roleKey, setRoleKeyState] = useState<string>(DEFAULT_ROLE_KEY);

  useEffect(() => {
    try {
      const l = sessionStorage.getItem("poshane.lang");
      const r = sessionStorage.getItem("poshane.role");
      if (l === "en" || l === "kn") setLangState(l);
      if (r && ROLES.some((x) => x.key === r)) setRoleKeyState(r);
    } catch {
      // private browsing, or storage disabled — the defaults are fine
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { sessionStorage.setItem("poshane.lang", l); } catch {}
  };

  const setRoleKey = (k: string) => {
    setRoleKeyState(k);
    try { sessionStorage.setItem("poshane.role", k); } catch {}
  };

  const role = ROLES.find((r) => r.key === roleKey) ?? ROLES[0];

  return (
    <DemoCtx.Provider value={{ lang, setLang, role, setRoleKey }}>
      {children}
    </DemoCtx.Provider>
  );
}

export function useDemo(): Ctx {
  const c = useContext(DemoCtx);
  if (!c) throw new Error("useDemo must be used inside DemoProvider");
  return c;
}

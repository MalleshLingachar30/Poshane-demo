"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { ROLES, DEFAULT_ROLE_KEY, type Role } from "@/lib/data";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  role: Role;
  setRoleKey: (k: string) => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [roleKey, setRoleKey] = useState<string>(DEFAULT_ROLE_KEY);
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

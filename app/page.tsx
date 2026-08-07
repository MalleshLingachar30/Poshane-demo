"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS } from "@/lib/data";

const PARCELS = ALL_PARCELS.slice(0, 12);

export default function ScanEntry() {
  const { lang } = useDemo();

  return (
    <main>
      <h1 className="page">{tr("scanTitle", lang)}</h1>
      <p className="lede">{tr("scanBody", lang)}</p>

      <div className="rows">
        {PARCELS.map((p) => (
          <Link key={p.id} href={`/p/${p.id}`} className="row">
            <div className="grow">
              <div className="mono">{p.id}</div>
              <div className="t">
                {lang === "en"
                  ? `${p.taluk} ${tr("taluk", lang)}, ${p.district}`
                  : `${p.talukKn} ${tr("taluk", lang)}, ${p.districtKn}`}
              </div>
              <div className="s">
                {p.areaHa.toFixed(2)} {tr("ha", lang)} · {p.saplings.toLocaleString("en-IN")}{" "}
                {lang === "en" ? "saplings" : "ಸಸಿಗಳು"}
              </div>
            </div>
            <span className={`pill ${p.status}`}>
              {p.status === "active"
                ? tr("statusActive", lang)
                : p.status === "flagged"
                  ? tr("statusFlagged", lang)
                  : tr("statusRectification", lang)}
            </span>
          </Link>
        ))}
      </div>

      <p className="note">{tr("publicNote", lang)}</p>
    </main>
  );
}

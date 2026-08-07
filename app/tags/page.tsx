"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS } from "@/lib/data";

const PARCELS = ALL_PARCELS.slice(0, 12);

export default function Tags() {
  const { lang } = useDemo();
  const en = lang === "en";
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  return (
    <main>
      <div className="no-print">
        <h1 className="page">{tr("tagsTitle", lang)}</h1>
        <p className="lede">{tr("tagsBody", lang)}</p>
        <button className="act" onClick={() => window.print()} style={{ marginBottom: 22 }}>
          {tr("printSheet", lang)}
        </button>
      </div>

      <div className="tag-grid">
        {PARCELS.map((p) => (
          <div key={p.id} className="tag-card">
            <div className="tag-brand">{tr("brand", lang)}</div>
            {origin && (
              <QRCodeSVG
                value={`${origin}/p/${p.id}`}
                size={132}
                level="M"
                marginSize={0}
                bgColor="#ffffff"
                fgColor="#1c5a33"
              />
            )}
            <div className="tag-id">{p.id}</div>
            <div className="tag-place">
              {en
                ? `${p.taluk}, ${p.district}`
                : `${p.talukKn}, ${p.districtKn}`}
            </div>
            <div className="tag-cta">{tr("scanMe", lang)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS } from "@/lib/data";

export default function Tags() {
  const { lang } = useDemo();
  const en = lang === "en";
  const [origin, setOrigin] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const districts = useMemo(() => {
    const m = new Map<string, string>();
    ALL_PARCELS.forEach((p) => m.set(p.district, p.districtKn));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const taluks = useMemo(() => {
    const m = new Map<string, string>();
    ALL_PARCELS.filter((p) => !district || p.district === district).forEach((p) =>
      m.set(p.taluk, p.talukKn),
    );
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [district]);

  const list = useMemo(
    () =>
      ALL_PARCELS.filter(
        (p) =>
          (!district || p.district === district) && (!taluk || p.taluk === taluk),
      ),
    [district, taluk],
  );

  return (
    <main>
      <div className="no-print">
        <h1 className="page">{tr("tagsTitle", lang)}</h1>
        <p className="lede">{tr("tagBatchNote", lang)}</p>

        <div className="filters">
          <label>
            <span>{tr("filterDistrict", lang)}</span>
            <select
              className="role"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setTaluk("");
              }}
            >
              <option value="">{tr("allDistricts", lang)}</option>
              {districts.map(([name, kn]) => (
                <option key={name} value={name}>
                  {en ? name : kn}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{tr("filterTaluk", lang)}</span>
            <select className="role" value={taluk} onChange={(e) => setTaluk(e.target.value)}>
              <option value="">{tr("allTaluks", lang)}</option>
              {taluks.map(([name, kn]) => (
                <option key={name} value={name}>
                  {en ? name : kn}
                </option>
              ))}
            </select>
          </label>

          <span className="filter-count">
            {list.length} {tr("tagsInBatch", lang)}
          </span>

          <button className="act" onClick={() => window.print()}>
            {tr("printSheet", lang)}
          </button>
        </div>
      </div>

      <div className="tag-grid">
        {list.map((p) => (
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
              {en ? `${p.taluk}, ${p.district}` : `${p.talukKn}, ${p.districtKn}`}
            </div>
            <div className="tag-cta">{tr("scanMe", lang)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS } from "@/lib/data";
import { useOffers } from "@/components/ProgrammeStore";

const LIMIT = 24;

export default function ScanEntry() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { sessionParcels } = useOffers();

  // a parcel planted a moment ago belongs here as much as one planted in 2027
  const PARCELS = useMemo(() => [...sessionParcels, ...ALL_PARCELS], [sessionParcels]);
  const fresh = useMemo(() => new Set(sessionParcels.map((p) => p.id)), [sessionParcels]);

  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [q, setQ] = useState("");

  const districts = useMemo(() => {
    const m = new Map<string, string>();
    PARCELS.forEach((p) => m.set(p.district, p.districtKn));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [PARCELS]);

  const taluks = useMemo(() => {
    const m = new Map<string, string>();
    PARCELS.filter((p) => !district || p.district === district)
      .forEach((p) => m.set(p.taluk, p.talukKn));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [PARCELS, district]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PARCELS
      .filter(
        (p) =>
          (!district || p.district === district) &&
          (!taluk || p.taluk === taluk) &&
          (!needle ||
            p.id.toLowerCase().includes(needle) ||
            p.taluk.toLowerCase().includes(needle) ||
            p.district.toLowerCase().includes(needle)),
      )
      // public order is geographic, never worst-first — but a parcel planted
      // during this session goes to the top, or it lands beyond the visible
      // rows and looks as though it was never recorded
      .sort((a, b) => {
        const an = fresh.has(a.id) ? 0 : 1;
        const bn = fresh.has(b.id) ? 0 : 1;
        return (
          an - bn ||
          a.district.localeCompare(b.district) ||
          a.taluk.localeCompare(b.taluk) ||
          a.id.localeCompare(b.id)
        );
      });
  }, [PARCELS, district, taluk, q, fresh]);

  const list = filtered.slice(0, LIMIT);
  const dirty = district || taluk || q.trim();

  return (
    <main>
      <h1 className="page">{tr("scanTitle", lang)}</h1>
      <p className="lede">{tr("scanBody", lang)}</p>

      <div className="filters">
        <label>
          <span>{tr("filterDistrict", lang)}</span>
          <select
            className="role"
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setTaluk(""); }}
          >
            <option value="">{tr("allDistricts", lang)}</option>
            {districts.map(([name, kn]) => (
              <option key={name} value={name}>{en ? name : kn}</option>
            ))}
          </select>
        </label>

        <label>
          <span>{tr("filterTaluk", lang)}</span>
          <select className="role" value={taluk} onChange={(e) => setTaluk(e.target.value)}>
            <option value="">{tr("allTaluks", lang)}</option>
            {taluks.map(([name, kn]) => (
              <option key={name} value={name}>{en ? name : kn}</option>
            ))}
          </select>
        </label>

        <label>
          <span>{tr("searchParcel", lang)}</span>
          <input
            className="role"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr("searchHint", lang)}
            style={{ minWidth: 220 }}
          />
        </label>

        {dirty && (
          <button
            className="ev-toggle"
            onClick={() => { setDistrict(""); setTaluk(""); setQ(""); }}
          >
            {tr("clearFilters", lang)}
          </button>
        )}

        <span className="filter-count">
          {dirty
            ? `${filtered.length} ${tr("matching", lang)}`
            : `${tr("showingAll", lang)} ${PARCELS.length} ${tr("publicParcels", lang)}`}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="note" style={{ borderTop: 0 }}>{tr("noMatches", lang)}</p>
      ) : (
        <div className="rows">
          {list.map((p) => (
            <Link key={p.id} href={`/p/${p.id}`} className="row">
              <div className="grow">
                <div className="mono">
                  {p.id}
                  {fresh.has(p.id) && (
                    <em style={{ color: "var(--gold)", fontStyle: "normal", fontWeight: 600 }}>
                      {" "}· {en ? "planted in this session" : "ಈ ಅವಧಿಯಲ್ಲಿ ನೆಡಲಾಗಿದೆ"}
                    </em>
                  )}
                </div>
                <div className="t">
                  {en
                    ? `${p.taluk} ${tr("taluk", lang)}, ${p.district}`
                    : `${p.talukKn} ${tr("taluk", lang)}, ${p.districtKn}`}
                </div>
                <div className="s">
                  {p.areaHa.toFixed(2)} {tr("ha", lang)} ·{" "}
                  {p.saplings.toLocaleString("en-IN")}{" "}
                  {en ? "saplings" : "ಸಸಿಗಳು"}
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
      )}

      {filtered.length > list.length && (
        <p className="note">
          {tr("showingTop", lang)} {list.length} / {filtered.length} ·{" "}
          {en
            ? "narrow by district, taluk or Location ID to find a specific site"
            : "ನಿರ್ದಿಷ್ಟ ಸ್ಥಳ ಹುಡುಕಲು ಜಿಲ್ಲೆ, ತಾಲ್ಲೂಕು ಅಥವಾ ಲೊಕೇಶನ್ ಐಡಿಯಿಂದ ಸೀಮಿತಗೊಳಿಸಿ"}
        </p>
      )}

      <p className="note">{tr("publicNote", lang)}</p>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import ParcelMap from "@/components/ParcelMap";
import EvidencePanel from "@/components/EvidencePanel";
import { tr } from "@/lib/i18n";
import { scopedParcels, type Parcel, placeOf } from "@/lib/data";

export default function ConsoleRecord({ parcel: p }: { parcel: Parcel }) {
  const { lang, role } = useDemo();
  const en = lang === "en";
  const r = p.rectification;
  const inScope = scopedParcels(role).some((x) => x.id === p.id);

  if (!inScope) {
    return (
      <main>
        <Link href="/console" className="mono" style={{ textDecoration: "none" }}>
          ← {tr("back", lang)}
        </Link>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="mono">{p.id}</div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: 21,
              fontWeight: 600,
              color: "var(--muted)",
              margin: "6px 0 10px",
            }}
          >
            {tr("notInScope", lang)}
          </h1>
          <p style={{ fontSize: 13.5, maxWidth: "62ch", lineHeight: 1.65 }}>
            {tr("notInScopeBody", lang)}
          </p>
          <div className="scope-box" style={{ marginTop: 18, marginBottom: 0 }}>
            <div className="who">{en ? role.titleEn : role.titleKn}</div>
            <div style={{ marginTop: 4 }}>
              {tr("visibleScope", lang)}: {en ? role.scopeEn : role.scopeKn}
            </div>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>
              {tr("switchRole", lang)}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Link href="/console" className="mono" style={{ textDecoration: "none" }}>
        ← {tr("back", lang)}
      </Link>

      <div className="card" style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <div className="mono">{p.id}</div>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                fontWeight: 600,
                margin: "2px 0",
              }}
            >
              {placeOf(p, lang, tr("taluk", lang))}
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--muted)" }}>
              {p.areaHa.toFixed(2)} {tr("ha", lang)} · {tr("plantedOn", lang)}{" "}
              {p.plantedOn}
            </div>
          </div>
          <span className={`pill ${p.status}`}>
            {p.status === "active"
              ? tr("statusActive", lang)
              : p.status === "flagged"
                ? tr("statusFlagged", lang)
                : tr("statusRectification", lang)}
          </span>
        </div>

        {r && (
          <div className="rect-box">
            <div className="h">{tr("openRectification", lang)}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {en ? r.reasonEn : r.reasonKn}
            </div>
            <dl>
              <dt>{tr("owner", lang)}</dt>
              <dd>{en ? r.ownerEn : r.ownerKn}</dd>
              <dt>{tr("deadline", lang)}</dt>
              <dd>
                {r.deadline} — {tr("overdueBy", lang)} {r.overdueDays}{" "}
                {tr("days", lang)}
              </dd>
              <dt>{tr("escalatedTo", lang)}</dt>
              <dd>{tr("districtCommand", lang)}</dd>
            </dl>
          </div>
        )}

        <div className="metrics">
          <div className="metric">
            <div className="k">{tr("survivalLast", lang)}</div>
            <div className="v" style={p.survival < 75 ? { color: "var(--red)" } : undefined}>
              {p.survival}%
            </div>
            <div className="n">
              {tr("countedOn", lang)} {p.survivalCountedOn}
            </div>
          </div>
          <div className="metric">
            <div className="k">{tr("saplingsPlanted", lang)}</div>
            <div className="v">{p.saplings.toLocaleString("en-IN")}</div>
            <div className="n">
              {p.speciesCount} {tr("species", lang)} · {tr("zone", lang)} {p.zone}
            </div>
          </div>
          <div className="metric">
            <div className="k">{tr("nextCensus", lang)}</div>
            <div className="v">{p.nextCensus}</div>
            <div className="n">{tr("annualCycle", lang)}</div>
          </div>
        </div>

        <div className="split">
          <div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
              {tr("evidence", lang)}
            </p>
            <div className="timeline">
              {p.events.map((e, i) => (
                <div key={i} className={`item ${e.kind}`}>
                  <div className="l">{en ? e.labelEn : e.labelKn}</div>
                  <div className="m">
                    {e.date} · {en ? e.metaEn : e.metaKn}
                  </div>
                  <EvidencePanel
                    event={e}
                    visible={!e.restricted || role.level !== "taluk"}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <ParcelMap polygon={p.polygon} height={140} />
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.55 }}>
              {tr("boundaryNote", lang)}
            </p>
            <Link href={`/p/${p.id}`} style={{ fontSize: 13, color: "var(--navy)" }}>
              {tr("publicRecord", lang)} →
            </Link>
          </div>
        </div>

        <p className="note">{tr("satelliteNote", lang)}</p>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import ParcelMap from "@/components/ParcelMap";
import ParcelSatellite from "@/components/ParcelSatellite";
import SiteCompare from "@/components/SiteCompare";
import EvidencePanel from "@/components/EvidencePanel";
import { tr } from "@/lib/i18n";
import { placeOf, type Parcel } from "@/lib/data";

export default function PublicRecord({ parcel: p }: { parcel: Parcel }) {
  const { lang } = useDemo();
  const en = lang === "en";

  // Read from the URL rather than passed down, so a link shared from the map
  // still returns the recipient to the map.
  const [from, setFrom] = useState<string | null>(null);
  const [taluk, setTaluk] = useState<string | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setFrom(q.get("from"));
    setTaluk(q.get("taluk"));
  }, []);

  return (
    <main>
      {/* Back should return to wherever the visitor came from. Arriving from
          the map and being returned to the public record means finding the
          taluk again for every site you want to look at. */}
      <Link
        href={from === "map" ? `/map${taluk ? `?taluk=${encodeURIComponent(taluk)}` : ""}` : "/"}
        className="mono"
        style={{ textDecoration: "none" }}
      >
        ← {from === "map"
          ? (lang === "en" ? `Back to ${taluk || "the map"}` : `${taluk || "ನಕ್ಷೆ"}ಗೆ ಹಿಂತಿರುಗಿ`)
          : tr("back", lang)}
      </Link>

      <div className="card" style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            borderBottom: "1px solid var(--line)",
            paddingBottom: 14,
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
              {p.areaHa.toFixed(2)} {tr("ha", lang)} · {tr("landType", lang)} ·{" "}
              {tr("plantedOn", lang)} {p.plantedOn}
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

        <div className="metrics">
          <div className="metric">
            <div className="k">{tr("survivalLast", lang)}</div>
            <div className="v">{p.survivalCountedOn ? `${p.survival}%` : "—"}</div>
            <div className="n">
              {p.survivalCountedOn
                ? `${tr("countedOn", lang)} ${p.survivalCountedOn}`
                : tr("noCensusYet", lang)}
            </div>
          </div>
          <div className="metric">
            <div className="k">{tr("saplingsPlanted", lang)}</div>
            <div className="v">{p.saplings.toLocaleString("en-IN")}</div>
            <div className="n">
              {p.speciesCount} {tr("species", lang)}
              {p.zoneLabel ? ` · ${p.zoneLabel}` : p.zone ? ` · ${tr("zone", lang)} ${p.zone}` : ""}
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
                  {e.publicVisible && <EvidencePanel event={e} visible />}
                </div>
              ))}
            </div>
          </div>

          <div>
            {p.walk ? (
              <ParcelSatellite walk={p.walk} height={210} />
            ) : (
              <ParcelMap polygon={p.polygon} height={140} />
            )}
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.55 }}>
              {tr("boundaryNote", lang)}
            </p>
          </div>
        </div>

        {p.sitePair && (
          <div style={{ marginTop: 20 }}>
            <div className="ev-h">{tr("beforeAfter", lang)}</div>
            <SiteCompare pair={p.sitePair} height={240} />
          </div>
        )}

        {p.offerRef && (
          <div className="provenance">
            <div className="h">{tr("howItGotHere", lang)}</div>
            <ol>
              <li>
                <b>{en ? p.deptEn : p.deptKn}</b> {tr("provOffered", lang)}
                <span className="mono"> {p.offerRef}</span>
              </li>
              <li>
                {tr("provWalked", lang)} <b>{en ? p.verifiedByEn : p.verifiedByKn}</b>,
                {" "}{tr("provIssued", lang)} <span className="mono">{p.id}</span>
              </li>
              <li>
                {tr("provPlan", lang)} {p.planApprovedOn}
              </li>
              <li>
                {tr("provPlanted", lang)} {p.plantedOn} · {p.season}
              </li>
            </ol>
          </div>
        )}

        <p className="note">{tr("satelliteNote", lang)}</p>
      </div>
    </main>
  );
}

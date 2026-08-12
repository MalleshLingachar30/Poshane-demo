"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { CADRE, ZONES, SOILS, DEPTHS, SLOPES, DRAINAGE } from "@/lib/offers";

export default function VisitsRecorded() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { offers, verifications } = useOffers();

  const [officerKey, setOfficerKey] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return verifications.filter(
      (v) =>
        (!officerKey || v.officerKey === officerKey) &&
        (!n || v.ref.toLowerCase().includes(n)),
    );
  }, [verifications, officerKey, q]);

  return (
    <div>
      <div className="filters">
        <label>
          <span>{tr("officer", lang)}</span>
          <select className="role" value={officerKey} onChange={(e) => setOfficerKey(e.target.value)}>
            <option value="">{en ? "All officers" : "ಎಲ್ಲಾ ಅಧಿಕಾರಿಗಳು"}</option>
            {CADRE.map((c) => (
              <option key={c.key} value={c.key}>{(en ? c.en : c.kn)} — {c.taluk}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{tr("searchParcelIk", lang)}</span>
          <input className="role" value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="OFR-" style={{ minWidth: 180 }} />
        </label>
        <span className="filter-count">{list.length} {tr("visits", lang)}</span>
      </div>

      <div className="ik-rows">
        {list.map((v) => {
          const o = offers.find((x) => x.ref === v.ref);
          const isOpen = open === v.ref;
          return (
            <div key={v.ref} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : v.ref)}>
                <span className="grow">
                  <span className="mono">
                    {v.ref}{v.isNew && <em className="ik-new"> · {tr("justSubmitted", lang)}</em>}
                  </span>
                  <span className="who">{o ? o.village : ""} · {(+v.offered).toFixed(2)} ha {en ? "walked" : "ನಡೆದದ್ದು"}</span>
                  <span className="sub">
                    {en ? v.officerEn : v.officerKn} · {tr("visitedOn", lang)} {v.visitedOn}
                  </span>
                </span>
                <span className={`ik-stage s-${v.decision === "verified" ? "verified" : "rejected"}`}>
                  {v.decision === "verified"
                    ? (en ? "Verified" : "ಪರಿಶೀಲಿತ")
                    : (en ? "Not accepted" : "ಸ್ವೀಕರಿಸಿಲ್ಲ")}
                </span>
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  <table className="ik-compare" style={{ maxWidth: 640 }}>
                    <tbody>
                      <tr><td>{tr("walkedArea", lang)}</td><td colSpan={2}>{(+v.offered).toFixed(2)} ha</td></tr>
                      <tr><td>{en ? "Boundary" : "ಗಡಿ"}</td><td colSpan={2}>
                        {v.gate.validGeometry
                          ? `${v.gate.vertices} ${tr("vertices", lang)} · ${tr("vsRtc", lang)} ${v.gate.rtcHa.toFixed(2)} ha`
                          : (en ? "Invalid — the walk crosses itself" : "ಅಮಾನ್ಯ — ನಡಿಗೆ ತನ್ನನ್ನೇ ಕತ್ತರಿಸುತ್ತದೆ")}
                      </td></tr>
                      <tr><td>{en ? "Vegetation" : "ಸಸ್ಯವರ್ಗ"}</td><td colSpan={2}>{v.vegetation}</td></tr>
                      <tr><td>{en ? "Water" : "ನೀರು"}</td><td colSpan={2}>{v.water}</td></tr>
                      <tr><td>{en ? "Access" : "ದಾರಿ"}</td><td colSpan={2}>{v.access}</td></tr>
                      <tr><td>{en ? "Encroachment" : "ಒತ್ತುವರಿ"}</td><td colSpan={2}>{v.encroach}</td></tr>
                      <tr><td>{en ? "Boundary dispute" : "ಗಡಿ ವಿವಾದ"}</td><td colSpan={2}>{v.dispute}</td></tr>
                      {v.addressEn && <tr><td>{tr("fldAddress", lang)}</td><td colSpan={2}>{v.addressEn}</td></tr>}
                      {v.zone && <tr><td>{tr("fldZone", lang)}</td><td colSpan={2}>
                        {(() => { const z = ZONES.find((x) => x.key === v.zone); return z ? (en ? z.en : z.kn) : v.zone; })()}
                      </td></tr>}
                      {v.soil && <tr><td>{tr("fldSoil", lang)}</td><td colSpan={2}>
                        {(() => { const z = SOILS.find((x) => x.key === v.soil); return z ? (en ? z.en : z.kn) : v.soil; })()}
                        {v.depth && (() => { const d = DEPTHS.find((x) => x.key === v.depth); return d ? ` · ${en ? d.en : d.kn}` : ""; })()}
                      </td></tr>}
                      {v.slope && <tr><td>{tr("fldSlope", lang)}</td><td colSpan={2}>
                        {(() => { const z = SLOPES.find((x) => x.key === v.slope); return z ? (en ? z.en : z.kn) : v.slope; })()}
                        {v.drainage && (() => { const d = DRAINAGE.find((x) => x.key === v.drainage); return d ? ` · ${en ? d.en : d.kn}` : ""; })()}
                      </td></tr>}
                      {v.waterDistance && <tr><td>{tr("fldWaterDist", lang)}</td><td colSpan={2}>{v.waterDistance} m</td></tr>}
                      {v.custodyEn && <tr><td>{tr("custodyBody", lang)}</td><td colSpan={2}>{en ? v.custodyEn : v.custodyKn}</td></tr>}
                    </tbody>
                  </table>
                  {v.notesEn && <p className="ik-line quote">{en ? v.notesEn : v.notesKn}</p>}
                  {v.rejectionEn && (
                    <p className="ik-line reject"><b>{tr("notAccepted", lang)}:</b> {en ? v.rejectionEn : v.rejectionKn}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

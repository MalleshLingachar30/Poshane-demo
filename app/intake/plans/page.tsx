"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { MODELS, SILVI_ZONES } from "@/lib/species";
import { sspTotal } from "@/lib/ssp";

const STATE_CLASS: Record<string, string> = {
  draft: "queued", submitted: "verified", approved: "approved", returned: "rejected",
};
const STATE_KEY = {
  draft: "stDraft", submitted: "stSubmitted", approved: "stApproved", returned: "stReturned",
} as const;

export default function Plans() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plans, updatePlan } = useOffers();

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const districts = useMemo(
    () => [...new Set(plans.map((p) => p.district))].sort(),
    [plans],
  );

  const list = useMemo(
    () => plans.filter((p) => (!state || p.state === state) && (!district || p.district === district)),
    [plans, state, district],
  );

  return (
    <div>
      <div className="filters">
        <label>
          <span>{tr("filterDistrict", lang)}</span>
          <select className="role" value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">{tr("allDistricts", lang)}</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>
          <span>{tr("stage", lang)}</span>
          <select className="role" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">{tr("allStates", lang)}</option>
            {Object.entries(STATE_KEY).map(([k, v]) => (
              <option key={k} value={k}>{tr(v, lang)}</option>
            ))}
          </select>
        </label>
        <span className="filter-count">{list.length}</span>
      </div>

      <div className="ik-rows">
        {list.map((p) => {
          const m = MODELS.find((x) => x.key === p.modelKey)!;
          const z = SILVI_ZONES.find((x) => x.key === p.zoneKey)!;
          const isOpen = open === p.ref;
          return (
            <div key={p.ref} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : p.ref)}>
                <span className="grow">
                  <span className="mono">
                    {p.locationId}{p.isNew && <em className="ik-new"> · {tr("justSubmitted", lang)}</em>}
                  </span>
                  <span className="who">{p.village}, {p.taluk}</span>
                  <span className="sub">
                    {en ? z.en : z.kn} · {en ? m.en : m.kn} · {p.areaHa.toFixed(2)} ha ·{" "}
                    {sspTotal(p).toLocaleString("en-IN")} {tr("saplings", lang)}
                  </span>
                </span>
                <span className={`ik-stage s-${STATE_CLASS[p.state]}`}>{tr(STATE_KEY[p.state], lang)}</span>
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  <table className="ik-compare" style={{ maxWidth: 660 }}>
                    <tbody>
                      <tr><td>{tr("silviZone", lang)}</td><td colSpan={2}>{en ? z.en : z.kn}</td></tr>
                      <tr><td>{tr("plantingModel", lang)}</td><td colSpan={2}>{en ? m.en : m.kn}</td></tr>
                      <tr><td>{tr("bagSize", lang)}</td><td colSpan={2}>{m.bag} · {m.category}</td></tr>
                      <tr><td>{tr("planSpacing", lang)}</td><td colSpan={2}>
                        {m.spacingEn} = {m.density} {en ? `per ${m.densityUnit}` : `ಪ್ರತಿ ${m.densityUnit}`}
                        {m.note && <span style={{ color: "var(--muted)" }}> · {m.note}</span>}
                      </td></tr>
                      <tr><td>{tr("walkedArea", lang)}</td><td colSpan={2}>{p.areaHa.toFixed(2)} ha</td></tr>
                    </tbody>
                  </table>

                  <p className="ik-line" style={{ marginTop: 12 }}>
                    <b>{tr("eligibleSpecies", lang)}</b>
                  </p>
                  <table className="ik-compare" style={{ maxWidth: 660 }}>
                    <tbody>
                      {p.lines.map((l) => (
                        <tr key={l.species.sci} style={l.included ? undefined : { opacity: 0.45 }}>
                          <td style={{ width: "46%" }}>
                            <em>{l.species.sci}</em>
                          </td>
                          <td>{l.species.local}</td>
                          <td style={{ textAlign: "right" }}>
                            {l.included ? l.count.toLocaleString("en-IN") : "—"}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2}><strong>{tr("planTotal", lang)}</strong></td>
                        <td style={{ textAlign: "right" }}>
                          <strong>{sspTotal(p).toLocaleString("en-IN")}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {p.notes.length > 0 && (
                    <div className="ik-banner warn" style={{ marginTop: 14 }}>
                      <b>{tr("reviewerNotes", lang)}</b>
                      {p.notes.map((n, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>· {en ? n.en : n.kn}</div>
                      ))}
                      <div style={{ marginTop: 6, fontStyle: "italic" }}>{tr("notesNever", lang)}</div>
                    </div>
                  )}

                  {p.remarksEn && (
                    <p className="ik-line reject" style={{ marginTop: 12 }}>
                      <b>{tr("remarks", lang)}:</b> {p.remarksEn}
                    </p>
                  )}
                  {p.reviewerEn && (
                    <p className="ik-line">
                      <b>{tr("reviewedBy", lang)}:</b> {p.reviewerEn} · {p.reviewedOn}
                    </p>
                  )}

                  {(p.state === "draft" || p.state === "returned") && (
                    <div className="ik-actions" style={{ marginTop: 14 }}>
                      <button className="ik-btn" onClick={() => updatePlan(p.ref, { state: "submitted", remarksEn: undefined })}>
                        {tr("submitForReview", lang)}
                      </button>
                    </div>
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

"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { MODELS, SILVI_ZONES } from "@/lib/species";
import { REVIEWERS, sspTotal } from "@/lib/ssp";
import { SOILS, DEPTHS, SLOPES, DRAINAGE } from "@/lib/offers";

export default function Review() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plans, verifications, updatePlan } = useOffers();

  const [who, setWho] = useState(REVIEWERS[0].key);
  const reviewer = REVIEWERS.find((r) => r.key === who)!;
  const [open, setOpen] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");

  const queue = useMemo(() => plans.filter((p) => p.state === "submitted"), [plans]);
  const plan = plans.find((p) => p.ref === open) ?? null;
  const v = plan ? verifications.find((x) => x.ref === plan.ref) : null;

  const decide = (state: "approved" | "returned") => {
    if (!plan) return;
    updatePlan(plan.ref, {
      state,
      reviewerEn: en ? reviewer.en : reviewer.kn,
      reviewedOn: en ? "today" : "ಇಂದು",
      remarksEn: state === "returned" ? remarks : undefined,
    });
    setOpen(null);
    setRemarks("");
  };

  const toggle = (sci: string) => {
    if (!plan) return;
    updatePlan(plan.ref, {
      lines: plan.lines.map((l) =>
        l.species.sci === sci ? { ...l, included: !l.included } : l,
      ),
    });
  };

  return (
    <div>
      <div className="ik-who">
        <div className="ik-who-row">
          <span className="k">{tr("reviewingAs", lang)}</span>
          <select className="ik-who-sel" value={who} onChange={(e) => setWho(e.target.value)}>
            {REVIEWERS.map((r) => (
              <option key={r.key} value={r.key}>{en ? r.en : r.kn}</option>
            ))}
          </select>
        </div>
      </div>

      {!plan && (
        <>
          <h2 className="ik-h2">{tr("awaitingReview", lang)} · {queue.length}</h2>
          {queue.length === 0 ? (
            <p className="ik-note">{tr("nothingToReview", lang)}</p>
          ) : (
            <div className="ik-rows">
              {queue.map((p) => {
                const m = MODELS.find((x) => x.key === p.modelKey)!;
                return (
                  <button key={p.ref} className="ik-offer-head" onClick={() => { setOpen(p.ref); setRemarks(""); }}>
                    <span className="grow">
                      <span className="mono">{p.locationId}</span>
                      <span className="who">{p.village}, {p.taluk} · {p.district}</span>
                      <span className="sub">
                        {en ? m.en : m.kn} · {p.areaHa.toFixed(2)} ha ·{" "}
                        {sspTotal(p).toLocaleString("en-IN")} {tr("saplings", lang)}
                        {p.notes.length > 0 && ` · ${p.notes.length} ${en ? "notes" : "ಟಿಪ್ಪಣಿಗಳು"}`}
                      </span>
                    </span>
                    <span className="ik-stage s-verified">{tr("stSubmitted", lang)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {plan && (() => {
        const m = MODELS.find((x) => x.key === plan.modelKey)!;
        const z = SILVI_ZONES.find((x) => x.key === plan.zoneKey)!;
        const lab = (arr: { key: string; en: string; kn: string }[], k?: string) => {
          const f = arr.find((x) => x.key === k);
          return f ? (en ? f.en : f.kn) : "—";
        };
        return (
          <>
            <button className="ev-toggle" onClick={() => setOpen(null)}>← {tr("backToQueue", lang)}</button>
            <h2 className="ik-h2" style={{ marginTop: 14 }}>
              <span className="mono">{plan.locationId}</span> · {plan.village}, {plan.taluk}
            </h2>

            <div className="ik-split2">
              <div>
                <div className="ik-col-head">{tr("foundOnSite", lang)}</div>
                <table className="ik-compare">
                  <tbody>
                    <tr><td>{tr("walkedArea", lang)}</td><td>{plan.areaHa.toFixed(2)} ha</td></tr>
                    <tr><td>{tr("fldSoil", lang)}</td><td>{lab(SOILS, v?.soil)}</td></tr>
                    <tr><td>{tr("fldDepth", lang)}</td><td>{lab(DEPTHS, v?.depth)}</td></tr>
                    <tr><td>{tr("fldSlope", lang)}</td><td>{lab(SLOPES, v?.slope)}</td></tr>
                    <tr><td>{tr("fldDrainage", lang)}</td><td>{lab(DRAINAGE, v?.drainage)}</td></tr>
                    <tr><td>{tr("fldWaterDist", lang)}</td><td>{v?.waterDistance ? `${v.waterDistance} m` : "—"}</td></tr>
                    <tr><td>{tr("officer", lang)}</td><td>{v ? (en ? v.officerEn : v.officerKn) : "—"}</td></tr>
                  </tbody>
                </table>
                {v?.notesEn && <p className="ik-line quote">{en ? v.notesEn : v.notesKn}</p>}
              </div>

              <div>
                <div className="ik-col-head">{tr("sitePlanTitle", lang)}</div>
                <table className="ik-compare">
                  <tbody>
                    <tr><td>{tr("silviZone", lang)}</td><td>{en ? z.en : z.kn}</td></tr>
                    <tr><td>{tr("plantingModel", lang)}</td><td>{en ? m.en : m.kn}</td></tr>
                    <tr><td>{tr("bagSize", lang)}</td><td>{m.bag}</td></tr>
                    <tr><td>{tr("planSpacing", lang)}</td><td>{m.spacingEn} = {m.density}/{m.densityUnit}</td></tr>
                    <tr><td>{tr("planTotal", lang)}</td><td><strong>{sspTotal(plan).toLocaleString("en-IN")}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {plan.notes.length > 0 && (
              <div className="ik-banner warn" style={{ marginTop: 16 }}>
                <b>{tr("reviewerNotes", lang)}</b>
                {plan.notes.map((n, i) => <div key={i}>· {en ? n.en : n.kn}</div>)}
                <div style={{ marginTop: 6, fontStyle: "italic" }}>{tr("notesNever", lang)}</div>
              </div>
            )}

            <h2 className="ik-h2">{tr("eligibleSpecies", lang)}</h2>
            <table className="ik-compare" style={{ maxWidth: 720 }}>
              <tbody>
                {plan.lines.map((l) => (
                  <tr key={l.species.sci}>
                    <td style={{ width: 40 }}>
                      <input type="checkbox" checked={l.included} onChange={() => toggle(l.species.sci)} />
                    </td>
                    <td style={{ opacity: l.included ? 1 : 0.45 }}><em>{l.species.sci}</em></td>
                    <td style={{ opacity: l.included ? 1 : 0.45 }}>{l.species.local}</td>
                    <td style={{ textAlign: "right", opacity: l.included ? 1 : 0.45 }}>
                      {l.included ? l.count.toLocaleString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ik-note" style={{ marginTop: 6 }}>{tr("includeSpecies", lang)}</p>

            <div className="ik-field" style={{ maxWidth: 720, marginTop: 16 }}>
              <label>{tr("remarks", lang)}</label>
              <input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>

            <div className="ik-actions" style={{ marginTop: 16 }}>
              <button className="ik-btn" onClick={() => decide("approved")}>{tr("approvePlan", lang)}</button>
              <button className="ik-btn ghost" disabled={!remarks} onClick={() => decide("returned")}>
                {tr("returnPlan", lang)}
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
}

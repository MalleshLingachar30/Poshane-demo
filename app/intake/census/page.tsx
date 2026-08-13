"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/ProgrammeStore";
import { tr } from "@/lib/intake";
import { AUDIT_CADRE, SURVIVAL_THRESHOLD, mayAudit, rectificationFor, survivalOf, type Census, type CensusLine } from "@/lib/census";

export default function CensusPage() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plantings, verifications, censuses, rectifications, addCensus, addRectification } = useOffers();

  const [locationId, setLocationId] = useState("");
  const [officerKey, setOfficerKey] = useState("");
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState<Census | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const awaiting = useMemo(
    () => plantings.filter((p) => !censuses.some((c) => c.locationId === p.locationId)),
    [plantings, censuses],
  );
  const planting = plantings.find((p) => p.locationId === locationId) ?? null;
  const v = verifications.find((x) => x.locationId === locationId);

  // the co-signing officer must be eligible for this parcel
  const eligible = AUDIT_CADRE.filter((a) => mayAudit(a, v?.officerKey));
  const officer = eligible.find((a) => a.key === officerKey) ?? null;

  const lines: CensusLine[] = (planting?.lines ?? []).map((l) => ({
    species: l.species,
    planted: l.planted,
    surviving: Math.min(Number(counts[l.species.sci] ?? "") || 0, l.planted),
  }));
  const totals = survivalOf(lines);
  const complete = !!planting && !!officer && lines.every((l) => counts[l.species.sci] !== undefined && counts[l.species.sci] !== "");

  const pick = (id: string) => {
    setLocationId(id);
    setSaved(null);
    setOfficerKey("");
    const p = plantings.find((x) => x.locationId === id);
    setCounts(Object.fromEntries((p?.lines ?? []).map((l) => [l.species.sci, ""])));
  };

  const save = () => {
    if (!planting || !officer) return;
    const c: Census = {
      locationId: planting.locationId,
      countedOn: en ? "today" : "ಇಂದು",
      cycle: en ? "first annual" : "ಮೊದಲ ವಾರ್ಷಿಕ",
      agencyEn: planting.agencyEn,
      agencyKn: planting.agencyKn,
      auditOfficerEn: officer.en,
      auditOfficerKn: officer.kn,
      lines,
      planted: totals.planted,
      surviving: totals.surviving,
      survival: totals.survival,
      photographs: 18,
      notesEn: notes,
      notesKn: notes,
    };
    addCensus(c);
    const r = rectificationFor(c, planting.agencyEn, planting.agencyKn, lang);
    if (r) addRectification(r);
    setSaved(c);
    setLocationId("");
    setNotes("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {saved && (
        <div className={`ik-banner ${saved.survival < SURVIVAL_THRESHOLD ? "bad" : "ok"}`}>
          <b>{tr("censusSaved", lang)} — {saved.locationId} · {saved.survival}%</b>
          {saved.survival < SURVIVAL_THRESHOLD ? tr("belowThresholdNow", lang) : tr("aboveThreshold", lang)}
        </div>
      )}

      <div className="ik-group">
        <h2>{tr("whichParcelCensus", lang)}</h2>
        {awaiting.length === 0 ? (
          <p className="ik-note" style={{ marginTop: 0 }}>{tr("nothingToCount", lang)}</p>
        ) : (
          <div className="ik-fields" style={{ maxWidth: 760 }}>
            <div className="ik-field">
              <label>{tr("plantedQty", lang)} <span className="req">{tr("required", lang)}</span></label>
              <select value={locationId} onChange={(e) => pick(e.target.value)}>
                <option value="">{tr("choose", lang)}…</option>
                {awaiting.map((p) => (
                  <option key={p.locationId} value={p.locationId}>
                    {p.locationId} — {p.planted.toLocaleString("en-IN")} {en ? "planted" : "ನೆಟ್ಟದ್ದು"} · {p.plantedOn}
                  </option>
                ))}
              </select>
            </div>
            {planting && (
              <div className="ik-field">
                <label>{tr("coSignedBy", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={officerKey} onChange={(e) => setOfficerKey(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {eligible.map((a) => (
                    <option key={a.key} value={a.key}>{en ? a.en : a.kn} — {a.taluk}</option>
                  ))}
                </select>
                {v && <div className="hint">{tr("verifiedByLabel", lang)} {en ? v.officerEn : v.officerKn}</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {planting && (
        <>
          <div className="ik-group">
            <h2>{tr("survivingCount", lang)}</h2>
            <table className="ik-compare" style={{ maxWidth: 720 }}>
              <thead>
                <tr>
                  <th>{en ? "Species" : "ಪ್ರಭೇದ"}</th>
                  <th style={{ textAlign: "right" }}>{tr("plantedCount", lang)}</th>
                  <th style={{ textAlign: "right" }}>{tr("survivingCount", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {planting.lines.map((l) => (
                  <tr key={l.species.sci}>
                    <td><em>{l.species.sci}</em> · {l.species.local}</td>
                    <td style={{ textAlign: "right" }}>{l.planted.toLocaleString("en-IN")}</td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        value={counts[l.species.sci] ?? ""}
                        inputMode="numeric"
                        onChange={(e) => setCounts((c) => ({ ...c, [l.species.sci]: e.target.value }))}
                        style={{ width: 90, textAlign: "right", font: "inherit", fontSize: 13,
                                 padding: "5px 8px", border: "1px solid var(--line)", borderRadius: 5 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ik-plan" style={{ marginTop: 14, maxWidth: 720 }}>
              <div className="ik-plan-nums" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
                <span><b>{tr("plantedCount", lang)}</b>{totals.planted.toLocaleString("en-IN")}</span>
                <span><b>{tr("survivingCount", lang)}</b>{totals.surviving.toLocaleString("en-IN")}</span>
                <span>
                  <b>{tr("survivalComputed", lang)}</b>
                  <strong style={{ color: totals.survival < SURVIVAL_THRESHOLD ? "var(--red)" : "var(--green)" }}>
                    {totals.survival}%
                  </strong>
                </span>
              </div>
            </div>

            <div className="ik-field" style={{ maxWidth: 720, marginTop: 14 }}>
              <label>{tr("officerNotes", lang)}</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="ik-actions" style={{ marginTop: 14 }}>
              <button className="ik-btn" disabled={!complete} onClick={save}>{tr("saveCensus", lang)}</button>
            </div>
          </div>
        </>
      )}

      {censuses.length > 0 && (
        <>
          <h2 className="ik-h2">{tr("censusSaved", lang)} · {censuses.length}</h2>
          <div className="ik-rows">
            {censuses.map((c) => {
              const isOpen = open === c.locationId;
              const rect = rectifications.find((r) => r.locationId === c.locationId);
              return (
                <div key={c.locationId} className="ik-offer">
                  <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : c.locationId)}>
                    <span className="grow">
                      <span className="mono">
                        {c.locationId}{c.isNew && <em className="ik-new"> · {tr("justRecorded", lang)}</em>}
                      </span>
                      <span className="who">{en ? c.agencyEn : c.agencyKn}</span>
                      <span className="sub">
                        {tr("coSignedBy", lang)} {en ? c.auditOfficerEn : c.auditOfficerKn} · {c.countedOn}
                      </span>
                    </span>
                    <span className={`num ${c.survival < SURVIVAL_THRESHOLD ? "low" : ""}`}>{c.survival}%</span>
                  </button>

                  {isOpen && (
                    <div className="ik-offer-body">
                      <table className="ik-compare" style={{ maxWidth: 700 }}>
                        <tbody>
                          {c.lines.map((l) => (
                            <tr key={l.species.sci}>
                              <td><em>{l.species.sci}</em> · {l.species.local}</td>
                              <td style={{ textAlign: "right" }}>{l.planted.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "right" }}
                                  className={l.surviving < l.planted * 0.75 ? "diff" : ""}>
                                {l.surviving.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {c.notesEn && <p className="ik-line quote">{en ? c.notesEn : c.notesKn}</p>}
                      {rect && (
                        <div className={`ik-banner ${rect.state === "closed" ? "ok" : "bad"}`}>
                          <b>
                            {rect.state === "closed" ? tr("rectClosed", lang) : tr("openRectifications", lang)}
                          </b>
                          {en ? rect.reasonEn : rect.reasonKn}
                          <div style={{ marginTop: 6 }}>
                            {tr("ownerLabel", lang)}: {en ? rect.ownerEn : rect.ownerKn} · {rect.deadline}
                            {rect.escalatedToEn && ` · ${tr("escalatedTo", lang)} ${rect.escalatedToEn}`}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/ProgrammeStore";
import { tr } from "@/lib/intake";
import { AUDIT_CADRE, AUDIT_FINDINGS, mayAudit, type Audit } from "@/lib/census";

export default function AuditPage() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plantings, verifications, audits, rectifications, addAudit, closeRectification } = useOffers();

  const [officerKey, setOfficerKey] = useState(AUDIT_CADRE[0].key);
  const officer = AUDIT_CADRE.find((a) => a.key === officerKey)!;
  const [locationId, setLocationId] = useState("");
  const [decision, setDecision] = useState("");
  const [finding, setFinding] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  // parcels planted in this officer's taluk, not yet inspected
  const inTaluk = useMemo(
    () => plantings.filter((p) => {
      const v = verifications.find((x) => x.locationId === p.locationId);
      return v && !audits.some((a) => a.locationId === p.locationId);
    }),
    [plantings, verifications, audits],
  );

  const v = verifications.find((x) => x.locationId === locationId);
  const blocked = !!locationId && !mayAudit(officer, v?.officerKey);
  const complete = !!locationId && !blocked && !!decision && (decision === "cleared" || !!finding);

  const save = () => {
    if (!complete) return;
    const f = AUDIT_FINDINGS.find((x) => x[0] === finding);
    const a: Audit = {
      locationId,
      inspectedOn: en ? "today" : "ಇಂದು",
      officerKey: officer.key,
      officerEn: officer.en,
      officerKn: officer.kn,
      decision: decision === "cleared" ? "cleared" : "flagged",
      findingEn: f?.[0],
      findingKn: f?.[1],
      photographs: 11,
    };
    addAudit(a);
    setSaved(locationId);
    setLocationId("");
    setDecision("");
    setFinding("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const open = rectifications.filter((r) => r.state !== "closed");

  return (
    <div>
      {saved && (
        <div className="ik-banner ok">
          <b>{tr("auditSaved", lang)} — {saved}</b>
          {en
            ? "The inspection stands on the record independently of the agency's own count."
            : "ಸಂಸ್ಥೆಯ ಸ್ವಂತ ಎಣಿಕೆಯಿಂದ ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲನೆ ದಾಖಲೆಯಲ್ಲಿ ಉಳಿಯುತ್ತದೆ."}
        </div>
      )}

      <div className="ik-who">
        <div className="ik-who-row">
          <span className="k">{tr("auditOfficer", lang)}</span>
          <select className="ik-who-sel" value={officerKey}
                  onChange={(e) => { setOfficerKey(e.target.value); setSaved(null); }}>
            {AUDIT_CADRE.map((a) => (
              <option key={a.key} value={a.key}>{en ? a.en : a.kn} — {a.taluk}</option>
            ))}
          </select>
        </div>
        <div className="ik-who-sub">
          {officer.taluk}, {officer.district}
          {officer.alsoVerifies && (
            <> · <strong>{tr("alsoOnVerification", lang)}</strong></>
          )}
        </div>
      </div>

      <div className="ik-group">
        <h2>{tr("whichParcelAudit", lang)}</h2>
        {inTaluk.length === 0 ? (
          <p className="ik-note" style={{ marginTop: 0 }}>{tr("nothingToAudit", lang)}</p>
        ) : (
          <div className="ik-field" style={{ maxWidth: 680 }}>
            <label>{tr("plantedQty", lang)} <span className="req">{tr("required", lang)}</span></label>
            <select value={locationId} onChange={(e) => { setLocationId(e.target.value); setSaved(null); }}>
              <option value="">{tr("choose", lang)}…</option>
              {inTaluk.map((p) => (
                <option key={p.locationId} value={p.locationId}>
                  {p.locationId} — {p.planted.toLocaleString("en-IN")} {en ? "planted" : "ನೆಟ್ಟದ್ದು"} · {p.plantedOn}
                </option>
              ))}
            </select>
            {v && (
              <div className="hint">
                {tr("verifiedByLabel", lang)} {en ? v.officerEn : v.officerKn}
              </div>
            )}
          </div>
        )}
      </div>

      {blocked && (
        <div className="ik-banner bad">
          <b>{tr("cannotAudit", lang)}</b>
          {tr("cannotAuditWhy", lang)}
        </div>
      )}

      {locationId && !blocked && (
        <div className="ik-group">
          <h2>{tr("auditDecision", lang)}</h2>
          <div className="ik-fields" style={{ maxWidth: 740 }}>
            <div className="ik-field">
              <label>{tr("auditDecision", lang)} <span className="req">{tr("required", lang)}</span></label>
              <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                <option value="">{tr("choose", lang)}…</option>
                <option value="cleared">{tr("cleared", lang)}</option>
                <option value="flagged">{tr("flagged", lang)}</option>
              </select>
            </div>
            {decision === "flagged" && (
              <div className="ik-field">
                <label>{tr("finding", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={finding} onChange={(e) => setFinding(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {AUDIT_FINDINGS.map(([e2, k]) => (
                    <option key={e2} value={e2}>{en ? e2 : k}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="ik-actions" style={{ marginTop: 14 }}>
            <button className="ik-btn" disabled={!complete} onClick={save}>{tr("saveAudit", lang)}</button>
          </div>
        </div>
      )}

      {audits.length > 0 && (
        <>
          <h2 className="ik-h2">{tr("auditSaved", lang)} · {audits.length}</h2>
          <div className="ik-rows">
            {audits.map((a) => (
              <div key={a.locationId} className="ik-offer-head" style={{ cursor: "default" }}>
                <span className="grow">
                  <span className="mono">
                    {a.locationId}{a.isNew && <em className="ik-new"> · {tr("justRecorded", lang)}</em>}
                  </span>
                  <span className="who">{en ? a.officerEn : a.officerKn}</span>
                  <span className="sub">
                    {a.inspectedOn} · {a.photographs} {en ? "photographs" : "ಛಾಯಾಚಿತ್ರಗಳು"}
                    {a.findingEn && ` · ${en ? a.findingEn : a.findingKn}`}
                  </span>
                </span>
                <span className={`ik-stage s-${a.decision === "cleared" ? "approved" : "rejected"}`}>
                  {a.decision === "cleared" ? tr("cleared", lang) : tr("flagged", lang)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {open.length > 0 && (
        <>
          <h2 className="ik-h2">{tr("openRectifications", lang)} · {open.length}</h2>
          <div className="ik-rows">
            {open.map((r) => (
              <div key={r.locationId} className="ik-offer">
                <div className="ik-offer-body" style={{ background: "var(--panel)" }}>
                  <div className="mono">{r.locationId}</div>
                  <p className="ik-line reject" style={{ marginTop: 4 }}>
                    {en ? r.reasonEn : r.reasonKn}
                  </p>
                  <p className="ik-line">
                    <b>{tr("ownerLabel", lang)}:</b> {en ? r.ownerEn : r.ownerKn} · {r.deadline}
                    {r.escalatedToEn && <> · <b>{tr("escalatedTo", lang)}:</b> {r.escalatedToEn}</>}
                  </p>
                  {r.state === "open" && (
                    <div className="ik-actions" style={{ borderTop: 0, paddingTop: 8 }}>
                      <button className="ik-btn" onClick={() => closeRectification(r.locationId, false)}>
                        {tr("markClosed", lang)}
                      </button>
                      <button className="ik-btn ghost" onClick={() => closeRectification(r.locationId, true)}>
                        {tr("escalate", lang)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { differences, nextLocationId, pairs } from "@/lib/offers";
import WalkMap from "@/components/WalkMap";
import { QRCodeSVG } from "qrcode.react";

export default function Compare() {
  const { lang } = useDemo();
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const en = lang === "en";
  const { offers, verifications, addVerification, setOfferState } = useOffers();

  const [only, setOnly] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const all = useMemo(() => pairs(offers, verifications), [offers, verifications]);

  const list = useMemo(() => {
    if (only === "ready") return all.filter((p) => p.verification?.decision === "verified" && !p.verification.locationId);
    if (only === "issued") return all.filter((p) => p.verification?.locationId);
    if (only === "rejected") return all.filter((p) => p.verification?.decision === "rejected");
    if (only === "waiting") return all.filter((p) => !p.verification);
    return all.filter((p) => p.verification);
  }, [all, only]);

  const issue = (ref: string) => {
    const p = all.find((x) => x.offer.ref === ref);
    if (!p?.verification) return;
    addVerification({
      ...p.verification,
      locationId: nextLocationId(p.offer, verifications),
      issuedOn: en ? "today" : "ಇಂದು",
    });
    setOfferState(ref, "approved");
  };

  return (
    <div>
      <div className="filters">
        <label>
          <span>{tr("stage", lang)}</span>
          <select className="role" value={only} onChange={(e) => setOnly(e.target.value)}>
            <option value="">{en ? "Visited" : "ಭೇಟಿ ಆದವು"}</option>
            <option value="ready">{tr("readyToIssue", lang)}</option>
            <option value="issued">{tr("alreadyIssued", lang)}</option>
            <option value="rejected">{tr("notAccepted", lang)}</option>
            <option value="waiting">{tr("awaitingVisit", lang)}</option>
          </select>
        </label>
        <span className="filter-count">{list.length}</span>
      </div>

      <div className="ik-rows">
        {list.map((p) => {
          const o = p.offer;
          const v = p.verification;
          const rows = differences(p, lang);
          const diffs = v ? rows.filter((r) => r.declared !== r.found).length : 0;
          const isOpen = open === o.ref;
          const ready = v?.decision === "verified" && !v.locationId;
          return (
            <div key={o.ref} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : o.ref)}>
                <span className="grow">
                  <span className="mono">{o.ref}</span>
                  <span className="who">{o.village}, {en ? o.taluk : o.talukKn}</span>
                  <span className="sub">
                    {v
                      ? `${diffs} ${tr("differencesFound", lang)}${diffs === 0 ? " — " + tr("noDifference", lang) : ""}`
                      : tr("awaitingVisit", lang)}
                  </span>
                </span>
                {v?.locationId && <span className="mono ik-locid">{v.locationId}</span>}
                <span className={`ik-stage s-${v?.locationId ? "approved" : v?.decision === "rejected" ? "rejected" : v ? "verified" : "queued"}`}>
                  {v?.locationId ? tr("alreadyIssued", lang)
                    : v?.decision === "rejected" ? tr("notAccepted", lang)
                    : v ? tr("readyToIssue", lang)
                    : tr("awaitingVisit", lang)}
                </span>
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  {!v ? (
                    <p className="ik-note" style={{ marginTop: 0 }}>{tr("awaitingVisit", lang)}</p>
                  ) : (
                    <>
                      <table className="ik-compare">
                        <thead>
                          <tr>
                            <th></th>
                            <th>{tr("declared", lang)}</th>
                            <th>{tr("foundOnSite", lang)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.field}>
                              <td>{r.field}</td>
                              <td>{r.declared}</td>
                              <td className={r.declared !== r.found ? "diff" : ""}>{r.found}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <p className="ik-line">
                        <b>{tr("officer", lang)}:</b> {en ? v.officerEn : v.officerKn} · {tr("visitedOn", lang)} {v.visitedOn}
                      </p>
                      {v.notesEn && <p className="ik-line quote">{en ? v.notesEn : v.notesKn}</p>}
                      {v.walk && (
                        <div className="ik-split2" style={{ margin: "14px 0" }}>
                          <div><WalkMap walk={v.walk} height={170} /></div>
                          <div>
                            <table className="ik-compare" style={{ marginTop: 0 }}>
                              <tbody>
                                <tr><td>{tr("walkPoints", lang)}</td><td>{v.walk.vertexCount.toLocaleString("en-IN")}</td></tr>
                                <tr><td>{tr("walkAccuracy", lang)}</td><td>±{v.walk.gpsAccuracyM} m</td></tr>
                                <tr><td>{tr("walkPerimeter", lang)}</td><td>{v.walk.perimeterM.toLocaleString("en-IN")} m</td></tr>
                                <tr><td>{tr("walkCentroid", lang)}</td><td>{v.walk.centroid[1].toFixed(5)}, {v.walk.centroid[0].toFixed(5)}</td></tr>
                                <tr><td>{tr("walkDevice", lang)}</td><td>{v.walk.deviceId}</td></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <p className="ik-line">
                        <b>{tr("gateResult", lang)}:</b>{" "}
                        {v.gate.validGeometry
                          ? `${v.gate.vertices} ${tr("vertices", lang)} · ${v.gate.walkedHa.toFixed(2)} ha ${tr("vsRtc", lang)} ${v.gate.rtcHa.toFixed(2)} ha`
                          : en ? "Boundary invalid — the walk crosses itself" : "ಗಡಿ ಅಮಾನ್ಯ — ನಡಿಗೆ ತನ್ನನ್ನೇ ಕತ್ತರಿಸುತ್ತದೆ"}
                        {v.gate.overlapPct > 0 && ` · ${tr("overlapFound", lang)} ${v.gate.overlapPct}% (${v.gate.overlapWith})`}
                      </p>
                      {v.custodyEn && (
                        <p className="ik-line"><b>{tr("custodyBody", lang)}:</b> {en ? v.custodyEn : v.custodyKn}</p>
                      )}

                      {v.locationId ? (
                        <div className="ik-issued">
                          <div className="ik-issued-qr">
                            {origin && (
                              <QRCodeSVG
                                value={`${origin}/p/${v.locationId}`}
                                size={104}
                                level="M"
                                marginSize={0}
                                bgColor="#ffffff"
                                fgColor="#1c5a33"
                              />
                            )}
                            <div className="cap">{tr("scanThis", lang)}</div>
                          </div>
                          <div>
                            <div className="ik-issued-h">{tr("issued", lang)}</div>
                            <div className="ik-issued-id">{v.locationId}</div>
                            <p className="ik-line" style={{ marginTop: 8 }}>{tr("issuedNote", lang)}</p>
                            <p className="ik-line" style={{ color: "var(--muted)" }}>{tr("tagReady", lang)}</p>
                          </div>
                        </div>
                      ) : v.decision === "rejected" ? (
                        <div className="ik-banner bad" style={{ marginTop: 14 }}>
                          <b>{tr("cannotIssue", lang)}</b>
                          {en ? v.rejectionEn : v.rejectionKn}
                        </div>
                      ) : (
                        <div className="ik-actions" style={{ marginTop: 14 }}>
                          <button className="ik-btn" onClick={() => issue(o.ref)} disabled={!ready}>
                            {tr("issueId", lang)}
                          </button>
                        </div>
                      )}
                    </>
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

"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr, FIELDS } from "@/lib/intake";
import { CADRE, runGate, makeWalk, ZONES, SOILS, DEPTHS, SLOPES, DRAINAGE, type Verification, type Walk } from "@/lib/offers";
import WalkMap from "@/components/WalkMap";

const REASONS: [string, string][] = [
  ["Existing vegetation — tree cover already established", "ಈಗಿರುವ ಸಸ್ಯವರ್ಗ — ಈಗಾಗಲೇ ಮರಗಳಿವೆ"],
  ["Water availability — no source and no supply arrangement", "ನೀರಿನ ಲಭ್ಯತೆ — ಮೂಲವಿಲ್ಲ, ಪೂರೈಕೆಯೂ ಇಲ್ಲ"],
  ["Access — site cannot be reached for maintenance", "ದಾರಿ — ನಿರ್ವಹಣೆಗೆ ಸ್ಥಳ ತಲುಪಲಾಗದು"],
  ["Encroachment on the offered extent", "ನೀಡಿದ ವಿಸ್ತೀರ್ಣದಲ್ಲಿ ಒತ್ತುವರಿ"],
  ["Boundary dispute pending", "ಗಡಿ ವಿವಾದ ಬಾಕಿ"],
  ["Unsuitable soil for the zone species list", "ವಲಯದ ಪ್ರಭೇದಗಳಿಗೆ ಮಣ್ಣು ಸೂಕ್ತವಲ್ಲ"],
  ["Invalid boundary — the recorded walk crosses itself", "ಅಮಾನ್ಯ ಗಡಿ — ದಾಖಲಾದ ನಡಿಗೆ ತನ್ನನ್ನೇ ಕತ್ತರಿಸುತ್ತದೆ"],
];

const optionsFor = (key: string) => FIELDS.find((f) => f.key === key)?.options ?? [];

export default function RecordVisit() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { offers, verifications, addVerification, setOfferState } = useOffers();

  const [officerKey, setOfficerKey] = useState(CADRE[0].key);
  const officer = CADRE.find((c) => c.key === officerKey)!;
  const [ref, setRef] = useState("");

  const [walked, setWalked] = useState("");
  const [closed, setClosed] = useState(true);
  const [veg, setVeg] = useState("");
  const [water, setWater] = useState("");
  const [access, setAccess] = useState("");
  const [enc, setEnc] = useState("");
  const [disp, setDisp] = useState("");
  const [custody, setCustody] = useState("");
  const [notes, setNotes] = useState("");
  const [zone, setZone] = useState("");
  const [soil, setSoil] = useState("");
  const [depth, setDepth] = useState("");
  const [slope, setSlope] = useState("");
  const [drainage, setDrainage] = useState("");
  const [waterDist, setWaterDist] = useState("");
  const [address, setAddress] = useState("");
  const [landType, setLandType] = useState("");
  const [walk, setWalk] = useState<Walk | null>(null);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const queue = useMemo(
    () =>
      offers.filter(
        (o) =>
          o.taluk === officer.taluk &&
          (o.state === "assigned" || o.state === "queued") &&
          !verifications.some((v) => v.ref === o.ref),
      ),
    [offers, verifications, officer],
  );

  const offer = offers.find((o) => o.ref === ref) ?? null;

  const clear = () => {
    setWalked(""); setClosed(true); setVeg(""); setWater(""); setAccess("");
    setEnc(""); setDisp(""); setCustody(""); setNotes(""); setDecision(""); setReason("");
    setZone(""); setSoil(""); setDepth(""); setSlope(""); setDrainage("");
    setWaterDist(""); setAddress(""); setLandType(""); setWalk(null);
  };

  const pick = (r: string) => {
    clear();
    setSaved(null);
    setRef(r);
    const o = offers.find((x) => x.ref === r);
    if (o) setCustody(o.custodianProposed);
  };

  const fillExample = () => {
    if (!offer) return;
    setWalked((offer.offered * 0.94).toFixed(2));
    setClosed(true);
    setVeg(offer.vegetation);
    setWater(offer.water);
    setAccess(offer.access);
    setEnc(offer.encroach);
    setDisp(offer.dispute);
    setCustody(offer.custodianProposed);
    setNotes(
      en
        ? "Boundary walked with the village accountant present. A rocky strip on the eastern edge was excluded."
        : "ಗ್ರಾಮ ಲೆಕ್ಕಾಧಿಕಾರಿ ಸಮ್ಮುಖದಲ್ಲಿ ಗಡಿ ನಡೆಯಲಾಗಿದೆ. ಪೂರ್ವ ಅಂಚಿನ ಬಂಡೆ ಪಟ್ಟಿಯನ್ನು ಹೊರಗಿಡಲಾಗಿದೆ.",
    );
    setWalk(makeWalk(offer.lat, offer.lng, offer.offered * 0.94, offer.ref + "demo",
      `VER-${officer.taluk.slice(0, 3).toUpperCase()}-014`));
    setZone("centdry"); setSoil("redloam"); setDepth("medium");
    setSlope("gentle"); setDrainage("well"); setWaterDist("620");
    setAddress(en
      ? `${offer.village}, 1.2 km east of the Gram Panchayat office, north of the tank bund road`
      : `${offer.village}, ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಕಚೇರಿಯಿಂದ 1.2 ಕಿಮೀ ಪೂರ್ವ, ಕೆರೆ ಏರಿ ರಸ್ತೆಯ ಉತ್ತರ`);
    setLandType(offer.category);
    setDecision("verified");
    setReason("");
  };

  const complete =
    !!offer && !!walked && !!veg && !!water && !!access && !!enc && !!disp && !!decision &&
    !!zone && !!soil && !!depth && !!slope && !!drainage && !!address && !!walk &&
    (decision === "verified" ? !!custody && closed : !!reason);

  const submit = () => {
    if (!offer || !complete) return;
    const r = REASONS.find((x) => x[0] === reason);
    const v: Verification = {
      ref: offer.ref,
      officerKey: officer.key, officerEn: officer.en, officerKn: officer.kn,
      visitedOn: en ? "today" : "ಇಂದು",
      offered: walked,
      vegetation: veg, water, access, encroach: enc, dispute: disp,
      terrain: offer.terrain,
      zone, soil, depth, slope, drainage,
      waterDistance: waterDist,
      addressEn: address,
      landTypeConfirmed: landType,
      notesEn: notes, notesKn: notes,
      walk: walk ?? undefined,
      gate: runGate(offer, Number(walked) || 0, closed),
      decision: decision === "verified" ? "verified" : "rejected",
      rejectionEn: r ? r[0] : undefined,
      rejectionKn: r ? r[1] : undefined,
      custodyEn: decision === "verified" ? custody : undefined,
      custodyKn: decision === "verified" ? custody : undefined,
    };
    addVerification(v);
    setOfferState(offer.ref, decision === "verified" ? "verified" : "rejected");
    setSaved(offer.ref);
    setRef("");
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sel = (label: string, value: string, set: (v: string) => void, key0: string) => (
    <div className="ik-field">
      <label>{label} <span className="req">{tr("required", lang)}</span></label>
      <select value={value} onChange={(e) => set(e.target.value)}>
        <option value="">{tr("choose", lang)}…</option>
        {optionsFor(key0).map((o) => (
          <option key={o.en} value={o.en}>{en ? o.en : o.kn}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {saved && (
        <div className="ik-banner ok">
          <b>{tr("visitSaved", lang)} — {saved}</b>
          {tr("visitSavedNote", lang)}
        </div>
      )}

      <div className="ik-who">
        <div className="ik-who-row">
          <span className="k">{tr("officer", lang)}</span>
          <select
            className="ik-who-sel"
            value={officerKey}
            onChange={(e) => { setOfficerKey(e.target.value); setRef(""); clear(); setSaved(null); }}
          >
            {CADRE.map((c) => (
              <option key={c.key} value={c.key}>{(en ? c.en : c.kn)} — {c.taluk}</option>
            ))}
          </select>
        </div>
        <div className="ik-who-sub">
          {en
            ? officer.taluk + " taluk, " + officer.district + " · sees only parcels assigned here"
            : officer.taluk + " ತಾಲ್ಲೂಕು, " + officer.district + " · ಇಲ್ಲಿ ನಿಯೋಜಿತ ಜಮೀನುಗಳು ಮಾತ್ರ"}
        </div>
      </div>

      <div className="ik-group">
        <h2>{tr("whichParcel", lang)}</h2>
        {queue.length === 0 ? (
          <p className="ik-note" style={{ marginTop: 0 }}>{tr("nothingAssigned", lang)}</p>
        ) : (
          <div className="ik-field" style={{ maxWidth: 640 }}>
            <label>{tr("assignedToYou", lang)} <span className="req">{tr("required", lang)}</span></label>
            <select value={ref} onChange={(e) => pick(e.target.value)}>
              <option value="">{tr("choose", lang)}…</option>
              {queue.map((o) => (
                <option key={o.ref} value={o.ref}>
                  {o.ref} — {o.village}{o.survey !== "—" ? " · " + o.survey : ""} · {o.offered.toFixed(2)} ha
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {offer && (
        <>
          <div className="ik-declared">
            <div className="k">{tr("declared", lang)}</div>
            <div className="v">
              {en ? offer.deptEn : offer.deptKn} · {offer.offered.toFixed(2)} ha · {offer.vegetation} ·{" "}
              {offer.water} · {offer.access} · {en ? "encroachment" : "ಒತ್ತುವರಿ"} {offer.encroach}
            </div>
          </div>

          <div className="ik-group">
            <h2>{tr("boundaryWalk", lang)}</h2>
            <div className="ik-fields" style={{ maxWidth: 640 }}>
              <div className="ik-field">
                <label>{tr("walkedArea", lang)} <span className="req">{tr("required", lang)}</span></label>
                <input value={walked} inputMode="decimal" onChange={(e) => setWalked(e.target.value)} />
                <div className="hint">{tr("declaredWas", lang)} {offer.offered.toFixed(2)} ha</div>
              </div>
              <div className="ik-field">
                <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22 }}>
                  <input type="checkbox" checked={closed} style={{ width: "auto" }}
                         onChange={(e) => setClosed(e.target.checked)} />
                  {tr("geometryClosed", lang)}
                </label>
              </div>
            </div>

            <div className="ik-actions" style={{ borderTop: 0, paddingTop: 14 }}>
              <button
                className="ik-btn ghost"
                onClick={() =>
                  setWalk(makeWalk(offer.lat, offer.lng, Number(walked) || offer.offered,
                    offer.ref + officer.key,
                    `VER-${officer.taluk.slice(0, 3).toUpperCase()}-014`))
                }
              >
                {tr("recordWalk", lang)}
              </button>
            </div>

            {!walk ? (
              <p className="ik-note">{tr("walkNone", lang)}</p>
            ) : (
              <div className="ik-split2" style={{ marginTop: 14 }}>
                <div>
                  <WalkMap walk={walk} />
                </div>
                <div>
                  <table className="ik-compare" style={{ marginTop: 0 }}>
                    <tbody>
                      <tr><td>{tr("walkPoints", lang)}</td><td>{walk.vertexCount.toLocaleString("en-IN")}</td></tr>
                      <tr><td>{tr("walkAccuracy", lang)}</td><td>±{walk.gpsAccuracyM} m</td></tr>
                      <tr><td>{tr("walkPerimeter", lang)}</td><td>{walk.perimeterM.toLocaleString("en-IN")} m</td></tr>
                      <tr><td>{tr("walkTime", lang)}</td><td>{walk.startedAt} — {walk.endedAt}</td></tr>
                      <tr><td>{tr("walkCentroid", lang)}</td><td>{walk.centroid[1].toFixed(5)}, {walk.centroid[0].toFixed(5)}</td></tr>
                      <tr><td>{tr("walkDevice", lang)}</td><td>{walk.deviceId}</td></tr>
                      <tr><td>{tr("walkVersion", lang)}</td><td>v{walk.geomVersion} · {tr("walkTolerance", lang)} {walk.simplifyToleranceM} m</td></tr>
                    </tbody>
                  </table>
                  <p className="ik-note" style={{ marginTop: 8 }}>{tr("walkRaw", lang)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="ik-group">
            <h2>{tr("foundOnSite", lang)}</h2>
            <div className="ik-fields">
              {sel(en ? "Vegetation" : "ಸಸ್ಯವರ್ಗ", veg, setVeg, "vegetation")}
              {sel(en ? "Water availability" : "ನೀರಿನ ಲಭ್ಯತೆ", water, setWater, "water")}
              {sel(en ? "Access" : "ದಾರಿ", access, setAccess, "access")}
              {sel(en ? "Encroachment" : "ಒತ್ತುವರಿ", enc, setEnc, "encroach")}
              {sel(en ? "Boundary dispute" : "ಗಡಿ ವಿವಾದ", disp, setDisp, "dispute")}
            </div>
            <div className="ik-field" style={{ marginTop: 14, maxWidth: 740 }}>
              <label>{tr("officerNotes", lang)}</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="ik-group">
            <h2>{tr("siteSurvey", lang)}</h2>
            <p className="ik-note" style={{ marginTop: 0, marginBottom: 12 }}>{tr("surveyNote", lang)}</p>
            <div className="ik-field" style={{ maxWidth: 740, marginBottom: 14 }}>
              <label>{tr("fldAddress", lang)} <span className="req">{tr("required", lang)}</span></label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} />
              <div className="hint">{tr("fldAddressHint", lang)}</div>
            </div>
            <div className="ik-fields">
              <div className="ik-field">
                <label>{tr("fldZone", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {ZONES.map((z) => <option key={z.key} value={z.key}>{en ? z.en : z.kn}</option>)}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("fldSoil", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={soil} onChange={(e) => setSoil(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {SOILS.map((z) => <option key={z.key} value={z.key}>{en ? z.en : z.kn}</option>)}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("fldDepth", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={depth} onChange={(e) => setDepth(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {DEPTHS.map((z) => <option key={z.key} value={z.key}>{en ? z.en : z.kn}</option>)}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("fldSlope", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={slope} onChange={(e) => setSlope(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {SLOPES.map((z) => <option key={z.key} value={z.key}>{en ? z.en : z.kn}</option>)}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("fldDrainage", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={drainage} onChange={(e) => setDrainage(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {DRAINAGE.map((z) => <option key={z.key} value={z.key}>{en ? z.en : z.kn}</option>)}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("fldWaterDist", lang)}</label>
                <input value={waterDist} inputMode="decimal" placeholder="metres"
                       onChange={(e) => setWaterDist(e.target.value)} />
              </div>
              <div className="ik-field">
                <label>{tr("fldLandType", lang)}</label>
                <input value={landType} onChange={(e) => setLandType(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="ik-group">
            <h2>{tr("decide", lang)}</h2>
            <div className="ik-fields" style={{ maxWidth: 740 }}>
              <div className="ik-field">
                <label>{tr("decision", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  <option value="verified">{en ? "Verified — suitable" : "ಪರಿಶೀಲಿತ — ಸೂಕ್ತ"}</option>
                  <option value="rejected">{en ? "Not accepted" : "ಸ್ವೀಕರಿಸಿಲ್ಲ"}</option>
                </select>
              </div>
              {decision === "verified" && (
                <div className="ik-field">
                  <label>{tr("custodyBody", lang)} <span className="req">{tr("required", lang)}</span></label>
                  <input value={custody} onChange={(e) => setCustody(e.target.value)} />
                  <div className="hint">{tr("custodyNote", lang)}</div>
                </div>
              )}
              {decision === "rejected" && (
                <div className="ik-field">
                  <label>{tr("rejectReason", lang)} <span className="req">{tr("required", lang)}</span></label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="">{tr("choose", lang)}…</option>
                    {REASONS.map(([e2, k]) => <option key={e2} value={e2}>{en ? e2 : k}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="ik-actions">
            <button className="ik-btn" disabled={!complete} onClick={submit}>{tr("saveVisit", lang)}</button>
            <button className="ik-btn ghost" onClick={fillExample}>{tr("fillExample", lang)}</button>
            <button className="ik-btn ghost" onClick={clear}>{tr("clear", lang)}</button>
          </div>

          <p className="ik-note">{tr("noIdHere", lang)}</p>
        </>
      )}
    </div>
  );
}

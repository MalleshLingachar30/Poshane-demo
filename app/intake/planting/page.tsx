"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { AGENCIES, plantingGap, type Planting } from "@/lib/dispatch";

export default function PlantingPage() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { batches, plantings, addPlanting } = useOffers();

  const [locationId, setLocationId] = useState("");
  const [agencyKey, setAgencyKey] = useState(AGENCIES[0].key);
  const [notes, setNotes] = useState("");
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const awaiting = useMemo(
    () => batches.filter((b) => !plantings.some((p) => p.locationId === b.locationId)),
    [batches, plantings],
  );
  const batch = batches.find((b) => b.locationId === locationId) ?? null;
  const agency = AGENCIES.find((a) => a.key === agencyKey)!;

  const pick = (id: string) => {
    setLocationId(id);
    setSaved(null);
    const b = batches.find((x) => x.locationId === id);
    setCounts(Object.fromEntries((b?.lines ?? []).map((l) => [l.species.sci, String(l.quantity)])));
  };

  const record = () => {
    if (!batch) return;
    const lines = batch.lines.map((l) => ({
      species: l.species,
      dispatched: l.quantity,
      planted: Math.min(Number(counts[l.species.sci]) || 0, l.quantity),
    }));
    const p: Planting = {
      locationId: batch.locationId,
      plantedOn: en ? "today" : "ಇಂದು",
      agencyEn: agency.en,
      agencyKn: agency.kn,
      lines,
      planted: lines.reduce((a, l) => a + l.planted, 0),
      dispatched: lines.reduce((a, l) => a + l.dispatched, 0),
      pitsDug: lines.reduce((a, l) => a + l.dispatched, 0),
      photographs: 26,
      tagId: `TAG-${batch.locationId.replace("KA-", "")}`,
      notesEn: notes,
      notesKn: notes,
    };
    addPlanting(p);
    setSaved(p.locationId);
    setLocationId("");
    setNotes("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {saved && (
        <div className="ik-banner ok">
          <b>{saved}</b>
          {tr("plantedNow", lang)}
        </div>
      )}

      <div className="ik-group">
        <h2>{tr("whichParcelPlant", lang)}</h2>
        {awaiting.length === 0 ? (
          <p className="ik-note" style={{ marginTop: 0 }}>{tr("nothingToPlant", lang)}</p>
        ) : (
          <>
            <div className="ik-fields" style={{ maxWidth: 720 }}>
              <div className="ik-field">
                <label>{tr("awaitingPlanting", lang)} <span className="req">{tr("required", lang)}</span></label>
                <select value={locationId} onChange={(e) => pick(e.target.value)}>
                  <option value="">{tr("choose", lang)}…</option>
                  {awaiting.map((b) => (
                    <option key={b.locationId} value={b.locationId}>
                      {b.locationId} — {b.total.toLocaleString("en-IN")} {en ? "received" : "ಸ್ವೀಕೃತ"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ik-field">
                <label>{tr("agency", lang)}</label>
                <select value={agencyKey} onChange={(e) => setAgencyKey(e.target.value)}>
                  {AGENCIES.map((a) => (
                    <option key={a.key} value={a.key}>{en ? a.en : a.kn}</option>
                  ))}
                </select>
              </div>
            </div>

            {batch && (
              <>
                <table className="ik-compare" style={{ maxWidth: 700, marginTop: 14 }}>
                  <thead>
                    <tr>
                      <th>{en ? "Species" : "ಪ್ರಭೇದ"}</th>
                      <th style={{ textAlign: "right" }}>{tr("dispatched", lang)}</th>
                      <th style={{ textAlign: "right" }}>{tr("plantedQty", lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.lines.map((l) => (
                      <tr key={l.species.sci}>
                        <td><em>{l.species.sci}</em> · {l.species.local}</td>
                        <td style={{ textAlign: "right" }}>{l.quantity.toLocaleString("en-IN")}</td>
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

                <div className="ik-field" style={{ maxWidth: 720, marginTop: 14 }}>
                  <label>{tr("officerNotes", lang)}</label>
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <div className="hint">{tr("gapNote", lang)}</div>
                </div>

                <div className="ik-actions" style={{ marginTop: 14 }}>
                  <button className="ik-btn" onClick={record}>{tr("recordPlanting", lang)}</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <h2 className="ik-h2">{tr("plantedQty", lang)} · {plantings.length}</h2>
      <div className="ik-rows">
        {plantings.map((p) => {
          const isOpen = open === p.locationId;
          const gap = plantingGap(p);
          return (
            <div key={p.locationId} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : p.locationId)}>
                <span className="grow">
                  <span className="mono">
                    {p.locationId}{p.isNew && <em className="ik-new"> · {tr("justRecorded", lang)}</em>}
                  </span>
                  <span className="who">{en ? p.agencyEn : p.agencyKn}</span>
                  <span className="sub">
                    {p.planted.toLocaleString("en-IN")} {tr("plantedQty", lang).toLowerCase()} ·{" "}
                    {p.plantedOn} · {p.photographs} {en ? "photographs" : "ಛಾಯಾಚಿತ್ರಗಳು"}
                  </span>
                </span>
                {gap > 0 && (
                  <span className="ik-stage s-verified">{gap} {tr("notPlanted", lang)}</span>
                )}
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  <table className="ik-compare" style={{ maxWidth: 700 }}>
                    <thead>
                      <tr>
                        <th>{en ? "Species" : "ಪ್ರಭೇದ"}</th>
                        <th style={{ textAlign: "right" }}>{tr("dispatched", lang)}</th>
                        <th style={{ textAlign: "right" }}>{tr("plantedQty", lang)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.lines.map((l) => (
                        <tr key={l.species.sci}>
                          <td><em>{l.species.sci}</em> · {l.species.local}</td>
                          <td style={{ textAlign: "right" }}>{l.dispatched.toLocaleString("en-IN")}</td>
                          <td style={{ textAlign: "right" }}
                              className={l.planted < l.dispatched ? "diff" : ""}>
                            {l.planted.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {p.notesEn && <p className="ik-line quote">{en ? p.notesEn : p.notesKn}</p>}
                  <p className="ik-line">
                    <b>{tr("pitsDug", lang)}:</b> {p.pitsDug.toLocaleString("en-IN")} ·{" "}
                    <b>{tr("tagBound", lang)}:</b> <span className="mono">{p.tagId}</span>
                  </p>
                  {gap > 0 && <p className="ik-note" style={{ marginTop: 6 }}>{tr("gapNote", lang)}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { checkAgainstPlan, offPlan, type Batch } from "@/lib/dispatch";

export default function Dispatch() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plans, batches, addBatch } = useOffers();

  const [locationId, setLocationId] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // approved plans with nothing dispatched yet
  const awaiting = useMemo(
    () => plans.filter((p) => p.state === "approved" && !batches.some((b) => b.locationId === p.locationId)),
    [plans, batches],
  );

  const plan = plans.find((p) => p.locationId === locationId) ?? null;

  const record = () => {
    if (!plan) return;
    const lines = checkAgainstPlan(
      plan.locationId,
      plan.lines.filter((l) => l.included).map((l) => ({ species: l.species, quantity: l.count })),
      plans,
    );
    const b: Batch = {
      id: `BAT-${plan.locationId.split("-").slice(1, 3).join("-")}-${200 + batches.length}`,
      locationId: plan.locationId,
      nurseryName: `${plan.taluk} Range Nursery`,
      bag: '14" × 20"',
      raisedSeason: "Raised 2026–27",
      dispatchedOn: en ? "today" : "ಇಂದು",
      receivedByEn: `Site supervisor, ${plan.village}`,
      receivedByKn: `ಸ್ಥಳ ಮೇಲ್ವಿಚಾರಕ, ${plan.village}`,
      vehicle: "KA 16 B 4477",
      lines,
      total: lines.reduce((a, l) => a + l.quantity, 0),
    };
    addBatch(b);
    setSaved(b.id);
    setLocationId("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {saved && (
        <div className="ik-banner ok">
          <b>{tr("dispatched", lang)} — {saved}</b>
          {en
            ? "The batch is on the register below and the parcel is now awaiting planting."
            : "ಬ್ಯಾಚ್ ಕೆಳಗಿನ ನೋಂದಣಿಯಲ್ಲಿದೆ ಮತ್ತು ಜಮೀನು ಈಗ ನೆಡುವಿಕೆಗೆ ಕಾಯುತ್ತಿದೆ."}
        </div>
      )}

      <div className="ik-group">
        <h2>{tr("whichParcelDispatch", lang)}</h2>
        {awaiting.length === 0 ? (
          <p className="ik-note" style={{ marginTop: 0 }}>{tr("nothingToDispatch", lang)}</p>
        ) : (
          <>
            <div className="ik-field" style={{ maxWidth: 640 }}>
              <label>{tr("awaitingDispatch", lang)} <span className="req">{tr("required", lang)}</span></label>
              <select value={locationId} onChange={(e) => { setLocationId(e.target.value); setSaved(null); }}>
                <option value="">{tr("choose", lang)}…</option>
                {awaiting.map((p) => (
                  <option key={p.locationId} value={p.locationId}>
                    {p.locationId} — {p.village}, {p.taluk} · {p.lines.filter((l) => l.included).reduce((a, l) => a + l.count, 0).toLocaleString("en-IN")} {en ? "saplings" : "ಸಸಿಗಳು"}
                  </option>
                ))}
              </select>
            </div>

            {plan && (
              <>
                <table className="ik-compare" style={{ maxWidth: 660, marginTop: 14 }}>
                  <tbody>
                    {plan.lines.filter((l) => l.included).map((l) => (
                      <tr key={l.species.sci}>
                        <td style={{ width: "48%" }}><em>{l.species.sci}</em></td>
                        <td>{l.species.local}</td>
                        <td style={{ textAlign: "right" }}>{l.count.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="ik-actions" style={{ marginTop: 14 }}>
                  <button className="ik-btn" onClick={record}>{tr("dispatchIt", lang)}</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <h2 className="ik-h2">{tr("batch", lang)} · {batches.length}</h2>
      <div className="ik-rows">
        {batches.map((b) => {
          const isOpen = open === b.id;
          const off = offPlan(b);
          return (
            <div key={b.id} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : b.id)}>
                <span className="grow">
                  <span className="mono">
                    {b.id}{b.isNew && <em className="ik-new"> · {tr("justRecorded", lang)}</em>}
                  </span>
                  <span className="who">{b.locationId} · {b.nurseryName}</span>
                  <span className="sub">
                    {b.bag} · {b.total.toLocaleString("en-IN")} {tr("saplings", lang)} ·{" "}
                    {tr("dispatchedOn", lang)} {b.dispatchedOn}
                  </span>
                </span>
                {off.length > 0 && (
                  <span className="ik-stage s-rejected">{tr("offPlanTag", lang)}</span>
                )}
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  <table className="ik-compare" style={{ maxWidth: 680 }}>
                    <tbody>
                      {b.lines.map((l) => (
                        <tr key={l.species.sci}>
                          <td style={{ width: "44%" }}><em>{l.species.sci}</em></td>
                          <td>{l.species.local}</td>
                          <td className={l.inPlan ? "" : "diff"}>
                            {l.inPlan ? tr("inPlan", lang) : tr("offPlanTag", lang)}
                          </td>
                          <td style={{ textAlign: "right" }}>{l.quantity.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {off.length > 0 && (
                    <div className="ik-banner bad">
                      <b>{tr("offPlanTag", lang)}</b>
                      {tr("offPlanNote", lang)}
                    </div>
                  )}

                  <p className="ik-line">
                    <b>{tr("nursery", lang)}:</b> {b.nurseryName} · {b.raisedSeason}
                  </p>
                  <p className="ik-line">
                    <b>{tr("receivedBy", lang)}:</b> {en ? b.receivedByEn : b.receivedByKn} ·{" "}
                    <b>{tr("vehicle", lang)}:</b> {b.vehicle}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

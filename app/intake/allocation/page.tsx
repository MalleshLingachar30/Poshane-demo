"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { DEFAULT_MARGIN, nurseryDemand } from "@/lib/ssp";
import { demandCsv, LEAD_MONTHS, MONTH_NAMES, requirementFor, sowingMonth } from "@/lib/nurseries";

export default function NurseryRequirement() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plans } = useOffers();

  const [margin, setMargin] = useState(DEFAULT_MARGIN);
  const [month, setMonth] = useState(6);      // July, the planting monsoon
  const [year, setYear] = useState(2027);
  const [open, setOpen] = useState<string | null>(null);

  const demand = useMemo(() => nurseryDemand(plans, margin), [plans, margin]);
  const reqs = useMemo(() => demand.map(requirementFor), [demand]);

  const total = reqs.reduce((a, d) => a + d.total, 0);
  const locations = reqs.reduce((a, d) => a + d.nurseries.length, 0);

  const download = () => {
    const csv = demandCsv(reqs, month, year, margin);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `poshane-nursery-requirement-${MONTH_NAMES[month]}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="ik-banner warn" style={{ marginTop: 0 }}>
        <b>{tr("toRaiseHere", lang)}</b>
        {tr("additionalNote", lang)}
      </div>

      <div className="filters">
        <label>
          <span>{tr("plantingSeason", lang)}</span>
          <select className="role" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </label>
        <label>
          <span>&nbsp;</span>
          <select className="role" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2027, 2028, 2029, 2030].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label>
          <span>{tr("margin", lang)}</span>
          <select className="role" value={margin} onChange={(e) => setMargin(Number(e.target.value))}>
            {[0, 5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}%</option>)}
          </select>
        </label>
        <button className="ik-btn" onClick={download} disabled={reqs.length === 0}>
          {tr("downloadDemand", lang)}
        </button>
      </div>

      {reqs.length === 0 ? (
        <p className="ik-note">{tr("noApproved", lang)}</p>
      ) : (
        <>
          <div className="ik-counts">
            <div className="ik-count ok">
              <div className="v">{total.toLocaleString("en-IN")}</div>
              <div className="k">{tr("toRaise", lang)}</div>
            </div>
            <div className="ik-count warn">
              <div className="v">{locations}</div>
              <div className="k">{en ? "nursery locations" : "ನರ್ಸರಿ ಸ್ಥಳಗಳು"}</div>
            </div>
          </div>

          <div className="ik-rows">
            {reqs.map((d) => {
              const isOpen = open === d.district;
              return (
                <div key={d.district} className="ik-offer">
                  <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : d.district)}>
                    <span className="grow">
                      <span className="who">{d.district}</span>
                      <span className="sub">
                        {d.nurseries.length} {en ? "nursery locations" : "ನರ್ಸರಿ ಸ್ಥಳಗಳು"}
                        {d.unassigned > 0 && ` · ${d.unassigned.toLocaleString("en-IN")} ${tr("noNursery", lang)}`}
                      </span>
                    </span>
                    <span className="num">{d.total.toLocaleString("en-IN")}</span>
                  </button>

                  {isOpen && (
                    <div className="ik-offer-body">
                      {d.nurseries.map((n) => (
                        <div key={n.nursery.key} className="ik-nursery">
                          <div className="ik-nursery-head">
                            <div>
                              <div className="n">{n.nursery.name}</div>
                              <div className="t">
                                {n.nursery.division} · {n.nursery.taluk} ·{" "}
                                {tr("serves", lang)} {n.nursery.serves.join(", ")}
                              </div>
                            </div>
                            <div className="q">{n.total.toLocaleString("en-IN")}</div>
                          </div>

                          {n.byBag.map((b) => {
                            const lead = LEAD_MONTHS[b.bag] ?? 12;
                            const sow = sowingMonth(month, year, lead);
                            return (
                              <div key={b.bag}>
                                <div className="ik-nursery-when">
                                  {tr("bagSize", lang)} {b.bag} · {b.quantity.toLocaleString("en-IN")}{" "}
                                  {tr("saplings", lang)} · {tr("leadTime", lang)} {lead} {tr("months", lang)} ·{" "}
                                  <strong>{tr("sowingBegins", lang)} {sow.month} {sow.year}</strong>{" "}
                                  {en ? "for planting in" : "ನೆಡುವುದು"} {MONTH_NAMES[month]} {year}
                                </div>
                                <table className="ik-compare" style={{ marginTop: 6 }}>
                                  <tbody>
                                    {b.lines.map((l) => (
                                      <tr key={l.sci}>
                                        <td style={{ width: "50%" }}><em>{l.sci}</em></td>
                                        <td>{l.local}</td>
                                        <td style={{ textAlign: "right" }}>{l.quantity.toLocaleString("en-IN")}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
                        </div>
                      ))}

                      {d.unassigned > 0 && (
                        <div className="ik-banner bad">
                          <b>{tr("noNursery", lang)} — {d.unassigned.toLocaleString("en-IN")}</b>
                          {tr("noNurseryNote", lang)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="ik-note">{tr("nurseryMasterNote", lang)}</p>
        </>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { DEFAULT_MARGIN, nurseryDemand } from "@/lib/ssp";

export default function Nursery() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { plans } = useOffers();
  const [margin, setMargin] = useState(DEFAULT_MARGIN);
  const [open, setOpen] = useState<string | null>(null);

  const demand = useMemo(() => nurseryDemand(plans, margin), [plans, margin]);
  const totalPlanned = demand.reduce((a, d) => a + d.planned, 0);
  const totalRaise = demand.reduce((a, d) => a + d.withMargin, 0);
  const totalParcels = demand.reduce((a, d) => a + d.parcels, 0);

  return (
    <div>
      <div className="filters">
        <label>
          <span>{tr("margin", lang)}</span>
          <select className="role" value={margin} onChange={(e) => setMargin(Number(e.target.value))}>
            {[0, 5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}%</option>)}
          </select>
        </label>
        <span className="filter-count">
          {totalParcels} {tr("parcelsCount", lang)} · {demand.length} {en ? "districts" : "ಜಿಲ್ಲೆಗಳು"}
        </span>
      </div>
      <p className="ik-note" style={{ marginTop: 0 }}>{tr("marginNote", lang)}</p>

      {demand.length === 0 ? (
        <p className="ik-note">{tr("noApproved", lang)}</p>
      ) : (
        <>
          <div className="ik-counts" style={{ marginTop: 18 }}>
            <div className="ik-count ok">
              <div className="v">{totalRaise.toLocaleString("en-IN")}</div>
              <div className="k">{tr("toRaise", lang)}</div>
            </div>
            <div className="ik-count warn">
              <div className="v">{totalPlanned.toLocaleString("en-IN")}</div>
              <div className="k">{tr("planned", lang)}</div>
            </div>
          </div>

          <div className="ik-rows">
            {demand.map((d) => {
              const isOpen = open === d.district;
              return (
                <div key={d.district} className="ik-offer">
                  <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : d.district)}>
                    <span className="grow">
                      <span className="who">{d.district}</span>
                      <span className="sub">
                        {d.zoneEn} · {d.parcels} {tr("parcelsCount", lang)} · {d.lines.length}{" "}
                        {en ? "species" : "ಪ್ರಭೇದಗಳು"}
                      </span>
                    </span>
                    <span className="num">{d.withMargin.toLocaleString("en-IN")}</span>
                  </button>

                  {isOpen && (
                    <div className="ik-offer-body">
                      <table className="ik-compare">
                        <thead>
                          <tr>
                            <th>{en ? "Species" : "ಪ್ರಭೇದ"}</th>
                            <th>{tr("bagSize", lang)}</th>
                            <th style={{ textAlign: "right" }}>{tr("planned", lang)}</th>
                            <th style={{ textAlign: "right" }}>{tr("toRaise", lang)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d.lines.map((l) => (
                            <tr key={l.species.sci + l.bag}>
                              <td><em>{l.species.sci}</em> · {l.species.local}</td>
                              <td>{l.bag}</td>
                              <td style={{ textAlign: "right" }}>{l.planned.toLocaleString("en-IN")}</td>
                              <td style={{ textAlign: "right" }}>
                                <strong>{l.withMargin.toLocaleString("en-IN")}</strong>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2}><strong>{d.district}</strong></td>
                            <td style={{ textAlign: "right" }}>{d.planned.toLocaleString("en-IN")}</td>
                            <td style={{ textAlign: "right" }}>
                              <strong>{d.withMargin.toLocaleString("en-IN")}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="ik-note">{tr("demandNote", lang)}</p>
        </>
      )}
    </div>
  );
}

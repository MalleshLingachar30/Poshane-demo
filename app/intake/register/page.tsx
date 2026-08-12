"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/IntakeShell";
import { tr } from "@/lib/intake";
import { STATE_LABEL } from "@/lib/offers";

export default function OffersReceived() {
  const { lang } = useDemo();
  const en = lang === "en";
  const { offers } = useOffers();

  const [dept, setDept] = useState("");
  const [state, setState] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const depts = useMemo(() => {
    const m = new Map<string, string>();
    offers.forEach((o) => m.set(o.deptEn, o.deptKn));
    return [...m.entries()].sort();
  }, [offers]);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return offers.filter(
      (o) =>
        (!dept || o.deptEn === dept) &&
        (!state || o.state === state) &&
        (!n || o.ref.toLowerCase().includes(n) || o.survey.toLowerCase().includes(n) ||
          o.village.toLowerCase().includes(n) || o.taluk.toLowerCase().includes(n)),
    );
  }, [offers, dept, state, q]);

  return (
    <div>
      <div className="filters">
        <label>
          <span>{tr("department", lang)}</span>
          <select className="role" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">{tr("allDepartments", lang)}</option>
            {depts.map(([e2, k]) => <option key={e2} value={e2}>{en ? e2 : k}</option>)}
          </select>
        </label>
        <label>
          <span>{tr("stage", lang)}</span>
          <select className="role" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">{tr("allStates", lang)}</option>
            {Object.entries(STATE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{en ? v.en : v.kn}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{tr("searchParcelIk", lang)}</span>
          <input className="role" value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="OFR- / survey / village" style={{ minWidth: 200 }} />
        </label>
        <span className="filter-count">{list.length} {tr("offers", lang)}</span>
      </div>

      <div className="ik-rows">
        {list.map((o) => {
          const st = STATE_LABEL[o.state];
          const isOpen = open === o.ref;
          return (
            <div key={o.ref} className="ik-offer">
              <button className="ik-offer-head" onClick={() => setOpen(isOpen ? null : o.ref)}>
                <span className="grow">
                  <span className="mono">
                    {o.ref}{o.isNew && <em className="ik-new"> · {tr("justSubmitted", lang)}</em>}
                  </span>
                  <span className="who">
                    {o.village}, {en ? o.taluk : o.talukKn}
                    {o.survey !== "—" && ` · ${o.survey}`}
                  </span>
                  <span className="sub">
                    {en ? o.deptEn : o.deptKn} · {o.offered.toFixed(2)} ha · {o.submittedOn}
                  </span>
                </span>
                <span className={`ik-stage s-${o.state}`}>{en ? st.en : st.kn}</span>
              </button>

              {isOpen && (
                <div className="ik-offer-body">
                  <p className="ik-note" style={{ marginTop: 0, marginBottom: 12 }}>
                    {tr("asSubmitted", lang)}
                  </p>
                  <table className="ik-compare" style={{ maxWidth: 640 }}>
                    <tbody>
                      <tr><td>{tr("submittedBy", lang)}</td><td colSpan={2}>{en ? o.submitterEn : o.submitterKn}</td></tr>
                      <tr><td>{en ? "Hobli" : "ಹೋಬಳಿ"}</td><td colSpan={2}>{o.hobli || "—"}</td></tr>
                      <tr><td>{en ? "Land category" : "ಭೂಮಿಯ ವರ್ಗ"}</td><td colSpan={2}>{en ? o.category : o.categoryKn}</td></tr>
                      <tr><td>{en ? "RTC extent" : "ಆರ್‌ಟಿಸಿ ವಿಸ್ತೀರ್ಣ"}</td><td colSpan={2}>{o.rtc.toFixed(2)} ha</td></tr>
                      <tr><td>{en ? "Area offered" : "ನೀಡಿದ ವಿಸ್ತೀರ್ಣ"}</td><td colSpan={2}>{o.offered.toFixed(2)} ha</td></tr>
                      <tr><td>{en ? "Point" : "ಸ್ಥಾನ"}</td><td colSpan={2}>{o.lat.toFixed(5)}, {o.lng.toFixed(5)}</td></tr>
                      <tr><td>{en ? "Terrain" : "ಭೂಸ್ವರೂಪ"}</td><td colSpan={2}>{o.terrain}</td></tr>
                      <tr><td>{en ? "Vegetation" : "ಸಸ್ಯವರ್ಗ"}</td><td colSpan={2}>{o.vegetation}</td></tr>
                      <tr><td>{en ? "Water" : "ನೀರು"}</td><td colSpan={2}>{o.water}</td></tr>
                      <tr><td>{en ? "Access" : "ದಾರಿ"}</td><td colSpan={2}>{o.access}</td></tr>
                      <tr><td>{en ? "Encroachment" : "ಒತ್ತುವರಿ"}</td><td colSpan={2}>{o.encroach}</td></tr>
                      <tr><td>{en ? "Boundary dispute" : "ಗಡಿ ವಿವಾದ"}</td><td colSpan={2}>{o.dispute}</td></tr>
                      <tr><td>{en ? "Proposed custodian" : "ಪ್ರಸ್ತಾವಿತ ಪಾಲಕರು"}</td><td colSpan={2}>{o.custodianProposed}</td></tr>
                      <tr><td>{en ? "Proposed season" : "ಪ್ರಸ್ತಾವಿತ ಋತು"}</td><td colSpan={2}>{o.season}</td></tr>
                    </tbody>
                  </table>
                  <p className="ik-note">{tr("noIdYet", lang)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

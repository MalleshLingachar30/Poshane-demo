"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useSubmitter, useOffers } from "@/components/IntakeShell";
import { FIELDS, GROUPS, validate, tr, DISTRICTS, taluksFor, hoblisFor, EXAMPLE, type Row } from "@/lib/intake";

export default function AddParcel() {
  const { lang } = useDemo();
  const who = useSubmitter();
  const { offers, addOffer } = useOffers();
  const [ref, setRef] = useState<string | null>(null);
  const en = lang === "en";
  const [data, setData] = useState<Row>({});
  const [tried, setTried] = useState(false);
  const [demo, setDemo] = useState(false);
  const [done, setDone] = useState(false);

  const scoped: Row = useMemo(() => ({
    ...data,
    ...(who.district ? { district: who.district } : {}),
    ...(who.taluk ? { taluk: who.taluk } : {}),
  }), [data, who]);

  const lockedDistrict = who.level !== "state";
  const lockedTaluk = who.level === "taluk";

  const verdict = useMemo(() => validate([scoped])[0], [scoped]);
  const errFor = (k: string) => verdict.errors.find((e) => e.field === k);
  const flagFor = (k: string) => verdict.flags.find((f) => f.field === k);

  const set = (k: string, v: string) => {
    setDone(false);
    // changing the district invalidates any taluk chosen under the previous one
    if (k === "district") {
      setFreeText((x) => ({ ...x, taluk: false, hobli: false }));
      setData((d) => ({ ...d, district: v, taluk: "", hobli: "" }));
    } else if (k === "taluk") {
      setFreeText((x) => ({ ...x, hobli: false }));
      setData((d) => ({ ...d, taluk: v, hobli: "" }));
    } else {
      setData((d) => ({ ...d, [k]: v }));
    }
  };

  const [freeText, setFreeText] = useState<Record<string, boolean>>({});

  const listFor = (kind?: string): string[] =>
    kind === "district" ? DISTRICTS
    : kind === "taluk" ? taluksFor(scoped.district ?? "")
    : kind === "hobli" ? hoblisFor(scoped.district ?? "", scoped.taluk ?? "")
    : [];

  const submit = () => {
    setTried(true);
    if (verdict.errors.length === 0) {
      const dc = (scoped.district ?? "").slice(0, 3).toUpperCase();
      const tc = (scoped.taluk ?? "").slice(0, 3).toUpperCase();
      const newRef = `OFR-${dc}-${tc}-${String(70 + offers.length).padStart(4, "0")}`;
      addOffer({
        ref: newRef,
        submittedOn: "today",
        deptEn: who.deptEn, deptKn: who.deptKn,
        submitterEn: who.en, submitterKn: who.kn,
        district: scoped.district ?? "", districtKn: scoped.district ?? "",
        taluk: scoped.taluk ?? "", talukKn: scoped.taluk ?? "",
        hobli: scoped.hobli ?? "", village: scoped.village ?? "",
        survey: scoped.survey ?? "—",
        category: scoped.category ?? "", categoryKn: scoped.category ?? "",
        rtc: Number(scoped.rtc) || 0, offered: Number(scoped.offered) || 0,
        lat: Number(scoped.lat) || 0, lng: Number(scoped.lng) || 0,
        terrain: scoped.terrain ?? "", vegetation: scoped.vegetation ?? "",
        water: scoped.water ?? "", access: scoped.access ?? "",
        encroach: scoped.encroach ?? "", dispute: scoped.dispute ?? "",
        custodianProposed: scoped.custodian ?? "",
        season: scoped.season ?? "",
        state: "submitted",
      });
      setRef(newRef);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      {done && (
        <div className="ik-banner ok">
          <b>{tr("accepted", lang)}</b>
          {tr("offerRef", lang)}: <strong>{ref}</strong>.{" "}
          {en
            ? "It is now at the top of the Register, awaiting a verification officer. No Location ID is issued yet."
            : "ಈಗ ಅದು ನೋಂದಣಿಯ ಮೇಲ್ಭಾಗದಲ್ಲಿದೆ, ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿಗಾಗಿ ಕಾಯುತ್ತಿದೆ. ಇನ್ನೂ ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಿಲ್ಲ."}
        </div>
      )}
      {tried && verdict.errors.length > 0 && (
        <div className="ik-banner bad">
          <b>{tr("fixFirst", lang)}</b>
          {verdict.errors.length} {en ? "field(s) need attention." : "ಕ್ಷೇತ್ರಗಳಿಗೆ ಗಮನ ಬೇಕು."}
        </div>
      )}

      {GROUPS.map((g) => (
        <div className="ik-group" key={g.key}>
          <h2>{en ? g.en : g.kn}</h2>
          <div className="ik-fields">
            {FIELDS.filter((f) => f.group === g.key).map((f) => {
              const e = tried ? errFor(f.key) : undefined;
              const fl = flagFor(f.key);
              return (
                <div className={`ik-field${e ? " bad" : ""}`} key={f.key}>
                  <label htmlFor={f.key}>
                    {en ? f.en : f.kn}
                    <span className={f.required ? "req" : "opt"}>
                      {f.required ? tr("required", lang) : tr("optional", lang)}
                    </span>
                  </label>
                  {(f.key === "district" && lockedDistrict) || (f.key === "taluk" && lockedTaluk) ? (
                    <div className="ik-locked">
                      <span>{f.key === "district" ? who.district : who.taluk}</span>
                      <span className="tagline">— {tr("fromPosting", lang)}</span>
                    </div>
                  ) : f.type === "select" ? (
                    <select id={f.key} value={scoped[f.key] ?? ""} onChange={(ev) => set(f.key, ev.target.value)}>
                      <option value="">{tr("choose", lang)}…</option>
                      {f.options!.map((o) => (
                        <option key={o.en} value={o.en}>{en ? o.en : o.kn}</option>
                      ))}
                    </select>
                  ) : f.type === "combo" ? (
                    (() => {
                      const list = listFor(f.suggest);
                      const v = scoped[f.key] ?? "";
                      const typing = freeText[f.key] || (!!v && !list.includes(v));
                      if (list.length === 0 || typing) {
                        return (
                          <input
                            id={f.key}
                            autoComplete="off"
                            name={`poshane-${f.key}`}
                            placeholder={
                              f.suggest === "taluk" && !data.district
                                ? tr("pickDistrictFirst", lang)
                                : tr("typeTheName", lang)
                            }
                            value={v}
                            onChange={(ev) => set(f.key, ev.target.value)}
                          />
                        );
                      }
                      return (
                        <select
                          id={f.key}
                          value={v}
                          onChange={(ev) => {
                            if (ev.target.value === "__other__") {
                              setFreeText((x) => ({ ...x, [f.key]: true }));
                              set(f.key, "");
                            } else set(f.key, ev.target.value);
                          }}
                        >
                          <option value="">{tr("choose", lang)}…</option>
                          {list.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                          <option value="__other__">{tr("otherNotListed", lang)}</option>
                        </select>
                      );
                    })()
                  ) : (
                    <input
                      id={f.key}
                      inputMode={f.type === "number" || f.type === "coord" ? "decimal" : "text"}
                      value={scoped[f.key] ?? ""}
                      onChange={(ev) => set(f.key, ev.target.value)}
                    />
                  )}
                  {f.hint && !e && <div className="hint">{en ? f.hint.en : f.hint.kn}</div>}
                  {e && <div className="err">{en ? e.en : e.kn}</div>}
                  {!e && fl && <div className="flag">{en ? fl.en : fl.kn}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="ik-actions">
        <button className="ik-btn" onClick={submit}>{tr("submit", lang)}</button>
        <button className="ik-btn ghost" onClick={() => {
          setData({ ...EXAMPLE }); setFreeText({}); setTried(false); setDone(false); setDemo(true);
        }}>
          {tr("fillExample", lang)}
        </button>
        <button className="ik-btn ghost" onClick={() => {
          setData({}); setFreeText({}); setTried(false); setDone(false); setDemo(false);
        }}>
          {tr("clear", lang)}
        </button>
        {demo && <span style={{ fontSize: 12, color: "var(--muted)" }}>{tr("exampleNote", lang)}</span>}
      </div>

      <p className="ik-note">
        {en
          ? "District and taluk come from the submitting officer's posting, not from a free choice — an officer posted to one district cannot record land in another. Below that, hobli steps down the same administrative hierarchy — choosing a district narrows the taluk list, and choosing a taluk narrows the hobli list. Every list carries an Other option, because a newly formed taluk must never be a dead end. The hobli lists are not populated in this demonstration; the field is wired to the same hierarchy and fills from the state administrative master."
          : "ಜಿಲ್ಲೆ ಮತ್ತು ತಾಲ್ಲೂಕು ಸಲ್ಲಿಸುವ ಅಧಿಕಾರಿಯ ವ್ಯಾಪ್ತಿಯಿಂದ ಬರುತ್ತವೆ, ಮುಕ್ತ ಆಯ್ಕೆಯಿಂದಲ್ಲ — ಒಂದು ಜಿಲ್ಲೆಗೆ ನಿಯೋಜಿತ ಅಧಿಕಾರಿ ಇನ್ನೊಂದು ಜಿಲ್ಲೆಯ ಭೂಮಿಯನ್ನು ದಾಖಲಿಸಲಾರರು. ಅದರ ಕೆಳಗೆ ಹೋಬಳಿಯೂ ಅದೇ ಆಡಳಿತ ಶ್ರೇಣಿಯನ್ನು ಅನುಸರಿಸುತ್ತದೆ — ಜಿಲ್ಲೆ ಆರಿಸಿದರೆ ತಾಲ್ಲೂಕು ಪಟ್ಟಿ, ತಾಲ್ಲೂಕು ಆರಿಸಿದರೆ ಹೋಬಳಿ ಪಟ್ಟಿ ಸೀಮಿತವಾಗುತ್ತದೆ. ಪ್ರತಿ ಪಟ್ಟಿಯಲ್ಲೂ ‘ಇತರೆ’ ಆಯ್ಕೆ ಇದೆ — ಹೊಸ ತಾಲ್ಲೂಕು ಎಂದಿಗೂ ತಡೆಯಾಗಬಾರದು. ಈ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಲ್ಲಿ ಹೋಬಳಿ ಪಟ್ಟಿಗಳನ್ನು ತುಂಬಿಸಿಲ್ಲ; ಕ್ಷೇತ್ರ ಅದೇ ಶ್ರೇಣಿಗೆ ಜೋಡಣೆಯಾಗಿದ್ದು ರಾಜ್ಯದ ಆಡಳಿತ ಮಾಸ್ಟರ್‌ನಿಂದ ತುಂಬುತ್ತದೆ."}
      </p>

      <p className="ik-note">
        {en
          ? "Flags do not block a submission. They tell the officer what to expect, and they are the six reasons §6.3 allows a parcel to be rejected — declared here, they are checked at the desk rather than discovered after a drive."
          : "ಗುರುತುಗಳು ಸಲ್ಲಿಕೆಯನ್ನು ತಡೆಯುವುದಿಲ್ಲ. ಅಧಿಕಾರಿಗೆ ಏನನ್ನು ನಿರೀಕ್ಷಿಸಬೇಕೆಂದು ತಿಳಿಸುತ್ತವೆ — ಇವು ಜಮೀನು ತಿರಸ್ಕೃತವಾಗಬಹುದಾದ ಆರು ಕಾರಣಗಳು. ಇಲ್ಲಿ ತಿಳಿಸಿದರೆ ಪ್ರಯಾಣದ ನಂತರ ಅಲ್ಲ, ಕಚೇರಿಯಲ್ಲೇ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ."}
      </p>
    </div>
  );
}

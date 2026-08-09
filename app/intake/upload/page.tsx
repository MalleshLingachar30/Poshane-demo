"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { useSubmitter } from "@/components/IntakeShell";
import { parseTable, validate, tr, HEADERS, FIELDS, SAMPLE, scopeErrors, type Verdict } from "@/lib/intake";

export default function UploadSheet() {
  const { lang } = useDemo();
  const who = useSubmitter();
  const en = lang === "en";
  const [text, setText] = useState("");
  const [checked, setChecked] = useState<{
    verdicts: Verdict[];
    missing: string[];
    unknown: string[];
  } | null>(null);
  const [committed, setCommitted] = useState(0);

  const run = () => {
    const { rows, missing, unknown } = parseTable(text);
    setCommitted(0);
    const verdicts = validate(rows).map((v) => ({
      ...v,
      errors: [...v.errors, ...scopeErrors(v.data, who, lang)],
    }));
    setChecked({ verdicts, missing, unknown });
  };

  const readFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { setText(String(r.result)); setChecked(null); setCommitted(0); };
    r.readAsText(file);
  };

  const downloadErrors = () => {
    if (!checked) return;
    const bad = checked.verdicts.filter((v) => v.errors.length);
    const head = [...HEADERS, "Reason for rejection"].join(",");
    const esc = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    const lines = bad.map((v) =>
      [...FIELDS.map((f) => esc(v.data[f.key] ?? "")),
       esc(v.errors.map((e) => (en ? e.en : e.kn)).join("; "))].join(","),
    );
    const blob = new Blob([[head, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rejected-rows.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const ok = checked?.verdicts.filter((v) => !v.errors.length) ?? [];
  const bad = checked?.verdicts.filter((v) => v.errors.length) ?? [];
  const flagged = ok.filter((v) => v.flags.length);
  const headerProblem = !!checked && checked.missing.length > 0;

  return (
    <div>
      {committed > 0 && (
        <div className="ik-banner ok">
          <b>{tr("committed", lang)}</b>
          {committed} {en ? "parcels entered the verification queue." : "ಜಮೀನುಗಳು ಪರಿಶೀಲನಾ ಸರತಿಗೆ ಸೇರಿದವು."}
        </div>
      )}

      {!checked && (
        <>
          <div className="ik-group">
            <h2>{tr("paste", lang)}</h2>
            <p className="ik-note" style={{ marginTop: 0, marginBottom: 10 }}>{tr("pasteHint", lang)}</p>
            <textarea
              className="ik-paste"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={HEADERS.slice(0, 6).join("\t") + "\t…"}
            />
            <div className="ik-actions" style={{ borderTop: 0, paddingTop: 14 }}>
              <button className="ik-btn" onClick={run} disabled={!text.trim()}>{tr("check", lang)}</button>
              <label className="ik-btn ghost" style={{ display: "inline-block" }}>
                {tr("orFile", lang)}
                <input type="file" accept=".csv,text/csv,text/plain"
                       style={{ display: "none" }}
                       onChange={(e) => readFile(e.target.files?.[0])} />
              </label>
              <button className="ik-btn ghost" onClick={() => { setText(SAMPLE); setChecked(null); }}>
                {tr("sample", lang)}
              </button>
            </div>
          </div>
          <p className="ik-note">{tr("allOrNothing", lang)}</p>
        </>
      )}

      {checked && (
        <>
          {headerProblem ? (
            <div className="ik-banner bad">
              <b>{tr("headerProblem", lang)}</b>
              {tr("missingCols", lang)}: {checked.missing.join(", ")}
            </div>
          ) : (
            <>
              {checked.unknown.length > 0 && (
                <div className="ik-banner warn">
                  <b>{tr("unknownCols", lang)}</b>
                  {checked.unknown.join(", ")}
                </div>
              )}

              <div className="ik-counts">
                <div className="ik-count ok">
                  <div className="v">{ok.length}</div>
                  <div className="k">{tr("ok", lang)}</div>
                </div>
                <div className="ik-count bad">
                  <div className="v">{bad.length}</div>
                  <div className="k">{tr("rejected", lang)}</div>
                </div>
                <div className="ik-count warn">
                  <div className="v">{flagged.length}</div>
                  <div className="k">{tr("flagged", lang)}</div>
                </div>
              </div>

              {checked.verdicts.length === 0 && <p className="ik-note">{tr("noRows", lang)}</p>}

              <div className="ik-rows">
                {checked.verdicts.map((v) => (
                  <div className={`ik-row${v.errors.length ? " bad" : ""}`} key={v.row}>
                    <div className="num">{tr("row", lang)} {v.row}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="who">
                        {v.data.village || "—"}
                        {v.data.survey ? ` · ${v.data.survey}` : ""}
                        {v.errors.length === 0 && <span className="tick"> ✓</span>}
                      </div>
                      <div className="sub">
                        {[v.data.taluk, v.data.district].filter(Boolean).join(", ")}
                        {v.data.offered ? ` · ${v.data.offered} ha` : ""}
                      </div>
                      {(v.errors.length > 0 || v.flags.length > 0) && (
                        <ul>
                          {v.errors.map((e, i) => <li className="e" key={`e${i}`}>{en ? e.en : e.kn}</li>)}
                          {v.flags.map((f, i) => <li className="f" key={`f${i}`}>{en ? f.en : f.kn}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="ik-actions" style={{ marginTop: 20 }}>
            <button className="ik-btn" disabled={headerProblem || ok.length === 0}
                    onClick={() => setCommitted(ok.length)}>
              {tr("commit", lang)} ({ok.length})
            </button>
            {bad.length > 0 && (
              <button className="ik-btn ghost" onClick={downloadErrors}>{tr("downloadErrors", lang)}</button>
            )}
            <button className="ik-btn ghost" onClick={() => { setChecked(null); setCommitted(0); }}>
              {tr("reset", lang)}
            </button>
          </div>

          <p className="ik-note">{tr("allOrNothing", lang)}</p>
        </>
      )}
    </div>
  );
}

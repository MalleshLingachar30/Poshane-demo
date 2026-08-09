"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { FIELDS, HEADERS, SAMPLE, tr } from "@/lib/intake";

export default function Template() {
  const { lang } = useDemo();
  const en = lang === "en";
  const [copied, setCopied] = useState(false);

  const download = () => {
    const example = SAMPLE.split("\n")[1].split("\t");
    const esc = (x: string) => `"${(x ?? "").replace(/"/g, '""')}"`;
    const csv = [HEADERS.map(esc).join(","), example.map(esc).join(",")].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "poshane-land-availability.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copy = () => {
    navigator.clipboard.writeText(HEADERS.join("\t"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="ik-group">
        <h2>{en ? "Start a district sheet" : "ಜಿಲ್ಲಾ ಶೀಟ್ ಆರಂಭಿಸಿ"}</h2>
        <p className="ik-note" style={{ marginTop: 0, marginBottom: 10 }}>{tr("templateWhat", lang)}</p>
        <div className="ik-headers">{HEADERS.join("  ·  ")}</div>
        <div className="ik-actions" style={{ borderTop: 0, paddingTop: 14 }}>
          <button className="ik-btn" onClick={download}>{tr("downloadCsv", lang)}</button>
          <button className="ik-btn ghost" onClick={copy}>
            {copied ? tr("copied", lang) : tr("copyHeaders", lang)}
          </button>
        </div>
      </div>

      <div className="ik-group">
        <h2>{en ? "What each column is for" : "ಪ್ರತಿ ಕಾಲಂ ಯಾವುದಕ್ಕಾಗಿ"}</h2>
        <table className="ik-dict">
          <thead>
            <tr>
              <th>{en ? "Column" : "ಕಾಲಂ"}</th>
              <th>{en ? "Required" : "ಅಗತ್ಯವೇ"}</th>
              <th>{en ? "Accepted values" : "ಸ್ವೀಕೃತ ಮೌಲ್ಯಗಳು"}</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.key}>
                <td>{f.header}</td>
                <td className={f.required ? "r" : "o"}>
                  {f.required ? tr("required", lang) : tr("optional", lang)}
                </td>
                <td>
                  {f.type === "select"
                    ? f.options!.map((o) => (en ? o.en : o.kn)).join(" · ")
                    : f.type === "coord"
                      ? en ? "Decimal degrees, within Karnataka" : "ದಶಮಾಂಶ ಡಿಗ್ರಿ, ಕರ್ನಾಟಕದ ಒಳಗೆ"
                      : f.type === "number"
                        ? en ? "A number greater than zero" : "ಶೂನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆ"
                        : en ? "Free text" : "ಮುಕ್ತ ಪಠ್ಯ"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="ik-note">
        {en
          ? "The workbook version of this template carries the same columns with dropdowns already built in, plus an instructions sheet and a data dictionary."
          : "ಈ ನಮೂನೆಯ ವರ್ಕ್‌ಬುಕ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಇದೇ ಕಾಲಂಗಳು ಡ್ರಾಪ್‌ಡೌನ್‌ಗಳೊಂದಿಗೆ ಇವೆ, ಜೊತೆಗೆ ಸೂಚನಾ ಹಾಳೆ ಮತ್ತು ದತ್ತಾಂಶ ನಿಘಂಟು."}
      </p>
    </div>
  );
}

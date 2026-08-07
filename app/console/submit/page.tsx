"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";

type Draw = "duplicate" | "adjacent" | null;

const APPROVED: [number, number][] = [
  [90, 60],
  [330, 60],
  [330, 180],
  [90, 180],
];

const DUPLICATE: [number, number][] = [
  [126, 78],
  [366, 78],
  [366, 198],
  [126, 198],
];

const ADJACENT: [number, number][] = [
  [325, 60],
  [510, 60],
  [510, 180],
  [325, 180],
];

export default function SubmitGate() {
  const { lang } = useDemo();
  const en = lang === "en";
  const [draw, setDraw] = useState<Draw>(null);
  const [ran, setRan] = useState(false);

  const candidate =
    draw === "duplicate" ? DUPLICATE : draw === "adjacent" ? ADJACENT : null;
  const pct = draw === "duplicate" ? 72.3 : draw === "adjacent" ? 2.0 : 0;
  const areaHa = draw === "duplicate" ? 1.45 : 0.04;
  const blocked = draw === "duplicate";

  return (
    <main>
      <h1 className="page">{tr("drawBoundary", lang)}</h1>
      <p className="lede">
        {en
          ? "The verification officer walks the boundary. Before a Location ID can be issued, the geometry is tested against every parcel already in the register."
          : "ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ ಗಡಿಯನ್ನು ನಡೆದು ದಾಖಲಿಸುತ್ತಾರೆ. ಲೊಕೇಶನ್ ಐಡಿ ನೀಡುವ ಮೊದಲು, ನೋಂದಣಿಯಲ್ಲಿರುವ ಪ್ರತಿ ಜಮೀನಿನೊಂದಿಗೆ ಈ ಗಡಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ."}
      </p>

      <div className="card">
        <svg viewBox="0 0 600 240" width="100%" role="img" aria-label="Boundary check">
          <rect x="0" y="0" width="600" height="240" fill="var(--green-tint)" rx="8" />
          <polygon
            points={APPROVED.map((p) => p.join(",")).join(" ")}
            fill="#1c5a33"
            fillOpacity="0.18"
            stroke="#1c5a33"
            strokeWidth="2"
          />
          <text x="98" y="52" fontSize="12" fill="#1c5a33">
            KA-CTD-HSD-0417 — {en ? "approved" : "ಅನುಮೋದಿತ"}
          </text>
          {candidate && (
            <>
              <polygon
                points={candidate.map((p) => p.join(",")).join(" ")}
                fill={blocked ? "#9c2f2f" : "#27467a"}
                fillOpacity="0.2"
                stroke={blocked ? "#9c2f2f" : "#27467a"}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={candidate[1][0] - 4}
                y={candidate[2][1] + 18}
                fontSize="12"
                textAnchor="end"
                fill={blocked ? "#9c2f2f" : "#27467a"}
              >
                {en ? "new submission" : "ಹೊಸ ಸಲ್ಲಿಕೆ"}
              </text>
            </>
          )}
        </svg>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button
            className={draw === "duplicate" ? "act" : "act ghost"}
            onClick={() => {
              setDraw("duplicate");
              setRan(false);
            }}
          >
            {en ? "Draw over an approved parcel" : "ಅನುಮೋದಿತ ಜಮೀನಿನ ಮೇಲೆ ಎಳೆಯಿರಿ"}
          </button>
          <button
            className={draw === "adjacent" ? "act" : "act ghost"}
            onClick={() => {
              setDraw("adjacent");
              setRan(false);
            }}
          >
            {en ? "Draw an adjacent parcel" : "ಪಕ್ಕದ ಜಮೀನು ಎಳೆಯಿರಿ"}
          </button>
          <button className="act" disabled={!draw || ran} onClick={() => setRan(true)}>
            {tr("runGate", lang)}
          </button>
          <button
            className="act ghost"
            onClick={() => {
              setDraw(null);
              setRan(false);
            }}
          >
            {tr("reset", lang)}
          </button>
        </div>

        {ran && draw && (
          <div className={`verdict ${blocked ? "block" : "ok"}`}>
            <div className="head">
              {blocked ? tr("blocked", lang) : tr("tolerated", lang)}
            </div>
            <div className="body">
              {tr("overlapWith", lang)} KA-CTD-HSD-0417 — {areaHa.toFixed(2)}{" "}
              {tr("ha", lang)}, {pct.toFixed(1)}% {tr("ofSmaller", lang)}.
            </div>
            <div className="body">
              {blocked
                ? tr("noLocationId", lang)
                : en
                  ? "Within the 5% sliver tolerance for GPS error. Logged, and the shared edge is snapped."
                  : "ಜಿಪಿಎಸ್ ದೋಷಕ್ಕಾಗಿ ನೀಡಲಾದ 5% ಸಹನೆಯೊಳಗೆ. ದಾಖಲಿಸಲಾಗಿದೆ, ಹಂಚಿಕೊಂಡ ಅಂಚನ್ನು ಹೊಂದಿಸಲಾಗಿದೆ."}
            </div>
          </div>
        )}

        <p className="note">
          {en
            ? "Neither submission carried a matching survey number, agency or taluk office. Only the geometry connects them."
            : "ಎರಡೂ ಸಲ್ಲಿಕೆಗಳಲ್ಲಿ ಸರ್ವೆ ಸಂಖ್ಯೆ, ಸಂಸ್ಥೆ ಅಥವಾ ತಾಲ್ಲೂಕು ಕಚೇರಿ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ. ಗಡಿರೇಖೆ ಮಾತ್ರ ಅವುಗಳನ್ನು ಜೋಡಿಸುತ್ತದೆ."}
        </p>
      </div>
    </main>
  );
}

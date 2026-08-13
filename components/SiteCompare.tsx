"use client";

import { useRef, useState } from "react";
import { useDemo } from "@/components/DemoContext";

/**
 * The same ground at two moments, one wiped across the other.
 *
 * Two things this component is careful about.
 *
 * It never lets the two frames drift apart. A before-and-after only means
 * anything if it is the same camera position, so the pair is stated as one
 * record with a single bearing and mast point, and both halves are labelled
 * with their own capture date.
 *
 * And it works with schematic frames until real photographs exist. Drop a file
 * at /public/evidence/<location-id>-before.jpg and -after.jpg and it is used
 * instead; until then the schematic makes the shape of the evidence clear
 * without pretending to be a photograph of ground nobody has stood on.
 */

export type SitePair = {
  locationId: string;
  bearing: string;          // the fixed direction the camera faces
  station: string;          // the fixed point it is taken from
  beforeLabelEn: string;
  beforeLabelKn: string;
  beforeDate: string;
  afterLabelEn: string;
  afterLabelKn: string;
  afterDate: string;
  afterKind: "planted" | "canopy";
};

function Schematic({ kind }: { kind: "bare" | "planted" | "canopy" }) {
  return (
    <svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
         role="img" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfdbe4" />
          <stop offset="1" stopColor="#e8eade" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#sky-${kind})`} />

      {/* the horizon and the far ridge stay put in both frames — same camera */}
      <path d="M0 96 L58 88 L104 94 L150 84 L196 92 L250 86 L320 93 V200 H0 Z" fill="#b9c3ad" />
      <rect y="104" width="320" height="96" fill={kind === "bare" ? "#cbbb98" : "#c2b48f"} />
      <path d="M0 104h320" stroke="#a99a79" strokeWidth="1" />

      {kind === "bare" && (
        <g>
          <path d="M0 138q80-8 160 2t160-4" stroke="#b6a582" strokeWidth="2" fill="none" />
          <g fill="#a89778">
            <ellipse cx="52" cy="150" rx="9" ry="3" />
            <ellipse cx="196" cy="164" rx="12" ry="4" />
            <ellipse cx="272" cy="142" rx="7" ry="2.5" />
          </g>
          <g stroke="#9aa878" strokeWidth="1.4" fill="none" opacity="0.8">
            <path d="M24 176v-7 M31 176v-9 M120 170v-8 M127 170v-6 M228 180v-8 M235 180v-10" />
          </g>
        </g>
      )}

      {kind === "planted" && (
        <g>
          {[26, 66, 106, 146, 186, 226, 266, 306].map((x, i) => (
            <g key={x} transform={`translate(${x} ${132 + (i % 3) * 16})`}>
              <ellipse cx="0" cy="4" rx="11" ry="3.5" fill="#b3a382" />
              <path d="M0 3v-13" stroke="#5c4a2e" strokeWidth="1.6" />
              <path d="M-6-10q6-9 12 0" fill="#2f7a45" />
              <path d="M-4-13q4-6 8 0" fill="#3d8f53" />
            </g>
          ))}
        </g>
      )}

      {kind === "canopy" && (
        <g>
          {[34, 92, 150, 208, 266].map((x, i) => (
            <g key={x} transform={`translate(${x} ${128 + (i % 2) * 18})`}>
              <path d="M0 6V-16" stroke="#5c4a2e" strokeWidth="3" />
              <circle cx="0" cy="-26" r="20" fill="#2f7a45" />
              <circle cx="-11" cy="-19" r="13" fill="#37884d" />
              <circle cx="12" cy="-20" r="12" fill="#276b3c" />
            </g>
          ))}
          <path d="M0 190q80-10 160 0t160-6" stroke="#9aa878" strokeWidth="2" fill="none" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

function Half({ pair, side }: { pair: SitePair; side: "before" | "after" }) {
  const [broken, setBroken] = useState(false);
  const src = `/evidence/${pair.locationId}-${side}.jpg`;
  const kind = side === "before" ? "bare" : pair.afterKind;

  if (broken) return <Schematic kind={kind} />;
  return (
    // a real photograph is used the moment one is placed beside the record
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

export default function SiteCompare({ pair, height = 260 }: { pair: SitePair; height?: number }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="cmp">
      <div
        className="cmp-frame"
        ref={box}
        style={{ height }}
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onMouseDown={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        <div className="cmp-layer">
          <Half pair={pair} side="after" />
        </div>
        <div className="cmp-layer clip" style={{ width: `${pos}%` }}>
          <div style={{ width: box.current?.offsetWidth ?? "100%", height: "100%" }}>
            <Half pair={pair} side="before" />
          </div>
        </div>

        <div className="cmp-handle" style={{ left: `${pos}%` }}>
          <span className="grip">↔</span>
        </div>

        <div className="cmp-tag left">
          {en ? pair.beforeLabelEn : pair.beforeLabelKn}
          <em>{pair.beforeDate}</em>
        </div>
        <div className="cmp-tag right">
          {en ? pair.afterLabelEn : pair.afterLabelKn}
          <em>{pair.afterDate}</em>
        </div>
      </div>

      <p className="cmp-meta">
        {en
          ? `Both frames from the same station — ${pair.station}, facing ${pair.bearing}. A comparison only means anything if the camera did not move.`
          : `ಎರಡೂ ಚಿತ್ರಗಳು ಒಂದೇ ಸ್ಥಾನದಿಂದ — ${pair.station}, ${pair.bearing} ದಿಕ್ಕಿಗೆ. ಕ್ಯಾಮೆರಾ ಜಾಗ ಬದಲಿಸದಿದ್ದರೆ ಮಾತ್ರ ಹೋಲಿಕೆಗೆ ಅರ್ಥ.`}
      </p>
    </div>
  );
}

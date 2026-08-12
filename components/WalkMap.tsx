"use client";

import type { Walk } from "@/lib/offers";

/** Renders the walked ring from its actual coordinates, normalised to the box. */
export default function WalkMap({ walk, height = 190 }: { walk: Walk; height?: number }) {
  const pts = walk.points;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX || 1e-6;
  const h = maxY - minY || 1e-6;
  const pad = 22;
  const W = 300, H = 190;

  const sx = (x: number) => pad + ((x - minX) / w) * (W - pad * 2);
  const sy = (y: number) => H - pad - ((y - minY) / h) * (H - pad * 2);

  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} role="img"
         aria-label="Walked boundary"
         style={{ background: "var(--green-tint)", borderRadius: 8, display: "block" }}>
      <path d="M0 63H300 M0 126H300 M100 0V190 M200 0V190"
            fill="none" stroke="#ffffff" strokeWidth="1" />
      <path d={d} fill="#1c5a33" fillOpacity="0.18" stroke="#1c5a33" strokeWidth="1.8"
            strokeLinejoin="round" />
      {pts.slice(0, -1).map((p, i) => (
        <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r="2.6" fill="#1c5a33" />
      ))}
      <circle cx={sx(pts[0][0])} cy={sy(pts[0][1])} r="4.5" fill="none"
              stroke="#C09A3E" strokeWidth="2" />
    </svg>
  );
}

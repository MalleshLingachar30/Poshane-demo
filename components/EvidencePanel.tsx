"use client";

import { useState } from "react";
import { useDemo } from "./DemoContext";
import { tr } from "@/lib/i18n";
import type { EvidenceEvent, CaptureImage } from "@/lib/data";

function Frame({ kind }: { kind: CaptureImage["frame"] }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" className="frame" role="img" aria-hidden="true">
      <rect x="0" y="0" width="160" height="100" fill="#e6ecdf" />
      <rect x="0" y="62" width="160" height="38" fill="#d8cdb4" />
      {kind === "rows" && (
        <g stroke="#1c5a33" strokeWidth="1.6" fill="none">
          <path d="M22 78v-12 M52 76v-14 M82 78v-12 M112 75v-15 M142 78v-12" />
          <path d="M18 66q4-6 8 0 M48 64q4-7 8 0 M78 66q4-6 8 0 M108 63q4-7 8 0 M138 66q4-6 8 0" />
        </g>
      )}
      {kind === "pit" && (
        <g>
          <ellipse cx="80" cy="80" rx="34" ry="12" fill="#b9a888" />
          <path d="M80 78V56" stroke="#1c5a33" strokeWidth="2" fill="none" />
          <path d="M72 56q8-11 16 0" stroke="#1c5a33" strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === "canopy" && (
        <g fill="#1c5a33" fillOpacity="0.55">
          <circle cx="46" cy="44" r="20" />
          <circle cx="86" cy="38" r="24" />
          <circle cx="122" cy="48" r="17" />
        </g>
      )}
      {kind === "gap" && (
        <g>
          <path d="M28 76v-12 M128 76v-12" stroke="#1c5a33" strokeWidth="1.6" fill="none" />
          <path d="M24 64q4-6 8 0 M124 64q4-6 8 0" stroke="#1c5a33" strokeWidth="1.6" fill="none" />
          <path d="M62 82h36" stroke="#9c2f2f" strokeWidth="1.6" strokeDasharray="4 3" />
          <circle cx="70" cy="76" r="3" fill="#b9a888" />
          <circle cx="90" cy="76" r="3" fill="#b9a888" />
        </g>
      )}
      <rect x="0" y="0" width="160" height="100" fill="none" stroke="#cfc8b8" strokeWidth="1" />
    </svg>
  );
}

export default function EvidencePanel({
  event,
  visible,
}: {
  event: EvidenceEvent;
  visible: boolean;
}) {
  const { lang } = useDemo();
  const en = lang === "en";
  const [open, setOpen] = useState(false);

  if (!event.images?.length) return null;

  if (!visible) {
    return (
      <p className="ev-locked">
        {tr("auditRestricted", lang)}
      </p>
    );
  }

  return (
    <div>
      <button className="ev-toggle" onClick={() => setOpen(!open)}>
        {open ? tr("hideEvidence", lang) : tr("openEvidence", lang)}
      </button>

      {open && (
        <div className="ev-wrap">
          <p className="ev-cadre">
            {en ? event.cadreEn : event.cadreKn}
            {event.restricted && (
              <span className="ev-tag">{tr("restrictedTag", lang)}</span>
            )}
          </p>

          <div className="ev-grid">
            {event.images.map((im) => (
              <div key={im.ref} className="ev-card">
                <Frame kind={im.frame} />
                <dl className="ev-meta">
                  <dt>{tr("mTag", lang)}</dt>
                  <dd>{im.tagTap}</dd>
                  <dt>{tr("mGps", lang)}</dt>
                  <dd>
                    {im.gps} <span className="dim">±{im.gpsAccuracyM} m</span>
                  </dd>
                  <dt>{tr("mDevice", lang)}</dt>
                  <dd>{im.deviceTime}</dd>
                  <dt>{tr("mServer", lang)}</dt>
                  <dd>{im.serverTime}</dd>
                  <dt>{tr("mBy", lang)}</dt>
                  <dd>{en ? im.capturedByEn : im.capturedByKn}</dd>
                  <dt>{tr("mUnit", lang)}</dt>
                  <dd>{im.device}</dd>
                  <dt>{tr("mRef", lang)}</dt>
                  <dd className="ref">{im.ref}</dd>
                </dl>
              </div>
            ))}
          </div>

          <p className="ev-note">{tr("evidenceNote", lang)}</p>
        </div>
      )}
    </div>
  );
}

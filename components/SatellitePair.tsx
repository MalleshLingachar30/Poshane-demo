"use client";

import { useState } from "react";
import { useDemo } from "./DemoContext";
import SatellitePasses from "./SatellitePasses";
import type { PassResult } from "@/lib/passes";
import {
  SATELLITE_PAIR,
  SATELLITE_SOURCE,
  PLOT_EXTENT,
  type SatelliteFrame,
} from "@/lib/satellite";

/**
 * The same ground from orbit, at two dates.
 *
 * The outline is not drawn by hand. It is computed from the coordinates the
 * handset recorded on the ground, projected into the exported crop using the
 * bounds of that export. So the box on the imagery and the numbers under the
 * photographs above are the same measurements — if they disagreed, the box
 * would land in the wrong place and anyone could see it.
 */

function Outline({ bounds }: { bounds: NonNullable<SatelliteFrame["bounds"]> }) {
  const x = (lng: number) =>
    ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = (lat: number) =>
    ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;

  const left = x(PLOT_EXTENT.west);
  const right = x(PLOT_EXTENT.east);
  const top = y(PLOT_EXTENT.north);
  const bottom = y(PLOT_EXTENT.south);

  // if the plot falls outside the exported crop, draw nothing rather than
  // clamp a box to the edge and imply the plot sits there
  if (left < 0 || right > 100 || top < 0 || bottom > 100) return null;

  return (
    <svg className="sat-outline" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect
        x={left}
        y={top}
        width={right - left}
        height={bottom - top}
        fill="none"
        stroke="#f2c14e"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Frame({ f, en }: { f: SatelliteFrame; en: boolean }) {
  const [failed, setFailed] = useState(false);
  const show = f.present && !failed;

  return (
    <figure className="sat-card">
      <div className="sat-frame">
        {show ? (
          <>
            <img src={f.file} alt="" onError={() => setFailed(true)} />
            {f.bounds && <Outline bounds={f.bounds} />}
          </>
        ) : (
          <div className="sat-empty">
            {en ? "Imagery not yet exported" : "ಚಿತ್ರ ಇನ್ನೂ ರಫ್ತಾಗಿಲ್ಲ"}
            <span>{f.file}</span>
          </div>
        )}
      </div>
      <figcaption>
        <div className="sat-cap">{en ? f.captionEn : f.captionKn}</div>
        <div className="sat-date mono">{en ? f.acquiredEn : f.acquiredKn}</div>
        {f.cloudPct !== undefined && (
          <div className="sat-cloud">
            {en ? `Scene cloud cover ${f.cloudPct}%` : `ಮೋಡ ಆವರಣ ${f.cloudPct}%`}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export default function SatellitePair({ passes }: { passes: PassResult }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const [open, setOpen] = useState(false);

  return (
    <section className="sat">
      <h2 className="sat-h">
        {en ? "The same ground from orbit" : "ಅದೇ ನೆಲ, ಕಕ್ಷೆಯಿಂದ"}
      </h2>

      <p className="sat-lede">
        {en
          ? "The photographs above are checked in the moment — position, tag tap, two clocks. Imagery answers the slower question: did this land actually change across the years the record claims. Two instruments on two timescales, neither asked to do the other's job."
          : "ಮೇಲಿನ ಛಾಯಾಚಿತ್ರಗಳನ್ನು ಆ ಕ್ಷಣದಲ್ಲಿಯೇ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ — ಸ್ಥಾನ, ಟ್ಯಾಗ್ ಸ್ಪರ್ಶ, ಎರಡು ಗಡಿಯಾರಗಳು. ಉಪಗ್ರಹ ಚಿತ್ರ ನಿಧಾನದ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುತ್ತದೆ: ದಾಖಲೆ ಹೇಳುವಂತೆ ಈ ನೆಲ ವರ್ಷಗಳಲ್ಲಿ ನಿಜಕ್ಕೂ ಬದಲಾಯಿತೇ."}
      </p>

      <div className="sat-grid">
        {SATELLITE_PAIR.map((f) => (
          <Frame key={f.file} f={f} en={en} />
        ))}
      </div>

      <h3 className="pass-h">
        {en ? "Every pass over this ground" : "ಈ ನೆಲದ ಮೇಲಿನ ಪ್ರತಿ ಹಾದುಹೋಗುವಿಕೆ"}
      </h3>
      <SatellitePasses result={passes} />

      <p className="sat-attrib">{en ? SATELLITE_SOURCE.en : SATELLITE_SOURCE.kn} · {SATELLITE_SOURCE.note}</p>

      <button className="spec-toggle" onClick={() => setOpen((v) => !v)}>
        {open
          ? en
            ? "Hide why this is one pair, not four"
            : "ಇದು ಏಕೆ ಒಂದೇ ಜೋಡಿ ಎಂಬುದನ್ನು ಮರೆಮಾಡಿ"
          : en
            ? "Why this is one pair, not four"
            : "ಇದು ಏಕೆ ನಾಲ್ಕಲ್ಲ, ಒಂದೇ ಜೋಡಿ"}
      </button>

      {open && (
        <div className="spec-limit">
          <p>
            {en
              ? "It would be neater to place a satellite image beside each photograph, matched to the day. The instrument cannot do it. Sentinel-2 passes over Karnataka at about 10:30 IST on a five-day cycle, and three of the four captures above were made after 13:00 — so even on a cloudless day the satellite was three hours gone."
              : "ಪ್ರತಿ ಛಾಯಾಚಿತ್ರದ ಪಕ್ಕದಲ್ಲಿ ಅದೇ ದಿನದ ಉಪಗ್ರಹ ಚಿತ್ರವಿಟ್ಟರೆ ಅಂದವಾಗಿರುತ್ತಿತ್ತು. ಆದರೆ ಉಪಕರಣಕ್ಕೆ ಅದು ಸಾಧ್ಯವಿಲ್ಲ. ಸೆಂಟಿನೆಲ್-2 ಕರ್ನಾಟಕದ ಮೇಲೆ ಸುಮಾರು ಬೆಳಿಗ್ಗೆ 10:30ಕ್ಕೆ, ಐದು ದಿನಗಳಿಗೊಮ್ಮೆ ಹಾದುಹೋಗುತ್ತದೆ; ಮೇಲಿನ ನಾಲ್ಕರಲ್ಲಿ ಮೂರು ಚಿತ್ರಗಳು ಮಧ್ಯಾಹ್ನ 1 ಗಂಟೆಯ ನಂತರ ತೆಗೆದವು."}
          </p>
          <p>
            {en
              ? "Planting also falls in the monsoon, when optical scenes are cloud-covered — the season the imagery is most wanted is the season it is least likely to exist. And at 10 m per pixel a newly planted sapling occupies no pixel at all. Claiming a same-day match would be claiming something the physics does not allow, so the imagery is used across years, where it is genuinely decisive: a parcel reporting good survival whose land shows no greening across four seasons is a parcel worth an inspection."
              : "ನೆಡುವಿಕೆ ಮಳೆಗಾಲದಲ್ಲಿ ನಡೆಯುತ್ತದೆ, ಆಗ ಮೋಡ ಆವರಿಸಿರುತ್ತದೆ — ಚಿತ್ರ ಅತ್ಯಂತ ಬೇಕಾದ ಋತುವಿನಲ್ಲಿಯೇ ಅದು ಸಿಗುವ ಸಾಧ್ಯತೆ ಕಡಿಮೆ. 10 ಮೀಟರ್ ಪಿಕ್ಸೆಲ್‌ನಲ್ಲಿ ಹೊಸ ಸಸಿ ಕಾಣಿಸುವುದೇ ಇಲ್ಲ. ಆದ್ದರಿಂದ ಉಪಗ್ರಹ ಚಿತ್ರವನ್ನು ವರ್ಷಗಳ ಅಂತರದಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ, ಅಲ್ಲಿ ಅದು ನಿರ್ಣಾಯಕ."}
          </p>
        </div>
      )}
    </section>
  );
}

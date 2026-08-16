"use client";

import { useState } from "react";
import { useDemo } from "./DemoContext";
import { SPECIMENS, metresBetween, type Specimen } from "@/lib/specimen";

/**
 * What a capture record looks like.
 *
 * A photograph on its own proves nothing — it can be taken anywhere, at any
 * time, and filed against any parcel. What makes it evidence is the record
 * around it. This screen puts a real photograph beside its own metadata so an
 * officer can see the difference, using our own sandalwood planting rather
 * than programme land, because a photograph filed against a parcel it does not
 * belong to is the exact failure the programme exists to prevent.
 */

function Row({
  label,
  value,
  mono,
  dim,
}: {
  label: string;
  value: string;
  mono?: boolean;
  dim?: boolean;
}) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={`${mono ? "mono " : ""}${dim ? "dim" : ""}`}>{value}</dd>
    </>
  );
}

function Card({ s, en }: { s: Specimen; en: boolean }) {
  const clocksAgree = s.deviceTime === s.satelliteTimeIst;

  return (
    <figure className="spec-card">
      <img src={s.file} alt="" loading="lazy" />
      <figcaption>
        <div className="spec-cap">{en ? s.captionEn : s.captionKn}</div>

        <dl className="spec-meta">
          <Row
            label={en ? "Device clock" : "ಸಾಧನದ ಗಡಿಯಾರ"}
            value={`${s.deviceTime} IST`}
            mono
          />
          <Row
            label={en ? "Satellite clock" : "ಉಪಗ್ರಹ ಗಡಿಯಾರ"}
            value={`${s.satelliteTimeUtc} UTC`}
            mono
          />
          <Row
            label={en ? "Position" : "ಸ್ಥಾನ"}
            value={`${s.lat.toFixed(6)}, ${s.lng.toFixed(6)}`}
            mono
          />
          <Row
            label={en ? "Fix accuracy" : "ನಿಖರತೆ"}
            value={`± ${s.accuracyM.toFixed(2)} m`}
            mono
          />
          <Row
            label={en ? "Altitude" : "ಎತ್ತರ"}
            value={`${s.altitudeM.toFixed(1)} m`}
            mono
            dim
          />
          <Row label={en ? "Device" : "ಸಾಧನ"} value={s.device} dim />
          <Row label={en ? "Lens" : "ಮಸೂರ"} value={s.lens} dim />
        </dl>

        {clocksAgree && (
          <p className="spec-check ok">
            {en
              ? "Both clocks give the same instant. The handset's clock its holder can set; the satellite's they cannot."
              : "ಎರಡೂ ಗಡಿಯಾರಗಳು ಒಂದೇ ಕ್ಷಣವನ್ನು ತೋರಿಸುತ್ತವೆ. ಸಾಧನದ ಗಡಿಯಾರವನ್ನು ಬಳಕೆದಾರ ಬದಲಿಸಬಹುದು; ಉಪಗ್ರಹದ್ದನ್ನು ಬದಲಿಸಲಾಗದು."}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export default function EvidenceSpecimen() {
  const { lang } = useDemo();
  const en = lang === "en";
  const [open, setOpen] = useState(false);

  const first = SPECIMENS[0];
  const spread = Math.max(...SPECIMENS.map((s) => metresBetween(first, s)));

  return (
    <div className="spec">
      <p className="spec-lede">
        {en
          ? "A photograph on its own proves nothing. It can be taken anywhere, at any time, and filed against any parcel. What makes it evidence is the record that travels with it — where the handset stood, how well it knew, and whether its clock agrees with a clock its holder does not control."
          : "ಛಾಯಾಚಿತ್ರ ಮಾತ್ರ ಯಾವುದನ್ನೂ ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ. ಅದನ್ನು ಎಲ್ಲಿಯಾದರೂ, ಯಾವಾಗಲಾದರೂ ತೆಗೆದು ಯಾವುದೇ ತಾಕಿಗೆ ಸೇರಿಸಬಹುದು. ಅದನ್ನು ಸಾಕ್ಷ್ಯವಾಗಿಸುವುದು ಅದರೊಂದಿಗೆ ಬರುವ ದಾಖಲೆ — ಸಾಧನ ಎಲ್ಲಿ ನಿಂತಿತ್ತು, ಎಷ್ಟು ನಿಖರವಾಗಿ ತಿಳಿದಿತ್ತು, ಮತ್ತು ಅದರ ಗಡಿಯಾರ ಬಳಕೆದಾರನ ನಿಯಂತ್ರಣದಲ್ಲಿಲ್ಲದ ಗಡಿಯಾರದೊಂದಿಗೆ ಹೊಂದುತ್ತದೆಯೇ."}
      </p>

      <div className="spec-provenance">
        {en
          ? "These four photographs are from Grobet's own sandalwood planting, taken between June 2024 and August 2026. They are not from a Poshane parcel and do not appear on any parcel record. Every figure beside them is read from the file itself."
          : "ಈ ನಾಲ್ಕು ಛಾಯಾಚಿತ್ರಗಳು ಜೂನ್ 2024 ಮತ್ತು ಆಗಸ್ಟ್ 2026ರ ನಡುವೆ ತೆಗೆದ ಗ್ರೋಬೆಟ್‌ನ ಸ್ವಂತ ಶ್ರೀಗಂಧ ನೆಡುತೋಪಿನವು. ಇವು ಪೋಷಣೆ ತಾಕಿನವಲ್ಲ ಮತ್ತು ಯಾವುದೇ ತಾಕಿನ ದಾಖಲೆಯಲ್ಲಿ ಕಾಣಿಸುವುದಿಲ್ಲ. ಪಕ್ಕದ ಪ್ರತಿ ಅಂಕಿಯೂ ಕಡತದಿಂದಲೇ ಓದಿದ್ದು."}
      </div>

      <div className="spec-grid">
        {SPECIMENS.map((s) => (
          <Card key={s.file} s={s} en={en} />
        ))}
      </div>

      <button className="spec-toggle" onClick={() => setOpen((v) => !v)}>
        {open
          ? en
            ? "Hide what this set does not show"
            : "ಈ ಸಂಗ್ರಹ ತೋರಿಸದಿರುವುದನ್ನು ಮರೆಮಾಡಿ"
          : en
            ? "What this set does not show"
            : "ಈ ಸಂಗ್ರಹ ತೋರಿಸದಿರುವುದು"}
      </button>

      {open && (
        <div className="spec-limit">
          <p>
            {en
              ? `These were taken while walking the plot, so no two share a camera position — the widest gap between them is about ${spread} metres. That is enough to make the same ground look like different ground, and it is why a survival comparison cannot be assembled from whatever photographs happen to exist.`
              : `ಇವನ್ನು ತಾಕಿನಲ್ಲಿ ನಡೆಯುತ್ತಾ ತೆಗೆಯಲಾಗಿದೆ, ಆದ್ದರಿಂದ ಯಾವ ಎರಡೂ ಒಂದೇ ಸ್ಥಾನದಿಂದ ಬಂದಿಲ್ಲ — ಅವುಗಳ ನಡುವಿನ ಗರಿಷ್ಠ ಅಂತರ ಸುಮಾರು ${spread} ಮೀಟರ್. ಅಷ್ಟೇ ಸಾಕು ಒಂದೇ ನೆಲ ಬೇರೆ ನೆಲದಂತೆ ಕಾಣಲು.`}
          </p>
          <p>
            {en
              ? "Under the programme the station is fixed at verification and every later visit returns to it, so the frames stack. Until a parcel has two visits from one station, its comparison stays drawn rather than photographed."
              : "ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪರಿಶೀಲನೆಯ ವೇಳೆ ಸ್ಥಾನ ನಿಗದಿಯಾಗುತ್ತದೆ ಮತ್ತು ಪ್ರತಿ ಮುಂದಿನ ಭೇಟಿಯೂ ಅಲ್ಲಿಗೇ ಮರಳುತ್ತದೆ. ಒಂದೇ ಸ್ಥಾನದಿಂದ ಎರಡು ಭೇಟಿಗಳಾಗುವವರೆಗೆ ತಾಕಿನ ಹೋಲಿಕೆ ಚಿತ್ರಿತವಾಗಿಯೇ ಉಳಿಯುತ್ತದೆ."}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useDemo } from "./DemoContext";
import type { Pass } from "@/lib/satellite";

/**
 * Linking a visit to a satellite pass.
 *
 * The third question after "is this photograph real" and "did the land change":
 * can a particular visit be corroborated from orbit at all. The answer is not
 * uniform, and pretending otherwise is where this sort of claim usually goes
 * wrong.
 *
 * So the panel shows three real visits and lets the catalogue answer for each.
 * Two of them fail — they fall in the monsoon, when nothing is visible — and
 * the failures are shown rather than omitted. A panel that only listed the
 * visit that worked would be a selection, and the whole argument of this page
 * is that selection is what evidence has to exclude.
 *
 * Nothing here is asserted. Each row is computed from the pass list, which is
 * ESA's, by taking the nearest acquisition to the visit date and reporting what
 * the sky was doing.
 */

const USABLE_CLOUD = 20;
const WINDOW_DAYS = 14;

export type Visit = {
  date: string;          // ISO, the day of the ground visit
  labelEn: string;
  labelKn: string;
  kindEn: string;        // what kind of visit — planting, audit, census
  kindKn: string;
};

function daysBetween(a: string, b: string) {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return Math.round(ms / 86400000);
}

function fmt(iso: string, en: boolean) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(en ? "en-GB" : "kn-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Row({ v, passes, en }: { v: Visit; passes: Pass[]; en: boolean }) {
  const near = passes
    .map((p) => ({ p, gap: daysBetween(p.date, v.date) }))
    .filter((x) => x.gap <= WINDOW_DAYS)
    .sort((a, b) => a.gap - b.gap);

  const usable = near
    .filter((x) => x.p.cloudPct !== null && x.p.cloudPct < USABLE_CLOUD)
    .sort((a, b) => a.gap - b.gap)[0];

  const best = near[0];

  return (
    <div className={`link-row ${usable ? "ok" : "no"}`}>
      <div className="link-visit">
        <b>{en ? v.labelEn : v.labelKn}</b>
        <span className="mono">{fmt(v.date, en)}</span>
        <em>{en ? v.kindEn : v.kindKn}</em>
      </div>

      <div className="link-answer">
        {usable ? (
          <>
            <div className="link-verdict ok">
              {en ? "Corroborated from orbit" : "ಕಕ್ಷೆಯಿಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ"}
            </div>
            <div className="link-detail">
              {en
                ? `Clear pass ${fmt(usable.p.date, en)} at ${usable.p.cloudPct!.toFixed(1)}% cloud — ${usable.gap === 0 ? "the same day" : `${usable.gap} day${usable.gap === 1 ? "" : "s"} from the visit`}.`
                : `${fmt(usable.p.date, en)} ರಂದು ${usable.p.cloudPct!.toFixed(1)}% ಮೋಡ — ಭೇಟಿಯಿಂದ ${usable.gap} ದಿನ.`}
            </div>
          </>
        ) : (
          <>
            <div className="link-verdict no">
              {en ? "No usable scene" : "ಬಳಸಬಹುದಾದ ಚಿತ್ರವಿಲ್ಲ"}
            </div>
            <div className="link-detail">
              {en
                ? near.length
                  ? `${near.length} passes within ${WINDOW_DAYS} days; the clearest was ${best.p.cloudPct?.toFixed(0) ?? "—"}% cloud. The satellite was overhead and saw nothing.`
                  : `No pass within ${WINDOW_DAYS} days of this visit.`
                : near.length
                  ? `${WINDOW_DAYS} ದಿನಗಳಲ್ಲಿ ${near.length} ಬಾರಿ ಹಾದುಹೋಗಿದೆ; ಅತಿ ಕಡಿಮೆ ಮೋಡ ${best.p.cloudPct?.toFixed(0) ?? "—"}%.`
                  : `ಈ ಭೇಟಿಯ ${WINDOW_DAYS} ದಿನಗಳಲ್ಲಿ ಯಾವ ಹಾದುಹೋಗುವಿಕೆಯೂ ಇಲ್ಲ.`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VisitLinkage({
  visits,
  passes,
}: {
  visits: Visit[];
  passes: Pass[];
}) {
  const { lang } = useDemo();
  const en = lang === "en";

  return (
    <section className="link">
      <h2 className="sat-h">
        {en ? "Linking a visit to a pass" : "ಭೇಟಿಯನ್ನು ಉಪಗ್ರಹದ ಹಾದುಹೋಗುವಿಕೆಗೆ ಜೋಡಿಸುವುದು"}
      </h2>

      <p className="sat-lede">
        {en
          ? "Each ground visit is checked against the catalogue: was there a clear pass near that date, and how near. The answer is not the same for every visit, and the ones that fail are shown alongside the one that works."
          : "ಪ್ರತಿ ಭೇಟಿಯನ್ನು ಕ್ಯಾಟಲಾಗ್‌ಗೆ ಹೋಲಿಸಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ: ಆ ದಿನಾಂಕದ ಸಮೀಪ ಸ್ವಚ್ಛ ಚಿತ್ರವಿತ್ತೇ, ಎಷ್ಟು ಸಮೀಪ. ಉತ್ತರ ಎಲ್ಲಾ ಭೇಟಿಗಳಿಗೂ ಒಂದೇ ಅಲ್ಲ."}
      </p>

      <div className="link-grid">
        {visits.map((v) => (
          <Row key={v.date} v={v} passes={passes} en={en} />
        ))}
      </div>

      <p className="pass-note">
        {en
          ? "This is why the survival census sits in March. Planting falls in the monsoon and can never be seen from orbit, so it is proved on the ground — tag tap, position, photograph. The annual count falls in the dry season, when a cloudless scene of the same parcel is almost always available. Count on the ground in March; corroborate from orbit in March."
          : "ಉಳಿವಿನ ಗಣತಿ ಮಾರ್ಚ್‌ನಲ್ಲಿ ಇರುವುದಕ್ಕೆ ಇದೇ ಕಾರಣ. ನೆಡುವಿಕೆ ಮಳೆಗಾಲದಲ್ಲಿ ನಡೆಯುತ್ತದೆ ಮತ್ತು ಅದನ್ನು ಕಕ್ಷೆಯಿಂದ ನೋಡಲಾಗದು, ಆದ್ದರಿಂದ ಅದನ್ನು ನೆಲದ ಮೇಲೆಯೇ ಸಾಬೀತುಪಡಿಸಲಾಗುತ್ತದೆ. ವಾರ್ಷಿಕ ಗಣತಿ ಬೇಸಿಗೆಯಲ್ಲಿ ಬರುತ್ತದೆ, ಆಗ ಸ್ವಚ್ಛ ಚಿತ್ರ ಸಿಗುತ್ತದೆ."}
      </p>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS as PARCELS, TOTAL_TALUKS, byAttention, placeOf } from "@/lib/data";
import { SEED_OFFERS, SEED_VERIFICATIONS } from "@/lib/offers";
import { buildRegister, cohorts, overlappingTaluks, STAGE_LABEL } from "@/lib/register";

export default function StateView() {
  const { lang, role } = useDemo();
  const en = lang === "en";

  if (role.level !== "state") {
    return (
      <main>
        <Link href="/console" className="mono" style={{ textDecoration: "none" }}>
          ← {tr("back", lang)}
        </Link>
        <div className="card" style={{ marginTop: 14 }}>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: 21,
              fontWeight: 600,
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            {tr("notInScope", lang)}
          </h1>
          <p style={{ fontSize: 13.5, maxWidth: "62ch", lineHeight: 1.65 }}>
            {tr("stateOnly", lang)}
          </p>
          <div className="scope-box" style={{ marginTop: 18, marginBottom: 0 }}>
            <div className="who">{en ? role.titleEn : role.titleKn}</div>
            <div style={{ marginTop: 4 }}>
              {tr("visibleScope", lang)}: {en ? role.scopeEn : role.scopeKn}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // the register spans both cohorts; the seeded pipeline stands in for the
  // session store, which the console does not share
  const register = buildRegister(SEED_OFFERS, SEED_VERIFICATIONS, []);
  const cohortRows = cohorts(register);
  const bothStages = overlappingTaluks(register);

  const districts = Array.from(new Set(PARCELS.map((p) => p.district)));
  const below = PARCELS.filter((p) => p.survival < 75);
  const escalations = PARCELS.filter((p) => p.status === "rectification");
  const attention = byAttention(PARCELS.filter((p) => p.status !== "active")).slice(0, 12);

  const byDistrict = districts.map((d) => {
    const rows = PARCELS.filter((p) => p.district === d);
    const avg = Math.round(rows.reduce((s, p) => s + p.survival, 0) / rows.length);
    const kn = rows[0].districtKn;
    return { d, kn, count: rows.length, avg, attention: rows.filter((p) => p.status !== "active").length };
  });

  return (
    <main>
      <h1 className="page">{tr("stateView", lang)}</h1>
      <p className="lede">{tr("programme", lang)}</p>

      <div className="cohorts">
        {cohortRows.map((c) => (
          <div key={c.season} className="cohort">
            <div className="season">{c.season}</div>
            <div className="bar">
              {c.planted > 0 && (
                <span className="seg planted" style={{ flex: c.planted }}>
                  {c.planted}
                </span>
              )}
              {c.approved > 0 && (
                <span className="seg approved" style={{ flex: c.approved }}>
                  {c.approved}
                </span>
              )}
              {c.verifying > 0 && (
                <span className="seg verifying" style={{ flex: c.verifying }}>
                  {c.verifying}
                </span>
              )}
              {c.offered > 0 && (
                <span className="seg offered" style={{ flex: c.offered }}>
                  {c.offered}
                </span>
              )}
            </div>
            <div className="legend">
              {c.planted > 0 && <span><i className="planted" />{c.planted} {en ? STAGE_LABEL.planted.en : STAGE_LABEL.planted.kn}</span>}
              {c.approved > 0 && <span><i className="approved" />{c.approved} {en ? STAGE_LABEL.approved.en : STAGE_LABEL.approved.kn}</span>}
              {c.verifying > 0 && <span><i className="verifying" />{c.verifying} {en ? STAGE_LABEL.verifying.en : STAGE_LABEL.verifying.kn}</span>}
              {c.offered > 0 && <span><i className="offered" />{c.offered} {en ? STAGE_LABEL.offered.en : STAGE_LABEL.offered.kn}</span>}
              {c.notAccepted > 0 && <span className="muted">{c.notAccepted} {en ? STAGE_LABEL.notAccepted.en : STAGE_LABEL.notAccepted.kn}</span>}
            </div>
          </div>
        ))}
      </div>

      {bothStages.length > 0 && (
        <p className="note" style={{ borderTop: 0, marginTop: 0, marginBottom: 20 }}>
          {en
            ? `Both cohorts are present in ${bothStages.join(", ")} — a 2027 plantation under monitoring alongside land being verified for 2028. A programme running to 2034 is never at one stage.`
            : `${bothStages.join(", ")} ನಲ್ಲಿ ಎರಡೂ ಗುಂಪುಗಳಿವೆ — ನಿಗಾದಲ್ಲಿರುವ 2027ರ ನೆಡುತೋಪು ಮತ್ತು 2028ಕ್ಕಾಗಿ ಪರಿಶೀಲನೆಯಲ್ಲಿರುವ ಭೂಮಿ. 2034ರವರೆಗೆ ನಡೆಯುವ ಕಾರ್ಯಕ್ರಮ ಎಂದಿಗೂ ಒಂದೇ ಹಂತದಲ್ಲಿ ಇರುವುದಿಲ್ಲ.`}
        </p>
      )}

      <div className="metrics">
        <div className="metric">
          <div className="k">{tr("districts", lang)}</div>
          <div className="v">{districts.length} / 35</div>
          <div className="n">{en ? "in this demonstration" : "ಈ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಲ್ಲಿ"}</div>
        </div>
        <div className="metric">
          <div className="k">{tr("taluks", lang)}</div>
          <div className="v">{TOTAL_TALUKS} / 240</div>
        </div>
        <div className="metric">
          <div className="k">{en ? "Planted parcels" : "ನೆಟ್ಟ ಜಮೀನುಗಳು"}</div>
          <div className="v">{PARCELS.length}</div>
          <div className="n">{en ? "Monsoon 2027 cohort" : "ಮಳೆಗಾಲ 2027 ಗುಂಪು"}</div>
        </div>
        <div className="metric">
          <div className="k">{tr("belowThreshold", lang)}</div>
          <div className="v" style={{ color: "var(--red)" }}>{below.length}</div>
          <div className="n">
            {tr("openEscalations", lang)}: {escalations.length} ·{" "}
            {en ? "Monsoon 2027 only" : "ಮಳೆಗಾಲ 2027 ಮಾತ್ರ"}
          </div>
        </div>
      </div>

      <div className="rows">
        {byDistrict.map((d) => (
          <div key={d.d} className="row">
            <div className="grow">
              <div className="t">{en ? d.d : d.kn}</div>
              <div className="s">
                {d.count} {tr("parcels", lang)}
                {d.attention > 0 && ` · ${d.attention} ${tr("needsAttention", lang)}`}
              </div>
            </div>
            <div className={`num ${d.avg < 75 ? "low" : ""}`}>{d.avg}%</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", margin: "22px 0 10px" }}>
        {tr("needsAttention", lang)}
      </p>
      <div className="rows">
        {attention.map((p) => (
          <Link key={p.id} href={`/console/p/${p.id}`} className="row">
            <div className="grow">
              <div className="mono">{p.id}</div>
              <div className="t">
                {placeOf(p, lang, tr("taluk", lang))}
              </div>
            </div>
            <div className={`num ${p.survival < 75 ? "low" : ""}`}>{p.survival}%</div>
            <span className={`pill ${p.status}`}>
              {p.status === "flagged"
                ? tr("statusFlagged", lang)
                : tr("statusRectification", lang)}
            </span>
          </Link>
        ))}
      </div>

      <p className="note">
        {en
          ? "State command sees all districts aggregated and can drill to any parcel. A district officer sees one district. A taluk officer sees one taluk."
          : "ರಾಜ್ಯ ನಿಯಂತ್ರಣವು ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳ ಒಟ್ಟು ನೋಟವನ್ನು ಕಂಡು ಯಾವುದೇ ಜಮೀನಿನವರೆಗೆ ಇಳಿಯಬಹುದು. ಜಿಲ್ಲಾ ಅಧಿಕಾರಿಗೆ ಒಂದು ಜಿಲ್ಲೆ, ತಾಲ್ಲೂಕು ಅಧಿಕಾರಿಗೆ ಒಂದು ತಾಲ್ಲೂಕು ಮಾತ್ರ ಕಾಣಿಸುತ್ತದೆ."}
      </p>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";
import { ALL_PARCELS as PARCELS, TOTAL_TALUKS, byAttention } from "@/lib/data";

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
          <div className="k">{tr("parcels", lang)}</div>
          <div className="v">{PARCELS.length}</div>
        </div>
        <div className="metric">
          <div className="k">{tr("belowThreshold", lang)}</div>
          <div className="v" style={{ color: "var(--red)" }}>{below.length}</div>
          <div className="n">
            {tr("openEscalations", lang)}: {escalations.length}
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
                {en
                  ? `${p.taluk} ${tr("taluk", lang)}, ${p.district}`
                  : `${p.talukKn} ${tr("taluk", lang)}, ${p.districtKn}`}
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

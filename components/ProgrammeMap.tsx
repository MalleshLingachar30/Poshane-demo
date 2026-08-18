"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDemo } from "./DemoContext";
import { ALL_PARCELS, type Parcel } from "@/lib/data";
import { DISTRICT_SHAPES, TALUK_SHAPES, TALUK_SLOTS, KARNATAKA_OUTLINE, MAP_W, MAP_H } from "@/lib/karnataka";
import { zone as zoneOf } from "@/lib/zones";

/**
 * Where the programme is, on one screen.
 *
 * The first question a committee asks is how many and where, and until now
 * nothing answered it — the register could be filtered but not seen. This is
 * the entry point to everything else: a district opens to its taluks, a taluk
 * to its parcels, a parcel to its evidence.
 *
 * A pin marks a taluk and carries the count of sites in it. Taluk is the
 * finest unit the register actually holds: every parcel has a district and a
 * taluk, none has a village or a coordinate, and the polygon on a parcel
 * record is a schematic of its shape rather than its position. Placing
 * seventy-eight dots would mean inventing seventy-eight positions — more
 * precise-looking and less true. Once sites are registered with a village, as
 * the field app captures them, village centroids become the right unit and
 * nothing else here has to change.
 *
 * Districts with no parcels are drawn but left pale. Showing the whole state
 * makes the coverage legible: a screen of only the ten districts in the
 * programme would imply the programme covers the state.
 */

type Mode = "parcels" | "survival";

export default function ProgrammeMap() {
  const { lang } = useDemo();
  const en = lang === "en";
  /**
   * The selected taluk is held in the URL, not only in state.
   *
   * Opening a site and pressing back used to land on the public record, because
   * /map had no memory of what was selected — so checking two sites in the same
   * taluk meant finding it on the map again each time. Writing the selection
   * into the query string means the browser's own back button returns to
   * exactly the view the visitor left.
   *
   * replaceState rather than push: a visitor clicking six pins should not have
   * to press back six times to leave the map.
   *
   * The state object is carried through rather than replaced with null. Next's
   * router keeps its own object on each history entry, and passing null wipes
   * it — the entry survives but the router no longer recognises it, so going
   * back lands somewhere unintended. Preserving it costs nothing and is the
   * difference between the back button working and not.
   *
   * The taluk is also written to sessionStorage, so the record page can offer
   * a way back without depending on the query string surviving the trip.
   */
  const [sel, setSelState] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("taluk");
    if (t) setSelState(t);
  }, []);

  const setSel = (name: string | null) => {
    setSelState(name);
    const url = name ? `/map?taluk=${encodeURIComponent(name)}` : "/map";
    window.history.replaceState(window.history.state, "", url);
    try {
      if (name) sessionStorage.setItem("poshane.map.taluk", name);
      else sessionStorage.removeItem("poshane.map.taluk");
    } catch {}
  };
  const [mode, setMode] = useState<Mode>("parcels");
  const [hover, setHover] = useState<Parcel | null>(null);

  const byDistrict = useMemo(() => {
    const m = new Map<string, Parcel[]>();
    for (const p of ALL_PARCELS) {
      const l = m.get(p.district) ?? [];
      l.push(p); m.set(p.district, l);
    }
    return m;
  }, []);

  const byTaluk = useMemo(() => {
    const m = new Map<string, Parcel[]>();
    for (const p of ALL_PARCELS) {
      const l = m.get(p.taluk) ?? [];
      l.push(p); m.set(p.taluk, l);
    }
    return m;
  }, []);

  const maxCount = Math.max(...[...byTaluk.values()].map((v) => v.length));
  const selected = sel ? byTaluk.get(sel) ?? [] : [];
  const selShape = sel ? TALUK_SHAPES.find((t) => t.name === sel) : undefined;
  const selDistrict = selected[0]?.district;

  const stat = (list: Parcel[]) => {
    const ha = list.reduce((s, p) => s + p.areaHa, 0);
    const saplings = list.reduce((s, p) => s + p.saplings, 0);
    const counted = list.filter((p) => typeof p.survival === "number");
    const surv = counted.length
      ? Math.round((counted.reduce((s, p) => s + p.survival, 0) / counted.length) * 10) / 10
      : null;
    const zones = [...new Set(list.map((p) => p.zone))].sort((a, b) => a - b);
    const taluks = [...new Set(list.map((p) => p.taluk))];
    const flagged = list.filter((p) => p.status !== "active").length;
    return { ha, saplings, surv, zones, taluks, flagged };
  };

  const all = stat(ALL_PARCELS);

  /**
   * Shade a district, computed rather than delegated to CSS.
   *
   * The first version used color-mix() against a custom property, which is a
   * neat trick and a fragile one: the property was named for a different
   * stylesheet, the colour function was therefore invalid, and every filled
   * district rendered black — a failure that looks like a bug in the data
   * rather than a typo in a variable name. Mixing the hex here cannot fail
   * that way and works in every browser.
   */
  const shade = (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    const to = [28, 90, 51];        // #1c5a33, the programme green
    const from = [246, 242, 232];   // near-white, so the palest district still reads as land
    const c = to.map((v, i) => Math.round(from[i] + (v - from[i]) * clamped));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  };

  const maxDistrict = Math.max(...[...byDistrict.values()].map((v) => v.length));

  /**
   * The survival scale is taken from the data, not assumed.
   *
   * It was fixed at 80–100 on the reasoning that survival "sits in that band".
   * These districts run 78 to 90, so two thirds of the palette went unused,
   * the lowest district clamped flat, and switching to this mode looked like
   * pressing a dead button. Reading the range off the register means the full
   * palette is always spent on the spread that actually exists — and if a
   * later dataset genuinely runs 60 to 99, it will still read.
   */
  const survivalRange = useMemo(() => {
    const vals = [...byDistrict.values()]
      .map((l) => {
        const c = l.filter((p) => typeof p.survival === "number");
        return c.length ? c.reduce((a, p) => a + p.survival, 0) / c.length : null;
      })
      .filter((v): v is number => v !== null);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    // a floor on the spread, so near-identical districts do not get stretched
    // into a dramatic-looking gradient that overstates the difference
    return hi - lo < 4 ? { lo: lo - 2, hi: lo + 2 } : { lo, hi };
  }, [byDistrict]);

  const fillFor = (name: string) => {
    const list = byDistrict.get(name);
    if (!list) return "#e8e3d6";
    if (mode === "parcels") return shade(0.22 + (list.length / maxDistrict) * 0.62);
    const s = stat(list).surv;
    if (s === null) return "#e8e3d6";
    const t = (s - survivalRange.lo) / (survivalRange.hi - survivalRange.lo);
    return shade(0.14 + Math.max(0, Math.min(1, t)) * 0.72);
  };

  return (
    <div className="pmap">
      <div className="pmap-bar">
        <div className="pmap-tot">
          <b>{ALL_PARCELS.length}</b>
          <span>{en ? "planted sites" : "ನೆಟ್ಟ ಸ್ಥಳಗಳು"}</span>
        </div>
        <div className="pmap-tot">
          <b>{all.ha.toFixed(1)}</b>
          <span>{en ? "hectares" : "ಹೆಕ್ಟೇರ್"}</span>
        </div>
        <div className="pmap-tot">
          <b>{all.saplings.toLocaleString("en-IN")}</b>
          <span>{en ? "saplings" : "ಸಸಿಗಳು"}</span>
        </div>
        <div className="pmap-tot">
          <b>{byDistrict.size}</b>
          <span>{en ? "districts" : "ಜಿಲ್ಲೆಗಳು"}</span>
        </div>
        <div className="pmap-tot">
          <b>{byTaluk.size}</b>
          <span>{en ? "taluks" : "ತಾಲ್ಲೂಕುಗಳು"}</span>
        </div>
      </div>

      <div className="pmap-modes">
        <button className={mode === "parcels" ? "on" : ""} onClick={() => setMode("parcels")}>
          {en ? "By sites" : "ಸ್ಥಳಗಳ ಪ್ರಕಾರ"}
        </button>
        <button className={mode === "survival" ? "on" : ""} onClick={() => setMode("survival")}>
          {en ? "By survival" : "ಉಳಿವಿನ ಪ್ರಕಾರ"}
        </button>
      </div>

      <p className="pmap-scale">
        {mode === "parcels"
          ? en
            ? `Districts shaded by number of sites — 1 to ${maxDistrict}. Dots are individual sites, coloured by status.`
            : `ಜಿಲ್ಲೆಗಳಿಗೆ ಸ್ಥಳಗಳ ಸಂಖ್ಯೆಯ ಪ್ರಕಾರ ಬಣ್ಣ — 1 ರಿಂದ ${maxDistrict}. ಚುಕ್ಕೆಗಳು ಪ್ರತ್ಯೇಕ ಸ್ಥಳಗಳು.`
          : en
            ? `Districts shaded by mean survival — ${survivalRange.lo.toFixed(1)}% palest to ${survivalRange.hi.toFixed(1)}% deepest, the range this register actually holds.`
            : `ಜಿಲ್ಲೆಗಳಿಗೆ ಸರಾಸರಿ ಉಳಿವಿನ ಪ್ರಕಾರ ಬಣ್ಣ — ${survivalRange.lo.toFixed(1)}% ರಿಂದ ${survivalRange.hi.toFixed(1)}%.`}
      </p>

      <div className="pmap-grid">
        <div className="pmap-svg">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img"
               aria-label={en ? "Districts of Karnataka with planted sites" : "ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳು"}>
            {DISTRICT_SHAPES.map((d) => {
              const has = byDistrict.has(d.name);
              return (
                <path
                  key={d.name}
                  d={d.d}
                  fill={fillFor(d.name)}
                  className={`ka-dist${has ? " has" : ""}${selDistrict === d.name ? " sel" : ""}`}
                >
                  <title>{d.name}{has ? ` — ${byDistrict.get(d.name)!.length}` : ""}</title>
                </path>
              );
            })}

            {/* The state border is drawn after the districts so it reads over
                them rather than being painted out by the fills. */}
            <path d={KARNATAKA_OUTLINE} className="ka-outline" />

            {selShape && <path d={selShape.d} className="ka-taluk-sel" />}

            {/* One dot per site — all seventy-eight — each seated in a slot
                inside its own taluk's real boundary. Which taluk a dot sits in
                is true; where it sits within that taluk is not, and the note
                below the map says so. */}
            {[...byTaluk.entries()].flatMap(([tName, list]) => {
              const slots = TALUK_SLOTS[tName] ?? [];
              return list.map((p, i) => {
                const [x, y] = slots[i % slots.length] ?? [0, 0];
                return (
                  <g key={p.id}
                     className={`ka-site st-${p.status}${sel === tName ? " in-sel" : ""}`}
                     onClick={() => setSel(sel === tName ? null : tName)}
                     onMouseEnter={() => setHover(p)}
                     onMouseLeave={() => setHover(null)}>
                    <circle cx={x} cy={y} r={5.4} />
                    <title>{p.village ? `${p.village} — ` : ""}{p.id} · {p.taluk}, {p.areaHa} ha</title>
                  </g>
                );
              });
            })}
          </svg>
          {hover && (
            <div className="pmap-hover">
              <b>{hover.village ?? hover.id}</b>
              <span className="mono">{hover.id}</span>
              <span>{en ? hover.taluk : hover.talukKn}, {en ? hover.district : hover.districtKn}</span>
              <span>{hover.areaHa} ha · {hover.saplings.toLocaleString("en-IN")} {en ? "saplings" : "ಸಸಿಗಳು"} · {hover.survival}%</span>
            </div>
          )}

          <div className="pmap-legend">
            <span><i style={{ background: "#1c5a33" }} />{en ? "Active" : "ಸಕ್ರಿಯ"}</span>
            <span><i style={{ background: "#b08a4a" }} />{en ? "Flagged" : "ಗುರುತಿಸಲಾಗಿದೆ"}</span>
            <span><i style={{ background: "#8a3b3b" }} />{en ? "Rectification" : "ಸರಿಪಡಿಸುವಿಕೆ"}</span>
          </div>

          <p className="pmap-note">
            {en
              ? `All ${ALL_PARCELS.length} sites are drawn, each named by its village and seated inside the taluk it belongs to. The village names the site; it does not yet locate it — the register holds no coordinate, so position within a taluk is indicative. A site whose boundary has been walked is drawn at the position that walk produced.`
              : `ಎಲ್ಲಾ ${ALL_PARCELS.length} ಸ್ಥಳಗಳನ್ನೂ ಗ್ರಾಮದ ಹೆಸರಿನೊಂದಿಗೆ, ತಮ್ಮ ತಾಲ್ಲೂಕಿನೊಳಗೆ ತೋರಿಸಲಾಗಿದೆ. ಗ್ರಾಮ ಹೆಸರಿಸುತ್ತದೆ, ಸ್ಥಳ ಗುರುತಿಸುವುದಿಲ್ಲ — ದಾಖಲೆಯಲ್ಲಿ ನಿರ್ದೇಶಾಂಕ ಇಲ್ಲ, ಆದ್ದರಿಂದ ತಾಲ್ಲೂಕಿನೊಳಗಿನ ಸ್ಥಾನ ಸೂಚಕ ಮಾತ್ರ.`}
          </p>
        </div>

        <aside className="pmap-side">
          {!sel ? (
            <>
              <h2>{en ? "Taluks in the programme" : "ಕಾರ್ಯಕ್ರಮದ ತಾಲ್ಲೂಕುಗಳು"}</h2>
              <p className="pmap-hint">
                {en ? "Select a pin on the map, or a taluk from the list."
                    : "ನಕ್ಷೆಯಲ್ಲಿ ಪಿನ್ ಅಥವಾ ಪಟ್ಟಿಯಿಂದ ತಾಲ್ಲೂಕನ್ನು ಆಯ್ಕೆ ಮಾಡಿ."}
              </p>
              {[...byDistrict.entries()]
                .sort((a, b) => b[1].length - a[1].length)
                .map(([dName, dList]) => (
                  <div key={dName} className="pmap-dgroup">
                    <div className="pmap-dhead">
                      <span>{dName}</span>
                      <b>{dList.length}</b>
                    </div>
                    <ul className="pmap-list">
                      {[...new Set(dList.map((p) => p.taluk))].sort().map((tName) => {
                        const list = byTaluk.get(tName)!;
                        const st = stat(list);
                        return (
                          <li key={tName}>
                            <button onClick={() => setSel(tName)}>
                              <span className="dn">{tName}</span>
                              <span className="dc">{list.length}</span>
                              <span className="ds">{st.surv === null ? "—" : `${st.surv}%`}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
            </>
          ) : (
            (() => {
              const s = stat(selected);
              return (
                <>
                  <button className="pmap-back" onClick={() => setSel(null)}>
                    ← {en ? "All taluks" : "ಎಲ್ಲಾ ತಾಲ್ಲೂಕುಗಳು"}
                  </button>
                  <h2>{sel}</h2>
                  <p className="pmap-sub">{selDistrict} {en ? "district" : "ಜಿಲ್ಲೆ"}</p>

                  <dl className="pmap-stats">
                    <dt>{en ? "Planted sites" : "ನೆಟ್ಟ ಸ್ಥಳಗಳು"}</dt>
                    <dd>{selected.length}</dd>
                    <dt>{en ? "Extent" : "ವಿಸ್ತೀರ್ಣ"}</dt>
                    <dd>{s.ha.toFixed(2)} ha</dd>
                    <dt>{en ? "Saplings" : "ಸಸಿಗಳು"}</dt>
                    <dd>{s.saplings.toLocaleString("en-IN")}</dd>
                    <dt>{en ? "Mean survival" : "ಸರಾಸರಿ ಉಳಿವು"}</dt>
                    <dd>{s.surv === null ? (en ? "not yet counted" : "ಇನ್ನೂ ಎಣಿಸಿಲ್ಲ") : `${s.surv}%`}</dd>
                    {s.flagged > 0 && (
                      <>
                        <dt>{en ? "Needing attention" : "ಗಮನ ಬೇಕಾದವು"}</dt>
                        <dd className="warn">{s.flagged}</dd>
                      </>
                    )}
                  </dl>

                  <h3>{en ? "Agro-climatic zones" : "ಕೃಷಿ-ಹವಾಮಾನ ವಲಯಗಳು"}</h3>
                  {s.zones.map((n) => {
                    const z = zoneOf(n);
                    if (!z) return null;
                    return (
                      <div className="pmap-zone" key={n}>
                        <b>{en ? z.en : z.kn} · {en ? "Zone" : "ವಲಯ"} {z.n}</b>
                        <span>{en ? "Rainfall" : "ಮಳೆ"} {z.rainfallMm} mm</span>
                        <span className="soil">
                          {en ? `Soils typical of this zone: ${z.soilsEn}` : `ಈ ವಲಯದ ವಿಶಿಷ್ಟ ಮಣ್ಣು: ${z.soilsKn}`}
                        </span>
                      </div>
                    );
                  })}
                  <p className="pmap-hint">
                    {en
                      ? "Soil is shown as characteristic of the zone. The register holds a zone against each site; it does not hold a soil survey, and where one has been done it belongs on that site's own record with its date."
                      : "ಮಣ್ಣನ್ನು ವಲಯದ ವಿಶಿಷ್ಟ ಗುಣವಾಗಿ ತೋರಿಸಲಾಗಿದೆ. ದಾಖಲೆಯಲ್ಲಿ ಪ್ರತಿ ಸ್ಥಳಕ್ಕೆ ವಲಯವಿದೆ, ಮಣ್ಣಿನ ಸಮೀಕ್ಷೆ ಇಲ್ಲ."}
                  </p>

                  <h3>{en ? "Sites" : "ಸ್ಥಳಗಳು"}</h3>
                  {/* The register holds no coordinate, so this cannot be a pin
                      dropped on a parcel — that would be a claim about ground
                      nobody has walked. What it can honestly be is a search for
                      the village itself, which is a real place a viewer can go
                      and look at. The link says which of the two it is. */}
                  <p className="pmap-hint" style={{ marginBottom: 8 }}>
                    {[...new Set(selected.map((p) => p.village).filter(Boolean))].join(" · ")}
                  </p>
                  <p className="pmap-hint" style={{ marginBottom: 8 }}>
                    {en
                      ? "The village link opens that village on Google Maps. It locates the village, not the site — the register holds no coordinate for the site itself, and a walked boundary is what will place it."
                      : "ಗ್ರಾಮದ ಕೊಂಡಿ ಆ ಗ್ರಾಮವನ್ನು ಗೂಗಲ್ ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯುತ್ತದೆ. ಇದು ಗ್ರಾಮವನ್ನು ತೋರಿಸುತ್ತದೆ, ತಾಕನ್ನಲ್ಲ."}
                  </p>
                  <ul className="pmap-parcels">
                    {selected.map((p) => (
                      <li key={p.id}>
                        <div className={`sitrow st-${p.status}`}>
                          <Link href={`/p/${p.id}?from=map&taluk=${encodeURIComponent(sel)}`}>
                            <span className="pvil">{p.village ?? "—"}</span>
                            <span className="pt mono">{p.id}</span>
                            <span className="pa">{p.areaHa} ha · {p.saplings.toLocaleString("en-IN")}</span>
                            <span className="pv">{p.survival}%</span>
                          </Link>
                          {p.village && (
                            <a
                              className="vmap"
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${p.village}, ${p.taluk}, ${p.district}, Karnataka`,
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              title={en
                                ? `Find ${p.village} village on Google Maps. This locates the village, not the parcel — the register holds no coordinate for the site itself.`
                                : `${p.village} ಗ್ರಾಮವನ್ನು ಗೂಗಲ್ ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ. ಇದು ಗ್ರಾಮವನ್ನು ತೋರಿಸುತ್ತದೆ, ತಾಕನ್ನಲ್ಲ.`}
                            >
                              {en ? "village ↗" : "ಗ್ರಾಮ ↗"}
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()
          )}
        </aside>
      </div>
    </div>
  );
}

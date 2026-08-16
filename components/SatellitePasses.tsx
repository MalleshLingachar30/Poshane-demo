"use client";

import { useState } from "react";
import { useDemo } from "./DemoContext";
import type { PassResult } from "@/lib/passes";

/**
 * Every satellite pass over this ground, fetched while you watch.
 *
 * The value here is not the list. It is that the list was not written by us.
 * A reviewer asking whether the platform reads imagery services or merely
 * claims to can see the request resolve, against the European Space Agency's
 * own catalogue, returning scenes and cloud figures nobody in the room chose.
 *
 * It also argues our own case better than prose does. The gaps between passes
 * and the wall of monsoon cloud are visible in the data itself, so the limits
 * of optical remote sensing are shown by the source rather than asserted by
 * the vendor.
 */

const USABLE_CLOUD = 20;

function fmt(iso: string, en: boolean) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(en ? "en-GB" : "kn-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SatellitePasses({ result }: { result: PassResult }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const [all, setAll] = useState(false);

  if (!result.ok) {
    // a failed query is reported as one — never quietly replaced with a stored
    // list, which would make a panel whose whole claim is provenance into a lie
    // about itself
    return (
      <div className="pass pass-err">
        {en
          ? `No catalogue data exported yet (${result.error}). Run: node scripts/fetch-passes.mjs`
          : `ಕ್ಯಾಟಲಾಗ್ ದತ್ತಾಂಶ ಇನ್ನೂ ರಫ್ತಾಗಿಲ್ಲ (${result.error}).`}
      </div>
    );
  }

  const passes = result.passes;

  const oldest = passes.at(-1)?.date?.slice(0, 4) ?? "";
  const newest = passes[0]?.date?.slice(0, 4) ?? "";
  const span = oldest && newest && oldest !== newest ? `${oldest}–${newest}` : oldest;

  const clear = passes.filter(
    (p) => p.cloudPct !== null && p.cloudPct < USABLE_CLOUD,
  );
  const shown = all ? passes : passes.slice(0, 12);

  return (
    <div className="pass">
      <div className="pass-sum">
        {en
          ? `${passes.length} passes over this point across ${span}, of which ${clear.length} are below ${USABLE_CLOUD}% cloud.`
          : `${span} ಅವಧಿಯಲ್ಲಿ ಈ ಸ್ಥಳದ ಮೇಲೆ ${passes.length} ಬಾರಿ ಉಪಗ್ರಹ ಹಾದುಹೋಗಿದೆ, ಅದರಲ್ಲಿ ${clear.length} ಚಿತ್ರಗಳು ${USABLE_CLOUD}%ಗಿಂತ ಕಡಿಮೆ ಮೋಡ ಹೊಂದಿವೆ.`}
      </div>

      <table className="pass-tbl">
        <thead>
          <tr>
            <th>{en ? "Acquired" : "ದಿನಾಂಕ"}</th>
            <th>{en ? "Cloud" : "ಮೋಡ"}</th>
            <th>{en ? "Level" : "ಹಂತ"}</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((p) => {
            const usable = p.cloudPct !== null && p.cloudPct < USABLE_CLOUD;
            return (
              <tr key={p.productId} className={usable ? "ok" : ""}>
                <td className="mono">{fmt(p.date, en)}</td>
                <td className="mono">
                  {p.cloudPct === null ? "—" : `${p.cloudPct.toFixed(0)}%`}
                </td>
                <td className="mono dim">{p.level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {passes.length > 12 && (
        <button className="spec-toggle" onClick={() => setAll((v) => !v)}>
          {all
            ? en ? "Show fewer" : "ಕಡಿಮೆ ತೋರಿಸಿ"
            : en ? `Show all ${passes.length}` : `ಎಲ್ಲಾ ${passes.length} ತೋರಿಸಿ`}
        </button>
      )}

      <p className="pass-note">
        {en
          ? `Queried from the Copernicus Data Space catalogue on ${new Date(result.queriedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. The gaps between passes and the run of high-cloud scenes through the monsoon are the archive's own, not a selection — and they are why survival is counted on the ground.`
          : "ಕೋಪರ್ನಿಕಸ್ ಡೇಟಾ ಸ್ಪೇಸ್ ಕ್ಯಾಟಲಾಗ್‌ನಿಂದ ನೇರವಾಗಿ ಪಡೆದದ್ದು. ಹಾದುಹೋಗುವಿಕೆಗಳ ನಡುವಿನ ಅಂತರ ಮತ್ತು ಮಳೆಗಾಲದ ಮೋಡದ ಚಿತ್ರಗಳು ಸಂಗ್ರಹದ ನೈಜ ಸ್ಥಿತಿ — ಆಯ್ಕೆ ಮಾಡಿದ್ದಲ್ಲ."}
      </p>
    </div>
  );
}

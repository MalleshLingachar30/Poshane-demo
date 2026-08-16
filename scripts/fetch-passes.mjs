#!/usr/bin/env node
/**
 * Pull the Sentinel-2 pass list from the Copernicus catalogue and write it to
 * lib/passes-data.json.
 *
 *     node scripts/fetch-passes.mjs
 *
 * Run it by hand and commit the result. This is not a fallback to invented
 * data — the query below is the real one, against the European Space Agency's
 * catalogue, and the file it writes contains their answer and the date it was
 * asked. What changes is only when the asking happens: on a laptop, on demand,
 * rather than on every deploy.
 *
 * That is the honest arrangement given the catalogue's speed. A geographic
 * query over a two-year window takes fifteen to twenty-five seconds, which is
 * fine to wait for at a terminal and not fine inside a page build. Re-run it
 * whenever the window should move; the archive itself is historical and does
 * not change behind you.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LAT = 13.4966;
const LNG = 76.1361;
// Widened back from June 2024. The monsoon months carry no usable scene at all,
// so a "before" frame has to come from the dry season preceding planting — and
// it must be compared against the same season two years later, or the
// difference on show is rainfall rather than trees.
const FROM = "2024-01-01";
const TO = "2026-09-01";

const CATALOGUE = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products";

// POINT() takes longitude before latitude — the reverse of how coordinates are
// spoken. Backwards, this returns an empty list rather than an error.
const filter = [
  "Collection/Name eq 'SENTINEL-2'",
  "contains(Name,'MSIL2A')",
  `OData.CSC.Intersects(area=geography'SRID=4326;POINT(${LNG} ${LAT})')`,
  `ContentDate/Start gt ${FROM}T00:00:00.000Z`,
  `ContentDate/Start lt ${TO}T00:00:00.000Z`,
].join(" and ");

const PAGE = 60;

/**
 * The catalogue caps a response, so the window has to be walked in pages.
 *
 * This matters more than it looks. A single unpaged request returns the most
 * recent sixty products and nothing older, which for this window means about
 * five weeks of high monsoon — and a summary drawn from that would both
 * understate the number of passes and overstate the cloud, since it samples
 * only the worst season. Counting properly is the difference between a figure
 * that survives being questioned and one that does not.
 */
async function page(skip) {
  const url =
    `${CATALOGUE}?$filter=${encodeURIComponent(filter)}` +
    `&$expand=Attributes&$orderby=${encodeURIComponent("ContentDate/Start desc")}` +
    `&$top=${PAGE}&$skip=${skip}`;
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) {
    console.error(`\nCatalogue returned ${r.status} at skip=${skip}.`);
    console.error(await r.text().catch(() => ""));
    process.exit(1);
  }
  const j = await r.json();
  return j.value ?? [];
}

const started = Date.now();
const raw = [];
let truncated = false;
for (let skip = 0; ; skip += PAGE) {
  process.stdout.write(`  page ${skip / PAGE + 1}… `);
  const batch = await page(skip);
  raw.push(...batch);
  console.log(`${batch.length} products (${raw.length} so far)`);
  if (batch.length < PAGE) break;
  if (skip > 4000) { truncated = true; console.log("  stopping at 4000 products"); break; }
}
const secs = ((Date.now() - started) / 1000).toFixed(1);

const items = raw
  .filter((p) => String(p.Name ?? "").includes("MSIL2A"))
  .map((p) => {
    const cloud = (p.Attributes ?? []).find((a) => a.Name === "cloudCover");
    const n = cloud ? Number(cloud.Value) : NaN;
    return {
      date: String(p.ContentDate?.Start ?? ""),
      cloudPct: Number.isFinite(n) ? n : null,
      level: "L2A",
      productId: String(p.Id ?? ""),
    };
  });

// one row per acquisition, not one per product
const seen = new Set();
const passes = items.filter((p) => {
  const key = p.date.slice(0, 16);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const out = {
  queriedAt: new Date().toISOString(),
  point: { lat: LAT, lng: LNG },
  window: { from: FROM, to: TO },
  passes,
};

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(here, "..", "lib", "passes-data.json");
await writeFile(dest, JSON.stringify(out, null, 2) + "\n");

const clear = passes.filter((p) => p.cloudPct !== null && p.cloudPct < 20).length;
const oldest = passes.at(-1)?.date?.slice(0, 10) ?? "?";
const newest = passes[0]?.date?.slice(0, 10) ?? "?";
console.log(`\n${raw.length} products returned in ${secs}s`);
console.log(`${passes.length} distinct passes, ${oldest} to ${newest}`);
console.log(`${clear} of them below 20% cloud`);
// A short gap between the window start and the first pass is just the revisit
// cycle, not truncation. Truncation is only possible if the page guard tripped.
if (truncated) {
  console.log(`\n! stopped early — the list is incomplete and the counts understate the archive.`);
}
console.log(`\nWritten to lib/passes-data.json — commit it.`);

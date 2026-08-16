#!/usr/bin/env node
/**
 * Pull the two dated Sentinel-2 scenes as cropped JPEGs.
 *
 *     export CDSE_CLIENT_ID=...
 *     export CDSE_CLIENT_SECRET=...
 *     node scripts/fetch-imagery.mjs
 *
 * Writes public/satellite/plot-2024.jpg and plot-2026.jpg, and prints the
 * exact bounds to paste into lib/satellite.ts so the plot outline can be
 * drawn from the ground coordinates rather than placed by eye.
 *
 * The two dates are not arbitrary. 26 March 2024 and 26 March 2026 are the
 * same day of the year, both effectively cloudless in the catalogue — 0.0007%
 * and 0.006% — and they sit either side of the June 2024 planting. Matching
 * the day of year matters: it fixes sun angle and season, so the only thing
 * that can differ between the frames is the ground itself. Compare a monsoon
 * scene with a dry-season one and what you are showing is rainfall.
 *
 * Credentials come from the Copernicus Data Space dashboard, under User
 * Settings → OAuth clients. Registration is free. They are read from the
 * environment and never written to a file — nothing here should end up in a
 * commit.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const CENTRE = { lat: 13.4966, lng: 76.1361 };
const SPAN_M = 1000;                 // roughly a kilometre across
const SIZE = 1024;                   // output pixels per side

const SCENES = [
  { date: "2024-03-26", file: "plot-2024.jpg" },
  { date: "2026-03-26", file: "plot-2026.jpg" },
];

const id = process.env.CDSE_CLIENT_ID;
const secret = process.env.CDSE_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set CDSE_CLIENT_ID and CDSE_CLIENT_SECRET first.");
  console.error("Create them at https://dataspace.copernicus.eu → User Settings → OAuth clients");
  process.exit(1);
}

// a metre in degrees, at this latitude
const dLat = SPAN_M / 2 / 110574;
const dLng = SPAN_M / 2 / (111320 * Math.cos((CENTRE.lat * Math.PI) / 180));
const bounds = {
  west: CENTRE.lng - dLng,
  south: CENTRE.lat - dLat,
  east: CENTRE.lng + dLng,
  north: CENTRE.lat + dLat,
};

console.log("Requesting an access token…");
const tokenRes = await fetch(
  "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token",
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  },
);
if (!tokenRes.ok) {
  console.error(`Token request failed: ${tokenRes.status}`);
  console.error(await tokenRes.text().catch(() => ""));
  process.exit(1);
}
const { access_token: token } = await tokenRes.json();

// True colour, with a gentle gain. Sentinel reflectance is dark straight out
// of the box, and 2.5 is the conventional stretch for a readable true-colour
// image — the same one the browser applies by default.
const evalscript = `
//VERSION=3
function setup() {
  return { input: ["B02","B03","B04"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  return [2.5 * s.B04, 2.5 * s.B03, 2.5 * s.B02];
}`;

const here = dirname(fileURLToPath(import.meta.url));

for (const scene of SCENES) {
  process.stdout.write(`${scene.date} … `);

  const body = {
    input: {
      bounds: {
        bbox: [bounds.west, bounds.south, bounds.east, bounds.north],
        properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
      },
      data: [
        {
          type: "sentinel-2-l2a",
          dataFilter: {
            // a single day, so the frame is one acquisition and its date is
            // exactly what the caption will claim
            timeRange: {
              from: `${scene.date}T00:00:00Z`,
              to: `${scene.date}T23:59:59Z`,
            },
          },
        },
      ],
    },
    output: {
      width: SIZE,
      height: SIZE,
      responses: [{ identifier: "default", format: { type: "image/jpeg" } }],
    },
    evalscript,
  };

  const r = await fetch("https://sh.dataspace.copernicus.eu/api/v1/process", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "image/jpeg",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    console.log("failed");
    console.error(`  ${r.status}: ${await r.text().catch(() => "")}`);
    process.exit(1);
  }

  const buf = Buffer.from(await r.arrayBuffer());
  const dest = join(here, "..", "public", "satellite", scene.file);
  await writeFile(dest, buf);
  console.log(`${(buf.length / 1024).toFixed(0)} KB → public/satellite/${scene.file}`);
}

console.log(`
Both written. Now set these on each frame in lib/satellite.ts:

  present: true,
  bounds: {
    north: ${bounds.north.toFixed(6)},
    south: ${bounds.south.toFixed(6)},
    east: ${bounds.east.toFixed(6)},
    west: ${bounds.west.toFixed(6)},
  },

and the acquisition dates — 26 March 2024 and 26 March 2026 — with cloudPct
0.0007 and 0.006 respectively.

Look at both images before committing. If a frame comes back blank or oddly
coloured, the scene may not cover this bbox despite the catalogue listing it;
widen the timeRange by a day and check what you get.`);

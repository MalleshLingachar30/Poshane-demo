"use client";

import { useMemo, useState } from "react";
import type { Walk } from "@/lib/offers";

/**
 * The walked boundary over real satellite imagery.
 *
 * Tiles are assembled directly rather than through a mapping library: a fixed
 * grid of tile images with the boundary drawn over it in SVG. It prints, it has
 * no dependency, and it cannot drift from the coordinates it was given.
 *
 * The imagery here is Esri World Imagery, which needs no key and is adequate for
 * a demonstration. In production the basemap is read from K-GIS under the state
 * data-sharing arrangement, or from Bhoonidhi where sub-metre Indian imagery is
 * required — a decision that belongs to §13, not to this component.
 */

const TILE = 256;

/**
 * Two sources, because they answer different questions.
 *
 * Esri World Imagery is sharp over towns but thins out over rural Karnataka —
 * above its available detail it serves a "map data not yet available" tile
 * rather than a picture, which is why the zoom here is capped.
 *
 * Sentinel-2 is ESA's open 10-metre archive: coarser, but complete, current,
 * free, and the same source §12 uses for canopy corroboration. When a reviewer
 * asks what the platform actually reads, this is the honest answer.
 */
type SourceKey = "esri" | "sentinel";

const SOURCES: Record<SourceKey, {
  labelEn: string; labelKn: string; url: (z: number, x: number, y: number) => string;
  minZ: number; maxZ: number; attribution: string;
}> = {
  esri: {
    labelEn: "Esri World Imagery",
    labelKn: "ಎಸ್ರಿ ವರ್ಲ್ಡ್ ಇಮೇಜರಿ",
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    minZ: 10,
    maxZ: 16,
    attribution: "Imagery · Esri, Maxar, Earthstar Geographics",
  },
  sentinel: {
    labelEn: "Sentinel-2 · ESA, 10 m",
    labelKn: "ಸೆಂಟಿನೆಲ್-2 · ಇಎಸ್‌ಎ, 10 ಮೀ",
    url: (z, x, y) =>
      `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/${z}/${y}/${x}.jpg`,
    minZ: 10,
    maxZ: 17,
    attribution: "Sentinel-2 cloudless · EOX IT Services, contains modified Copernicus data",
  },
};

const lngToX = (lng: number, z: number) => ((lng + 180) / 360) * 2 ** z;
const latToY = (lat: number, z: number) => {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 2 ** z;
};

export default function ParcelSatellite({
  walk,
  height = 320,
  cols = 3,
  rows = 3,
}: {
  walk: Walk;
  height?: number;
  cols?: number;
  rows?: number;
}) {
  const [source, setSource] = useState<SourceKey>("esri");
  const src = SOURCES[source];
  const [z, setZ] = useState(16);
  const [failed, setFailed] = useState(0);

  // each source carries its own usable range; clamp rather than serve a blank
  const zoom = Math.min(src.maxZ, Math.max(src.minZ, z));

  const view = useMemo(() => {
    const [clng, clat] = walk.centroid;
    const cx = lngToX(clng, zoom);
    const cy = latToY(clat, zoom);

    // the tile grid centred on the parcel
    const x0 = Math.floor(cx) - Math.floor(cols / 2);
    const y0 = Math.floor(cy) - Math.floor(rows / 2);

    const W = cols * TILE;
    const H = rows * TILE;

    // where the centroid falls inside that grid, in pixels
    const ox = (cx - x0) * TILE;
    const oy = (cy - y0) * TILE;

    const toPx = (lng: number, lat: number): [number, number] => [
      (lngToX(lng, zoom) - x0) * TILE,
      (latToY(lat, zoom) - y0) * TILE,
    ];

    const pts = walk.points.map((p) => toPx(p[0], p[1]));
    const d =
      pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") +
      (walk.mode === "ring" ? " Z" : "");

    const tiles: { x: number; y: number; left: number; top: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tiles.push({ x: x0 + c, y: y0 + r, left: c * TILE, top: r * TILE });
      }
    }

    // how big the parcel actually is on screen at this zoom
    const px = pts.map((q) => q[0]);
    const py = pts.map((q) => q[1]);
    const extent = Math.max(
      Math.max(...px) - Math.min(...px),
      Math.max(...py) - Math.min(...py),
      1,
    );

    return { W, H, ox, oy, d, pts, tiles, extent };
  }, [walk, zoom, cols, rows]);

  /**
   * Scale to the parcel, not to the tile grid. Fitting the whole grid into the
   * frame shrank a two-hectare parcel to a handful of pixels; the frame crops
   * instead, and the parcel is brought up to roughly half the frame — but never
   * beyond 2.5×, because past that the imagery is invented rather than resolved.
   */
  const scale = Math.min(2.5, Math.max(1, (height * 0.5) / view.extent));
  const shiftX = view.W / 2 - view.ox;
  const shiftY = view.H / 2 - view.oy;

  return (
    <div className="sat">
      <div className="sat-frame" style={{ height }}>
        {/* the plane is larger than the frame; the frame crops it */}
        <div
          className="sat-plane"
          style={{
            width: view.W,
            height: view.H,
            transform: `translate(-50%, -50%) scale(${scale}) translate(${shiftX}px, ${shiftY}px)`,
          }}
        >
          {view.tiles.map((t) => (
            <img
              key={`${source}-${zoom}-${t.x}-${t.y}`}
              src={src.url(zoom, t.x, t.y)}
              alt=""
              width={TILE}
              height={TILE}
              loading="lazy"
              onError={() => setFailed((n) => n + 1)}
              style={{ position: "absolute", left: t.left, top: t.top }}
            />
          ))}

          <svg
            viewBox={`0 0 ${view.W} ${view.H}`}
            width={view.W}
            height={view.H}
            style={{ position: "absolute", inset: 0 }}
          >
            {walk.mode === "ring" ? (
              <path d={view.d} fill="#C09A3E" fillOpacity="0.16" stroke="#C09A3E" strokeWidth="3" />
            ) : (
              <>
                <path d={view.d} fill="none" stroke="#C09A3E" strokeOpacity="0.3"
                      strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                <path d={view.d} fill="none" stroke="#C09A3E" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
            {view.pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#C09A3E" strokeWidth="2" />
            ))}
          </svg>
        </div>

        <div className="sat-zoom">
          <button onClick={() => setZ(Math.min(src.maxZ, zoom + 1))}
                  disabled={zoom >= src.maxZ} aria-label="Zoom in">+</button>
          <button onClick={() => setZ(Math.max(src.minZ, zoom - 1))}
                  disabled={zoom <= src.minZ} aria-label="Zoom out">−</button>
        </div>

        <div className="sat-source">
          {(Object.keys(SOURCES) as SourceKey[]).map((k) => (
            <button
              key={k}
              className={k === source ? "on" : ""}
              onClick={() => { setSource(k); setZ(Math.min(SOURCES[k].maxZ, zoom)); setFailed(0); }}
            >
              {SOURCES[k].labelEn}
            </button>
          ))}
        </div>

        {source === "sentinel" && zoom >= 16 && (
          <div className="sat-native">
            Each block is one 10-metre Sentinel-2 pixel. This is the limit of what
            the free archive resolves — and why survival is counted on the ground.
          </div>
        )}

        <div className="sat-attr">{src.attribution}</div>
      </div>

      {failed > 0 && (
        <div className="sat-offline">
          Imagery could not be loaded. The boundary and its coordinates are held in the
          record regardless — the basemap is a backdrop, never the evidence.
        </div>
      )}
    </div>
  );
}

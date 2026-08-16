/**
 * The satellite half of the evidence page.
 *
 * One pair for the set, not one per photograph, and this is deliberate.
 *
 * Sentinel-2 passes over Karnataka at about 10:30 IST on a five-day cycle, and
 * three of the four ground captures were made between 13:17 and 13:37. So a
 * same-day, same-hour match is not something the instrument can deliver — not
 * because of any gap in the platform, but because the satellite was three hours
 * gone. Add monsoon cloud over the planting season and a 10 m pixel that cannot
 * resolve a sapling, and per-photograph corroboration stops being a claim worth
 * making.
 *
 * What the imagery does answer is the slower question: did this land change
 * across years the way the record says it did. The photographs are checked in
 * the moment, by position and tag tap and two clocks. The parcel is checked
 * across the seasons, from orbit. Two instruments, two timescales, neither one
 * asked to do the other's job.
 *
 * PICK THE SAME SEASON FOR BOTH. The catalogue shows no usable scene over this
 * plot in any monsoon month across three years — June to September is a wall of
 * cloud — so a before frame has to come from the dry season preceding planting.
 * It must then be compared against the same months two years later. A monsoon
 * frame against a dry-season one shows a difference driven by rainfall, and any
 * remote-sensing officer in the room will say so.
 *
 * FILLING THESE IN — see public/satellite/README.md for the export steps. Until
 * a file exists at `file`, the frame renders as a labelled placeholder rather
 * than pretending to imagery nobody has pulled.
 */

export type SatelliteFrame = {
  file: string;
  /**
   * Set true only once the file actually exists at `file`. Left false, the
   * frame renders a labelled placeholder. This is declared rather than
   * detected: asking the browser whether an image loaded is a race, and a
   * frame that flickers a broken glyph on a page about evidence is worse than
   * one that plainly says the imagery has not been pulled yet.
   */
  present?: boolean;
  /** the scene's own acquisition date, NOT the ground photo's date */
  acquiredEn: string;
  acquiredKn: string;
  captionEn: string;
  captionKn: string;
  /** reported scene cloud cover, %, from the export dialogue */
  cloudPct?: number;
  /**
   * Geographic bounds of the exported crop, filled in from Copernicus Browser.
   * Given these, the plot outline is drawn from the real capture coordinates.
   * Leave undefined and no outline is drawn — better a clean frame than a box
   * in the wrong place.
   */
  bounds?: { north: number; south: number; east: number; west: number };
};

export const SATELLITE_SOURCE = {
  en: "Sentinel-2 L2A · European Space Agency, Copernicus Programme · 10 m",
  kn: "ಸೆಂಟಿನೆಲ್-2 L2A · ಯುರೋಪಿಯನ್ ಬಾಹ್ಯಾಕಾಶ ಸಂಸ್ಥೆ, ಕೋಪರ್ನಿಕಸ್ · 10 ಮೀ",
  note: "Contains modified Copernicus Sentinel data",
};

export const SATELLITE_PAIR: [SatelliteFrame, SatelliteFrame] = [
  {
    file: "/satellite/plot-2024.jpg",
    acquiredEn: "Acquisition date to be filled in",
    acquiredKn: "ಚಿತ್ರ ತೆಗೆದ ದಿನಾಂಕ ಭರ್ತಿ ಮಾಡಬೇಕಿದೆ",
    captionEn: "Dry season before planting",
    captionKn: "ನೆಡುವ ಮೊದಲಿನ ಬೇಸಿಗೆ",
  },
  {
    file: "/satellite/plot-2026.jpg",
    acquiredEn: "Acquisition date to be filled in",
    acquiredKn: "ಚಿತ್ರ ತೆಗೆದ ದಿನಾಂಕ ಭರ್ತಿ ಮಾಡಬೇಕಿದೆ",
    captionEn: "Same season, two years on",
    captionKn: "ಅದೇ ಋತು, ಎರಡು ವರ್ಷಗಳ ನಂತರ",
  },
];

/** the ground captures, as a bounding box — used to place the plot outline */
export const PLOT_EXTENT = {
  north: 13.497672,
  south: 13.496414,
  east: 76.137161,
  west: 76.135917,
};

/** one Sentinel-2 acquisition over a point, as the Copernicus catalogue reports it */
export type Pass = {
  date: string;
  cloudPct: number | null;
  level: string;
  productId: string;
};

/**
 * The visits put to the catalogue in the third panel.
 *
 * These are not chosen to flatter. Two of the three fall in the monsoon and
 * cannot be corroborated from orbit at all; they are here precisely because
 * they fail. Each date is the capture date of a photograph shown further up
 * the page, so a reader can check one panel against the other.
 */
export const VISITS = [
  {
    date: "2024-06-15",
    labelEn: "Planting",
    labelKn: "ನೆಡುವಿಕೆ",
    kindEn: "monsoon — the season planting must happen in",
    kindKn: "ಮಳೆಗಾಲ — ನೆಡುವಿಕೆ ನಡೆಯಲೇಬೇಕಾದ ಋತು",
  },
  {
    date: "2025-04-01",
    labelEn: "Field visit",
    labelKn: "ಕ್ಷೇತ್ರ ಭೇಟಿ",
    kindEn: "dry season — when the annual count falls",
    kindKn: "ಬೇಸಿಗೆ — ವಾರ್ಷಿಕ ಗಣತಿ ನಡೆಯುವ ಕಾಲ",
  },
  {
    date: "2026-08-08",
    labelEn: "Audit inspection",
    labelKn: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ಭೇಟಿ",
    kindEn: "monsoon",
    kindKn: "ಮಳೆಗಾಲ",
  },
];

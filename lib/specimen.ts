/**
 * Specimen capture records.
 *
 * These are real photographs from Grobet's own sandalwood planting, not from
 * any Poshane parcel. They are here to show what a capture record looks like
 * once the §7 integrity rules are applied to it — nothing on this page is a
 * claim about programme land, and none of it appears on a parcel record.
 *
 * Every field below is read from the file's own EXIF. Nothing is invented.
 * In particular deviceTime and satelliteTime come from two different clocks:
 * the handset's, which its holder can set, and the GPS constellation's, which
 * they cannot. Their agreement is the check, and it is why both are shown.
 */

export type Specimen = {
  file: string;
  captionEn: string;
  captionKn: string;
  /** local capture time, as the handset recorded it, IST (+05:30) */
  deviceTime: string;
  /** the same instant as the GPS receiver recorded it, UTC */
  satelliteTimeUtc: string;
  /** the same instant converted to IST, for comparison with deviceTime */
  satelliteTimeIst: string;
  lat: number;
  lng: number;
  /** horizontal positioning error reported by the receiver, metres */
  accuracyM: number;
  /** metres above sea level */
  altitudeM: number;
  device: string;
  lens: string;
};

export const SPECIMENS: Specimen[] = [
  {
    file: "/specimen/s1-2024-06.jpg",
    captionEn: "Ground prepared, before planting",
    captionKn: "ನೆಡುವ ಮೊದಲು, ಸಿದ್ಧಪಡಿಸಿದ ನೆಲ",
    deviceTime: "15 June 2024, 09:51:58",
    satelliteTimeUtc: "15 June 2024, 04:21:58",
    satelliteTimeIst: "15 June 2024, 09:51:58",
    lat: 13.496625,
    lng: 76.136178,
    accuracyM: 4.19,
    altitudeM: 726.1,
    device: "Apple iPhone 14 Pro",
    lens: "back triple camera 9mm f/2.8",
  },
  {
    file: "/specimen/s2-2024-08.jpg",
    captionEn: "Planted out, rows visible",
    captionKn: "ನೆಟ್ಟ ನಂತರ, ಸಾಲುಗಳು ಗೋಚರ",
    deviceTime: "23 August 2024, 13:21:29",
    satelliteTimeUtc: "23 August 2024, 07:51:28",
    satelliteTimeIst: "23 August 2024, 13:21:28",
    lat: 13.496414,
    lng: 76.135917,
    accuracyM: 3.17,
    altitudeM: 724.9,
    device: "Apple iPhone 14 Pro",
    lens: "back triple camera 6.86mm f/1.78",
  },
  {
    file: "/specimen/s4-2026-08.jpg",
    captionEn: "Same plot, twenty-six months after planting",
    captionKn: "ಅದೇ ತಾಕು, ನೆಟ್ಟು ಇಪ್ಪತ್ತಾರು ತಿಂಗಳ ನಂತರ",
    deviceTime: "8 August 2026, 13:17:49",
    satelliteTimeUtc: "8 August 2026, 07:47:49",
    satelliteTimeIst: "8 August 2026, 13:17:49",
    lat: 13.497594,
    lng: 76.136392,
    accuracyM: 4.75,
    altitudeM: 724.7,
    device: "Apple iPhone 14 Pro",
    lens: "back triple camera 6.86mm f/1.78",
  },
  {
    file: "/specimen/s5-2026-08-tree.jpg",
    captionEn: "Single tree, same visit",
    captionKn: "ಒಂದೇ ಮರ, ಅದೇ ಭೇಟಿ",
    deviceTime: "8 August 2026, 13:37:48",
    satelliteTimeUtc: "8 August 2026, 08:07:48",
    satelliteTimeIst: "8 August 2026, 13:37:48",
    lat: 13.496725,
    lng: 76.136939,
    accuracyM: 4.79,
    altitudeM: 730.2,
    device: "Apple iPhone 14 Pro",
    lens: "back triple camera 6.86mm f/1.78",
  },
];

/** metres between two coordinates, flat-earth approximation — fine at this scale */
export function metresBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const mPerDegLat = 110574;
  const mPerDegLng = 111320 * Math.cos((a.lat * Math.PI) / 180);
  const dy = (a.lat - b.lat) * mPerDegLat;
  const dx = (a.lng - b.lng) * mPerDegLng;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

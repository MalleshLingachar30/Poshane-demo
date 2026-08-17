/**
 * Karnataka's agro-climatic zones.
 *
 * The register holds a zone number against every parcel, and that number is
 * real programme data. Soil is not held per parcel — so what is shown here is
 * the soil characteristic of the zone, labelled as such on screen.
 *
 * The distinction matters more than it might seem. "Red sandy loam" presented
 * as a fact about a particular two hectares is a claim somebody can go and
 * disprove with an auger; presented as what the Central Dry Zone is typically
 * made of, it is background that helps a committee read the parcel and cannot
 * be wrong about it. Where a soil survey has actually been done, it belongs on
 * the parcel record with its date and who did it — not here.
 *
 * Classification follows the ten-zone scheme used by the state agricultural
 * universities.
 */

export type Zone = {
  n: number;
  en: string;
  kn: string;
  rainfallMm: string;
  soilsEn: string;
  soilsKn: string;
};

export const ZONES: Zone[] = [
  {
    n: 1, en: "North Eastern Transition", kn: "ಈಶಾನ್ಯ ಪರಿವರ್ತನ ವಲಯ",
    rainfallMm: "830–1000",
    soilsEn: "deep black clay, with medium black soils on the lighter slopes",
    soilsKn: "ಆಳವಾದ ಕಪ್ಪು ಜೇಡಿಮಣ್ಣು",
  },
  {
    n: 2, en: "North Eastern Dry", kn: "ಈಶಾನ್ಯ ಒಣ ವಲಯ",
    rainfallMm: "680–900",
    soilsEn: "medium to deep black soils, shallow and gravelly on the ridges",
    soilsKn: "ಮಧ್ಯಮದಿಂದ ಆಳವಾದ ಕಪ್ಪು ಮಣ್ಣು",
  },
  {
    n: 3, en: "Northern Dry", kn: "ಉತ್ತರ ಒಣ ವಲಯ",
    rainfallMm: "460–785",
    soilsEn: "shallow to medium black, with red sandy loam in patches",
    soilsKn: "ತೆಳು ಕಪ್ಪು ಮಣ್ಣು, ಅಲ್ಲಲ್ಲಿ ಕೆಂಪು ಮರಳು ಗೋಡು",
  },
  {
    n: 4, en: "Central Dry", kn: "ಮಧ್ಯ ಒಣ ವಲಯ",
    rainfallMm: "455–720",
    soilsEn: "red sandy loam over gravel, shallow on the uplands",
    soilsKn: "ಕೆಂಪು ಮರಳು ಗೋಡು, ಮೇಲ್ಭಾಗದಲ್ಲಿ ತೆಳು",
  },
  {
    n: 5, en: "Eastern Dry", kn: "ಪೂರ್ವ ಒಣ ವಲಯ",
    rainfallMm: "680–890",
    soilsEn: "red loamy soils, gravelly and shallow in the interfluves",
    soilsKn: "ಕೆಂಪು ಗೋಡು ಮಣ್ಣು",
  },
  {
    n: 6, en: "Southern Dry", kn: "ದಕ್ಷಿಣ ಒಣ ವಲಯ",
    rainfallMm: "670–900",
    soilsEn: "red sandy to loamy soils, with laterite on the higher ground",
    soilsKn: "ಕೆಂಪು ಮರಳು ಮತ್ತು ಗೋಡು ಮಣ್ಣು",
  },
  {
    n: 7, en: "Southern Transition", kn: "ದಕ್ಷಿಣ ಪರಿವರ್ತನ ವಲಯ",
    rainfallMm: "610–1100",
    soilsEn: "red loam moving to lateritic soils towards the ghats",
    soilsKn: "ಕೆಂಪು ಗೋಡು, ಘಟ್ಟದ ಕಡೆಗೆ ಜಂಬಿಟ್ಟಿಗೆ ಮಣ್ಣು",
  },
  {
    n: 8, en: "Northern Transition", kn: "ಉತ್ತರ ಪರಿವರ್ತನ ವಲಯ",
    rainfallMm: "620–1100",
    soilsEn: "medium black to red loam, deeper in the valleys",
    soilsKn: "ಮಧ್ಯಮ ಕಪ್ಪು ಮತ್ತು ಕೆಂಪು ಗೋಡು ಮಣ್ಣು",
  },
  {
    n: 9, en: "Hilly", kn: "ಮಲೆನಾಡು ವಲಯ",
    rainfallMm: "900–3800",
    soilsEn: "lateritic and forest soils, acidic and well drained",
    soilsKn: "ಜಂಬಿಟ್ಟಿಗೆ ಮತ್ತು ಅರಣ್ಯ ಮಣ್ಣು",
  },
  {
    n: 10, en: "Coastal", kn: "ಕರಾವಳಿ ವಲಯ",
    rainfallMm: "3000–4000",
    soilsEn: "lateritic and coastal alluvial soils",
    soilsKn: "ಜಂಬಿಟ್ಟಿಗೆ ಮತ್ತು ಕರಾವಳಿ ಮೆಕ್ಕಲು ಮಣ್ಣು",
  },
];

export function zone(n: number): Zone | undefined {
  return ZONES.find((z) => z.n === n);
}

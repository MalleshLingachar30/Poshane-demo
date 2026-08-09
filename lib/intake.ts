// Land Availability Intake — field spec, bilingual labels, and validation.
// Self-contained: this module adds no strings to lib/i18n.ts and imports nothing
// from the rest of the demo, so it can be dropped in or removed cleanly.

export type Lang = "en" | "kn";

export type Field = {
  key: string;
  header: string; // exact column header in the template workbook
  en: string;
  kn: string;
  group: string;
  required: boolean;
  type: "text" | "number" | "select" | "coord" | "combo";
  options?: { en: string; kn: string }[];
  suggest?: "district" | "taluk" | "hobli";
  hint?: { en: string; kn: string };
};

const opt = (pairs: [string, string][]) => pairs.map(([en, kn]) => ({ en, kn }));

export const GROUPS: { key: string; en: string; kn: string }[] = [
  { key: "where", en: "Where is it", kn: "ಎಲ್ಲಿದೆ" },
  { key: "what", en: "What is it", kn: "ಯಾವ ಭೂಮಿ" },
  { key: "point", en: "Point on the map", kn: "ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಾನ" },
  { key: "site", en: "Site conditions", kn: "ಸ್ಥಳದ ಸ್ಥಿತಿ" },
  { key: "enc", en: "Encumbrances", kn: "ತೊಡಕುಗಳು" },
  { key: "fit", en: "Programme fit", kn: "ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಹೊಂದಾಣಿಕೆ" },
  { key: "contact", en: "Contact", kn: "ಸಂಪರ್ಕ" },
];

export const FIELDS: Field[] = [
  { key: "district", header: "District", en: "District", kn: "ಜಿಲ್ಲೆ", group: "where", required: true, type: "combo", suggest: "district" },
  { key: "taluk", header: "Taluk", en: "Taluk", kn: "ತಾಲ್ಲೂಕು", group: "where", required: true, type: "combo", suggest: "taluk",
    hint: { en: "Choose a district first and this list narrows to its taluks.", kn: "ಮೊದಲು ಜಿಲ್ಲೆ ಆರಿಸಿ, ಈ ಪಟ್ಟಿ ಆ ಜಿಲ್ಲೆಯ ತಾಲ್ಲೂಕುಗಳಿಗೆ ಸೀಮಿತವಾಗುತ್ತದೆ." } },
  { key: "hobli", header: "Hobli", en: "Hobli", kn: "ಹೋಬಳಿ", group: "where", required: false, type: "combo", suggest: "hobli" },
  { key: "village", header: "Village", en: "Village", kn: "ಗ್ರಾಮ", group: "where", required: true, type: "text",
    hint: { en: "As written on the RTC.", kn: "ಆರ್‌ಟಿಸಿಯಲ್ಲಿ ಬರೆದಂತೆ." } },
  { key: "survey", header: "Survey number", en: "Survey number", kn: "ಸರ್ವೆ ಸಂಖ್ಯೆ", group: "where", required: true, type: "text",
    hint: { en: "As on the RTC, e.g. 142/3.", kn: "ಆರ್‌ಟಿಸಿಯಂತೆ, ಉದಾ. 142/3." } },
  { key: "subdiv", header: "Sub-division", en: "Sub-division", kn: "ಉಪ ವಿಭಾಗ", group: "where", required: false, type: "text" },

  { key: "category", header: "Land category", en: "Land category", kn: "ಭೂಮಿಯ ವರ್ಗ", group: "what", required: true, type: "select",
    options: opt([
      ["Revenue wasteland (Bane/Banjar)", "ಕಂದಾಯ ಬಂಜರು ಭೂಮಿ"],
      ["Gomala / grazing land", "ಗೋಮಾಳ / ಮೇವಿನ ಭೂಮಿ"],
      ["Forest land - degraded", "ಅರಣ್ಯ ಭೂಮಿ - ಕ್ಷೀಣಿಸಿದ"],
      ["Forest land - blank area", "ಅರಣ್ಯ ಭೂಮಿ - ಖಾಲಿ ಪ್ರದೇಶ"],
      ["Tank foreshore / bund", "ಕೆರೆ ಅಂಗಳ / ಏರಿ"],
      ["Canal bank", "ಕಾಲುವೆ ದಂಡೆ"],
      ["Roadside / avenue strip", "ರಸ್ತೆ ಬದಿ"],
      ["Institutional campus (school, hospital, office)", "ಸಂಸ್ಥೆಯ ಆವರಣ"],
      ["Panchayat land", "ಪಂಚಾಯಿತಿ ಭೂಮಿ"],
      ["Other government land", "ಇತರ ಸರ್ಕಾರಿ ಭೂಮಿ"],
    ]) },
  { key: "dept", header: "Controlling department", en: "Controlling department", kn: "ನಿಯಂತ್ರಣ ಇಲಾಖೆ", group: "what", required: true, type: "select",
    options: opt([
      ["Karnataka Forest Department", "ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ"],
      ["Revenue Department", "ಕಂದಾಯ ಇಲಾಖೆ"],
      ["Zilla Panchayat", "ಜಿಲ್ಲಾ ಪಂಚಾಯಿತಿ"],
      ["Taluk Panchayat", "ತಾಲ್ಲೂಕು ಪಂಚಾಯಿತಿ"],
      ["Gram Panchayat", "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ"],
      ["Public Works Department", "ಲೋಕೋಪಯೋಗಿ ಇಲಾಖೆ"],
      ["Minor Irrigation Department", "ಸಣ್ಣ ನೀರಾವರಿ ಇಲಾಖೆ"],
      ["Education Department", "ಶಿಕ್ಷಣ ಇಲಾಖೆ"],
      ["Other", "ಇತರೆ"],
    ]) },
  { key: "rtc", header: "RTC extent (ha)", en: "RTC extent (ha)", kn: "ಆರ್‌ಟಿಸಿ ವಿಸ್ತೀರ್ಣ (ಹೆ.)", group: "what", required: true, type: "number" },
  { key: "offered", header: "Area offered for planting (ha)", en: "Area offered for planting (ha)", kn: "ನೆಡಲು ನೀಡಿದ ವಿಸ್ತೀರ್ಣ (ಹೆ.)", group: "what", required: true, type: "number" },

  { key: "lat", header: "Latitude (decimal)", en: "Latitude", kn: "ಅಕ್ಷಾಂಶ", group: "point", required: true, type: "coord",
    hint: { en: "Decimal degrees, e.g. 14.20140. Press and hold the site in Google Maps to read it.",
            kn: "ದಶಮಾಂಶ ಡಿಗ್ರಿ, ಉದಾ. 14.20140. ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಸ್ಥಳವನ್ನು ಒತ್ತಿ ಹಿಡಿದರೆ ಕಾಣಿಸುತ್ತದೆ." } },
  { key: "lng", header: "Longitude (decimal)", en: "Longitude", kn: "ರೇಖಾಂಶ", group: "point", required: true, type: "coord",
    hint: { en: "Decimal degrees, e.g. 76.40210.", kn: "ದಶಮಾಂಶ ಡಿಗ್ರಿ, ಉದಾ. 76.40210." } },

  { key: "terrain", header: "Terrain", en: "Terrain", kn: "ಭೂಸ್ವರೂಪ", group: "site", required: true, type: "select",
    options: opt([["Flat", "ಸಮತಟ್ಟು"], ["Gently undulating", "ಸ್ವಲ್ಪ ಏರಿಳಿತ"], ["Undulating", "ಏರಿಳಿತ"], ["Steep / hilly", "ಕಡಿದಾದ / ಗುಡ್ಡ"], ["Rocky", "ಕಲ್ಲುಬಂಡೆ"]]) },
  { key: "vegetation", header: "Existing vegetation", en: "Existing vegetation", kn: "ಈಗಿರುವ ಸಸ್ಯವರ್ಗ", group: "site", required: true, type: "select",
    options: opt([
      ["Bare - no vegetation", "ಬರಿ ನೆಲ"],
      ["Grass / weed cover only", "ಹುಲ್ಲು / ಕಳೆ ಮಾತ್ರ"],
      ["Scattered scrub", "ಚದುರಿದ ಪೊದೆ"],
      ["Dense scrub", "ದಟ್ಟ ಪೊದೆ"],
      ["Existing tree cover present", "ಈಗಾಗಲೇ ಮರಗಳಿವೆ"],
    ]) },
  { key: "water", header: "Water availability", en: "Water availability", kn: "ನೀರಿನ ಲಭ್ಯತೆ", group: "site", required: true, type: "select",
    options: opt([
      ["Perennial source within 500 m", "500 ಮೀ ಒಳಗೆ ವರ್ಷಪೂರ್ತಿ ಮೂಲ"],
      ["Seasonal source within 500 m", "500 ಮೀ ಒಳಗೆ ಋತುಮಾನದ ಮೂಲ"],
      ["Source 500 m to 2 km", "500 ಮೀ ರಿಂದ 2 ಕಿಮೀ"],
      ["No source within 2 km", "2 ಕಿಮೀ ಒಳಗೆ ಮೂಲವಿಲ್ಲ"],
      ["Piped / tanker supply arranged", "ಪೈಪ್ / ಟ್ಯಾಂಕರ್ ವ್ಯವಸ್ಥೆ"],
    ]) },
  { key: "access", header: "Access", en: "Access", kn: "ತಲುಪುವ ದಾರಿ", group: "site", required: true, type: "select",
    options: opt([
      ["Motorable road up to site", "ಸ್ಥಳದವರೆಗೆ ವಾಹನ ರಸ್ತೆ"],
      ["Motorable within 500 m", "500 ಮೀ ಒಳಗೆ ವಾಹನ ರಸ್ತೆ"],
      ["Cart track only", "ಗಾಡಿ ದಾರಿ ಮಾತ್ರ"],
      ["Foot access only", "ಕಾಲ್ನಡಿಗೆ ಮಾತ್ರ"],
    ]) },
  { key: "soil", header: "Soil type", en: "Soil type", kn: "ಮಣ್ಣಿನ ಬಗೆ", group: "site", required: false, type: "text" },

  { key: "encroach", header: "Encroachment present", en: "Encroachment present", kn: "ಒತ್ತುವರಿ ಇದೆಯೇ", group: "enc", required: true, type: "select",
    options: opt([["Yes", "ಹೌದು"], ["No", "ಇಲ್ಲ"], ["Not known", "ತಿಳಿದಿಲ್ಲ"]]) },
  { key: "dispute", header: "Boundary dispute", en: "Boundary dispute", kn: "ಗಡಿ ವಿವಾದ", group: "enc", required: true, type: "select",
    options: opt([["Yes", "ಹೌದು"], ["No", "ಇಲ್ಲ"], ["Not known", "ತಿಳಿದಿಲ್ಲ"]]) },
  { key: "grazing", header: "Grazing pressure", en: "Grazing pressure", kn: "ಮೇಯಿಸುವ ಒತ್ತಡ", group: "enc", required: false, type: "select",
    options: opt([["Yes", "ಹೌದು"], ["No", "ಇಲ್ಲ"], ["Not known", "ತಿಳಿದಿಲ್ಲ"]]) },
  { key: "protection", header: "Protection status", en: "Protection status", kn: "ರಕ್ಷಣೆ ಸ್ಥಿತಿ", group: "enc", required: false, type: "select",
    options: opt([
      ["Fenced - intact", "ಬೇಲಿ - ಸುಸ್ಥಿತಿ"],
      ["Fenced - damaged", "ಬೇಲಿ - ಹಾಳಾಗಿದೆ"],
      ["Not fenced", "ಬೇಲಿ ಇಲ್ಲ"],
      ["Natural boundary (bund, canal, rock)", "ನೈಸರ್ಗಿಕ ಗಡಿ"],
    ]) },

  { key: "season", header: "Proposed planting season", en: "Proposed planting season", kn: "ಪ್ರಸ್ತಾವಿತ ನೆಡುವ ಋತು", group: "fit", required: true, type: "select",
    options: opt([["Monsoon 2027", "ಮಳೆಗಾಲ 2027"], ["Monsoon 2028", "ಮಳೆಗಾಲ 2028"], ["Monsoon 2029", "ಮಳೆಗಾಲ 2029"], ["Monsoon 2030", "ಮಳೆಗಾಲ 2030"], ["Later", "ನಂತರ"]]) },
  { key: "custodian", header: "Proposed custodian body", en: "Proposed custodian body", kn: "ಪ್ರಸ್ತಾವಿತ ಪಾಲಕ ಸಂಸ್ಥೆ", group: "fit", required: true, type: "text",
    hint: { en: "Who maintains the site after planting. No custodian, no planting approval.",
            kn: "ನೆಟ್ಟ ನಂತರ ಸ್ಥಳವನ್ನು ನಿರ್ವಹಿಸುವವರು. ಪಾಲಕರಿಲ್ಲದೆ ಅನುಮೋದನೆ ಇಲ್ಲ." } },
  { key: "accepted", header: "Custodian accepted (Yes/No)", en: "Custodian has accepted", kn: "ಪಾಲಕರು ಒಪ್ಪಿದ್ದಾರೆಯೇ", group: "fit", required: true, type: "select",
    options: opt([["Yes", "ಹೌದು"], ["No", "ಇಲ್ಲ"], ["Not known", "ತಿಳಿದಿಲ್ಲ"]]) },

  { key: "officer", header: "Contact officer name", en: "Contact officer name", kn: "ಸಂಪರ್ಕ ಅಧಿಕಾರಿ ಹೆಸರು", group: "contact", required: true, type: "text" },
  { key: "designation", header: "Contact designation", en: "Designation", kn: "ಹುದ್ದೆ", group: "contact", required: true, type: "text" },
  { key: "mobile", header: "Contact mobile", en: "Mobile", kn: "ಮೊಬೈಲ್", group: "contact", required: true, type: "text" },
  { key: "remarks", header: "Remarks", en: "Remarks", kn: "ಟಿಪ್ಪಣಿ", group: "contact", required: false, type: "text" },
];


/**
 * Administrative hierarchy backing the district and taluk suggestion lists.
 * In production this is reference data (Layer 5), loaded from the state master
 * rather than held in the client. Here it exists so the form can demonstrate
 * dependent selection. Suggestions never block an entry: a taluk that is not
 * listed can still be typed, so a newly formed taluk is never a dead end.
 */
export const DISTRICT_TALUKS: Record<string, string[]> = {
  "Bagalkote": ["Bagalkote", "Badami", "Bilagi", "Hungund", "Jamkhandi", "Mudhol", "Rabkavi Banhatti", "Guledgudda", "Ilkal"],
  "Ballari": ["Ballari", "Sandur", "Siruguppa", "Kurugodu", "Kampli"],
  "Belagavi": ["Belagavi", "Bailhongal", "Savadatti", "Ramdurg", "Gokak", "Hukkeri", "Chikkodi", "Athani", "Raibag", "Khanapur", "Kagwad", "Mudalgi", "Nippani", "Yaragatti"],
  "Bengaluru Rural": ["Devanahalli", "Doddaballapura", "Hoskote", "Nelamangala"],
  "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka", "Kengeri"],
  "Bidar": ["Bidar", "Basavakalyan", "Bhalki", "Humnabad", "Aurad", "Chitguppa", "Hulsoor", "Kamalanagar"],
  "Chamarajanagar": ["Chamarajanagar", "Gundlupet", "Kollegal", "Yelandur", "Hanur"],
  "Chikkaballapur": ["Chikkaballapur", "Bagepalli", "Chintamani", "Gauribidanur", "Gudibanda", "Sidlaghatta", "Manchenahalli", "Cheluru"],
  "Chikkamagaluru": ["Chikkamagaluru", "Kadur", "Tarikere", "Mudigere", "Sringeri", "Koppa", "Narasimharajapura", "Ajjampura", "Kalasa"],
  "Chitradurga": ["Chitradurga", "Challakere", "Hiriyur", "Holalkere", "Hosadurga", "Molakalmuru"],
  "Dakshina Kannada": ["Mangaluru", "Bantwal", "Belthangady", "Puttur", "Sullia", "Moodabidri", "Kadaba", "Ullal"],
  "Davanagere": ["Davanagere", "Harihara", "Honnali", "Channagiri", "Jagalur", "Nyamati"],
  "Dharwad": ["Dharwad", "Hubballi", "Kalghatgi", "Kundgol", "Navalgund", "Alnavar", "Annigeri"],
  "Gadag": ["Gadag", "Ron", "Nargund", "Shirhatti", "Mundargi", "Gajendragad", "Lakshmeshwar"],
  "Hassan": ["Hassan", "Arsikere", "Channarayapatna", "Belur", "Sakleshpur", "Alur", "Holenarasipura", "Arakalgud"],
  "Haveri": ["Haveri", "Byadgi", "Hangal", "Hirekerur", "Ranebennur", "Savanur", "Shiggaon", "Rattihalli"],
  "Kalaburagi": ["Kalaburagi", "Afzalpur", "Aland", "Chittapur", "Chincholi", "Jevargi", "Sedam", "Kamalapur", "Yadrami", "Shahabad"],
  "Kodagu": ["Madikeri", "Somwarpet", "Virajpet", "Ponnampet", "Kushalnagar"],
  "Kolar": ["Kolar", "Bangarapet", "Malur", "Mulbagal", "Srinivaspur", "K.G.F."],
  "Koppal": ["Koppal", "Gangavathi", "Kushtagi", "Yelburga", "Kanakagiri", "Karatagi"],
  "Mandya": ["Mandya", "Maddur", "Malavalli", "Krishnarajpet", "Nagamangala", "Pandavapura", "Srirangapatna"],
  "Mysuru": ["Mysuru", "Hunsur", "Nanjangud", "H.D. Kote", "Periyapatna", "K.R. Nagar", "T. Narasipura", "Saragur"],
  "Raichur": ["Raichur", "Manvi", "Devadurga", "Sindhanur", "Lingsugur", "Maski", "Sirwar"],
  "Ramanagara": ["Ramanagara", "Channapatna", "Kanakapura", "Magadi", "Harohalli"],
  "Shivamogga": ["Shivamogga", "Bhadravathi", "Sagara", "Shikaripura", "Sorab", "Thirthahalli", "Hosanagara"],
  "Tumakuru": ["Tumakuru", "Sira", "Pavagada", "Madhugiri", "Koratagere", "Kunigal", "Tiptur", "Turuvekere", "Chikkanayakanahalli", "Gubbi"],
  "Udupi": ["Udupi", "Kundapura", "Karkala", "Byndoor", "Kaup", "Hebri", "Brahmavara"],
  "Uttara Kannada": ["Karwar", "Sirsi", "Kumta", "Bhatkal", "Honnavar", "Ankola", "Yellapur", "Mundgod", "Haliyal", "Joida", "Siddapur", "Dandeli"],
  "Vijayanagara": ["Hosapete", "Hagaribommanahalli", "Kottur", "Kudligi", "Harapanahalli", "Hoovina Hadagali"],
  "Vijayapura": ["Vijayapura", "Indi", "Sindagi", "Basavana Bagevadi", "Muddebihal", "Devara Hipparagi", "Chadachan", "Talikote", "Nidagundi", "Kolhar", "Tikota", "Babaleshwar", "Almel"],
  "Yadgir": ["Yadgir", "Shahapur", "Surpur", "Gurmitkal", "Hunasagi", "Vadagera", "Kembhavi"],
};

/**
 * Hobli lists, keyed "District|Taluk". Only the taluks used in the demonstration
 * are populated, and those entries are real. The rest are left empty rather than
 * invented — a wrong hobli in front of the officer who works there is worse than
 * no list. The field reads from this map exactly as taluk reads from
 * DISTRICT_TALUKS, so filling it from the state administrative master is a data
 * change, not a code change. Where a taluk has no entry the field accepts free text.
 */
export const TALUK_HOBLIS: Record<string, string[]> = {
  "Chitradurga|Hosadurga": ["Janakal"],
  "Chitradurga|Challakere": ["Parashurampura"],
  "Tumakuru|Sira": ["Kallambella"],
  "Belagavi|Savadatti": ["Kitada"],
};

export type Submitter = {
  key: string;
  en: string;
  kn: string;
  deptEn: string;
  deptKn: string;
  level: "taluk" | "district" | "state";
  district?: string;
  taluk?: string;
};

/**
 * Who may record a land offer. These are departmental officers under entry
 * point E1 — not the verification cadre and not command levels, who never
 * originate a parcel. The submitter's posting fixes the geographic scope of
 * anything they submit: §9 applied to intake.
 */
export const SUBMITTERS: Submitter[] = [
  { key: "dcf-ctd", en: "Deputy Conservator of Forests, Chitradurga", kn: "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಚಿತ್ರದುರ್ಗ",
    deptEn: "Karnataka Forest Department", deptKn: "ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ", level: "district", district: "Chitradurga" },
  { key: "tah-hsd", en: "Tahsildar, Hosadurga", kn: "ತಹಸೀಲ್ದಾರ್, ಹೊಸದುರ್ಗ",
    deptEn: "Revenue Department", deptKn: "ಕಂದಾಯ ಇಲಾಖೆ", level: "taluk", district: "Chitradurga", taluk: "Hosadurga" },
  { key: "eo-sira", en: "Executive Officer, Taluk Panchayat, Sira", kn: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ, ತಾಲ್ಲೂಕು ಪಂಚಾಯಿತಿ, ಸಿರಾ",
    deptEn: "Taluk Panchayat", deptKn: "ತಾಲ್ಲೂಕು ಪಂಚಾಯಿತಿ", level: "taluk", district: "Tumakuru", taluk: "Sira" },
  { key: "dcf-blg", en: "Deputy Conservator of Forests, Belagavi", kn: "ಉಪ ಅರಣ್ಯ ಸಂರಕ್ಷಣಾಧಿಕಾರಿ, ಬೆಳಗಾವಿ",
    deptEn: "Karnataka Forest Department", deptKn: "ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ", level: "district", district: "Belagavi" },
  { key: "nodal", en: "Nodal Officer, KSLSA", kn: "ನೋಡಲ್ ಅಧಿಕಾರಿ, ಕೆಎಸ್‌ಎಲ್‌ಎಸ್‌ಎ",
    deptEn: "Programme office", deptKn: "ಕಾರ್ಯಕ್ರಮ ಕಚೇರಿ", level: "state" },
];

export function scopeLabel(s: Submitter, lang: Lang): string {
  const en = lang === "en";
  if (s.level === "state") return en ? "May submit for any district" : "ಯಾವುದೇ ಜಿಲ್ಲೆಗೆ ಸಲ್ಲಿಸಬಹುದು";
  if (s.level === "district")
    return en ? `May submit within ${s.district} only` : `${s.district} ಜಿಲ್ಲೆಯೊಳಗೆ ಮಾತ್ರ ಸಲ್ಲಿಸಬಹುದು`;
  return en ? `May submit within ${s.taluk} taluk only` : `${s.taluk} ತಾಲ್ಲೂಕಿನೊಳಗೆ ಮಾತ್ರ ಸಲ್ಲಿಸಬಹುದು`;
}

/** Rows outside the submitter's posting are rejected, not silently retagged. */
export function scopeErrors(row: Row, s: Submitter, lang: Lang): Issue[] {
  const out: Issue[] = [];
  const eq = (a?: string, b?: string) => (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
  if (s.level !== "state" && row.district && !eq(row.district, s.district))
    out.push({ field: "district", en: `Outside your posting — you may submit for ${s.district} only`,
               kn: `ನಿಮ್ಮ ವ್ಯಾಪ್ತಿಯ ಹೊರಗೆ — ${s.district} ಜಿಲ್ಲೆಗೆ ಮಾತ್ರ ಸಲ್ಲಿಸಬಹುದು` });
  if (s.level === "taluk" && row.taluk && !eq(row.taluk, s.taluk))
    out.push({ field: "taluk", en: `Outside your posting — you may submit for ${s.taluk} taluk only`,
               kn: `ನಿಮ್ಮ ವ್ಯಾಪ್ತಿಯ ಹೊರಗೆ — ${s.taluk} ತಾಲ್ಲೂಕಿಗೆ ಮಾತ್ರ ಸಲ್ಲಿಸಬಹುದು` });
  return out;
}

export function hoblisFor(district: string, taluk: string): string[] {
  return TALUK_HOBLIS[`${(district ?? "").trim()}|${(taluk ?? "").trim()}`] ?? [];
}

export const DISTRICTS = Object.keys(DISTRICT_TALUKS).sort();

export function taluksFor(district: string): string[] {
  const d = DISTRICTS.find((x) => x.toLowerCase() === (district ?? "").trim().toLowerCase());
  return d ? DISTRICT_TALUKS[d] : [];
}

export const HEADERS = FIELDS.map((f) => f.header);

export type Row = Record<string, string>;
export type Issue = { field: string; en: string; kn: string };
export type Verdict = { row: number; data: Row; errors: Issue[]; flags: Issue[] };

const LAT = [11.5, 18.5];
const LNG = [74.0, 78.6];
const num = (v: string) => (v?.trim() ? Number(v.replace(/,/g, "")) : NaN);

export function validate(rows: Row[]): Verdict[] {
  const seen = new Map<string, number>();

  return rows.map((data, i) => {
    const errors: Issue[] = [];
    const flags: Issue[] = [];
    const E = (field: string, en: string, kn: string) => errors.push({ field, en, kn });
    const F = (field: string, en: string, kn: string) => flags.push({ field, en, kn });

    for (const f of FIELDS) {
      const v = (data[f.key] ?? "").trim();
      if (f.required && !v) {
        E(f.key, `${f.en} is required`, `${f.kn} ಅಗತ್ಯ`);
        continue;
      }
      if (v && f.type === "select" && f.options && !f.options.some((o) => o.en === v)) {
        E(f.key, `"${v}" is not an accepted value for ${f.en}`, `${f.kn} — "${v}" ಸ್ವೀಕೃತ ಆಯ್ಕೆಯಲ್ಲ`);
      }
    }

    const rtc = num(data.rtc), off = num(data.offered);
    if (data.rtc && (isNaN(rtc) || rtc <= 0))
      E("rtc", "RTC extent must be a number greater than zero", "ಆರ್‌ಟಿಸಿ ವಿಸ್ತೀರ್ಣ ಶೂನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು");
    if (data.offered && (isNaN(off) || off <= 0))
      E("offered", "Area offered must be a number greater than zero", "ನೀಡಿದ ವಿಸ್ತೀರ್ಣ ಶೂನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು");
    if (!isNaN(rtc) && !isNaN(off) && off > rtc)
      E("offered", "Area offered is larger than the RTC extent", "ನೀಡಿದ ವಿಸ್ತೀರ್ಣ ಆರ್‌ಟಿಸಿ ವಿಸ್ತೀರ್ಣಕ್ಕಿಂತ ಹೆಚ್ಚಿದೆ");
    if (!isNaN(off) && off > 0 && off < 0.5)
      F("offered", "Under 0.5 ha — below the floor for satellite corroboration; assured by ground evidence alone",
        "0.5 ಹೆ.ಗಿಂತ ಕಡಿಮೆ — ಉಪಗ್ರಹ ಪರಿಶೀಲನೆಗೆ ಸಾಲದು; ನೆಲದ ಸಾಕ್ಷ್ಯದಿಂದ ಮಾತ್ರ ಖಾತ್ರಿ");

    const lat = num(data.lat), lng = num(data.lng);
    const latOk = lat >= LAT[0] && lat <= LAT[1];
    const lngOk = lng >= LNG[0] && lng <= LNG[1];
    const swapped = !latOk && !lngOk && lng >= LAT[0] && lng <= LAT[1] && lat >= LNG[0] && lat <= LNG[1];
    if (swapped) {
      E("lat", "Latitude and longitude look swapped — try exchanging them",
        "ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ ಅದಲುಬದಲಾಗಿವೆ ಎಂದು ಕಾಣುತ್ತದೆ — ಬದಲಿಸಿ ನೋಡಿ");
    } else {
      if (data.lat && !latOk)
        E("lat", `Latitude ${data.lat} is outside Karnataka (${LAT[0]} to ${LAT[1]})`,
          `ಅಕ್ಷಾಂಶ ${data.lat} ಕರ್ನಾಟಕದ ಹೊರಗಿದೆ (${LAT[0]} – ${LAT[1]})`);
      if (data.lng && !lngOk)
        E("lng", `Longitude ${data.lng} is outside Karnataka (${LNG[0]} to ${LNG[1]})`,
          `ರೇಖಾಂಶ ${data.lng} ಕರ್ನಾಟಕದ ಹೊರಗಿದೆ (${LNG[0]} – ${LNG[1]})`);
    }

    const known = taluksFor(data.district ?? "");
    if (data.taluk && known.length > 0 &&
        !known.some((t) => t.toLowerCase() === data.taluk.trim().toLowerCase()))
      E("taluk", `${data.taluk} is not a taluk of ${data.district}`,
        `${data.taluk} ${data.district} ಜಿಲ್ಲೆಯ ತಾಲ್ಲೂಕು ಅಲ್ಲ`);

    if (data.mobile && !/^\d{10}$/.test(data.mobile.replace(/\s|-/g, "")))
      E("mobile", "Mobile must be ten digits", "ಮೊಬೈಲ್ ಹತ್ತು ಅಂಕಿಗಳಾಗಿರಬೇಕು");

    const key = [data.survey, data.village, data.taluk].map((x) => (x ?? "").trim().toLowerCase()).join("|");
    if (data.survey && data.village && data.taluk) {
      const prev = seen.get(key);
      if (prev !== undefined)
        E("survey", `Same survey number, village and taluk as row ${prev}`,
          `ಸಾಲು ${prev} ರಂತೆಯೇ ಸರ್ವೆ ಸಂಖ್ಯೆ, ಗ್ರಾಮ ಮತ್ತು ತಾಲ್ಲೂಕು`);
      else seen.set(key, i + 1);
    }

    if (data.vegetation === "Existing tree cover present")
      F("vegetation", "Existing tree cover — likely rejection; desk review before a visit is scheduled",
        "ಈಗಾಗಲೇ ಮರಗಳಿವೆ — ತಿರಸ್ಕೃತವಾಗುವ ಸಾಧ್ಯತೆ; ಭೇಟಿಗೂ ಮೊದಲು ಪರಿಶೀಲನೆ");
    if (data.water === "No source within 2 km")
      F("water", "No water source within 2 km — survival risk in years one to three",
        "2 ಕಿಮೀ ಒಳಗೆ ನೀರಿಲ್ಲ — ಮೊದಲ ಮೂರು ವರ್ಷ ಉಳಿವಿಗೆ ಅಪಾಯ");
    if (data.access === "Foot access only")
      F("access", "Foot access only — raises the cost of every later visit",
        "ಕಾಲ್ನಡಿಗೆ ಮಾತ್ರ — ಮುಂದಿನ ಪ್ರತಿ ಭೇಟಿಯ ವೆಚ್ಚ ಹೆಚ್ಚು");
    if (data.encroach === "Yes" || data.encroach === "Not known")
      F("encroach", "Encroachment declared or unknown — a rejection reason under §6.3",
        "ಒತ್ತುವರಿ ಇದೆ ಅಥವಾ ತಿಳಿದಿಲ್ಲ — ತಿರಸ್ಕಾರದ ಕಾರಣ");
    if (data.dispute === "Yes" || data.dispute === "Not known")
      F("dispute", "Boundary dispute declared or unknown — a rejection reason under §6.3",
        "ಗಡಿ ವಿವಾದ ಇದೆ ಅಥವಾ ತಿಳಿದಿಲ್ಲ — ತಿರಸ್ಕಾರದ ಕಾರಣ");

    return { row: i + 1, data, errors, flags };
  });
}

/** Parses CSV or tab-separated text pasted straight out of a spreadsheet. */
export function parseTable(text: string): { headers: string[]; rows: Row[]; unknown: string[]; missing: string[] } {
  const clean = text.replace(/\r\n?/g, "\n").trim();
  if (!clean) return { headers: [], rows: [], unknown: [], missing: HEADERS };
  const delim = clean.split("\n")[0].includes("\t") ? "\t" : ",";

  const splitLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
      } else if (ch === delim && !q) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const lines = clean.split("\n").filter((l) => l.trim().length);
  const headers = splitLine(lines[0]);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const idx = new Map(headers.map((h, i) => [norm(h), i]));

  const missing = FIELDS.filter((f) => f.required && !idx.has(norm(f.header))).map((f) => f.header);
  const known = new Set(HEADERS.map(norm).concat(["platformlocationid", "platformstatus"]));
  const unknown = headers.filter((h) => h && !known.has(norm(h)));

  const rows: Row[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitLine(line);
    if (cells.every((c) => !c)) continue;
    const r: Row = {};
    for (const f of FIELDS) {
      const i = idx.get(norm(f.header));
      r[f.key] = i === undefined ? "" : (cells[i] ?? "");
    }
    if (Object.values(r).every((v) => !v)) continue;
    rows.push(r);
  }
  return { headers, rows, unknown, missing };
}

export const T = {
  title: { en: "Land intake", kn: "ಭೂಮಿ ಸ್ವೀಕೃತಿ" },
  lede: {
    en: "Departments offer land here. Nothing on these screens approves anything — every accepted parcel enters the verification queue, and a Range Forest Officer must visit the site before it can be planted.",
    kn: "ಇಲಾಖೆಗಳು ಇಲ್ಲಿ ಭೂಮಿಯನ್ನು ನೀಡುತ್ತವೆ. ಈ ಪರದೆಗಳಲ್ಲಿ ಯಾವುದೂ ಅನುಮೋದನೆ ನೀಡುವುದಿಲ್ಲ — ಸ್ವೀಕೃತ ಪ್ರತಿ ಜಮೀನೂ ಪರಿಶೀಲನಾ ಸರತಿಗೆ ಸೇರುತ್ತದೆ, ಆರ್‌ಎಫ್‌ಒ ಸ್ಥಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿದ ನಂತರವೇ ನೆಡಬಹುದು.",
  },
  navAdd: { en: "Add a parcel", kn: "ಜಮೀನು ಸೇರಿಸಿ" },
  navUpload: { en: "Upload a sheet", kn: "ಶೀಟ್ ಅಪ್‌ಲೋಡ್" },
  navTemplate: { en: "Template", kn: "ನಮೂನೆ" },
  required: { en: "required", kn: "ಅಗತ್ಯ" },
  optional: { en: "optional", kn: "ಐಚ್ಛಿಕ" },
  submit: { en: "Submit for verification", kn: "ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ" },
  clear: { en: "Clear form", kn: "ನಮೂನೆ ತೆರವು" },
  fixFirst: { en: "Fix the errors above before submitting.", kn: "ಸಲ್ಲಿಸುವ ಮೊದಲು ಮೇಲಿನ ದೋಷಗಳನ್ನು ಸರಿಪಡಿಸಿ." },
  accepted: { en: "Submitted. It now sits in the verification queue.", kn: "ಸಲ್ಲಿಕೆಯಾಗಿದೆ. ಈಗ ಪರಿಶೀಲನಾ ಸರತಿಯಲ್ಲಿದೆ." },
  choose: { en: "Choose", kn: "ಆಯ್ಕೆಮಾಡಿ" },
  paste: { en: "Paste from a spreadsheet", kn: "ಸ್ಪ್ರೆಡ್‌ಶೀಟ್‌ನಿಂದ ಅಂಟಿಸಿ" },
  pasteHint: {
    en: "Select the rows in your Google Sheet including the header row, copy, and paste here. Or choose a CSV file below.",
    kn: "ನಿಮ್ಮ ಗೂಗಲ್ ಶೀಟ್‌ನಲ್ಲಿ ಶೀರ್ಷಿಕೆ ಸಾಲು ಸೇರಿಸಿ ಸಾಲುಗಳನ್ನು ಆರಿಸಿ, ನಕಲಿಸಿ, ಇಲ್ಲಿ ಅಂಟಿಸಿ. ಅಥವಾ ಕೆಳಗೆ ಸಿಎಸ್‌ವಿ ಫೈಲ್ ಆರಿಸಿ.",
  },
  orFile: { en: "or choose a CSV file", kn: "ಅಥವಾ ಸಿಎಸ್‌ವಿ ಫೈಲ್ ಆರಿಸಿ" },
  check: { en: "Check the sheet", kn: "ಶೀಟ್ ಪರಿಶೀಲಿಸಿ" },
  reset: { en: "Start again", kn: "ಮತ್ತೆ ಆರಂಭಿಸಿ" },
  headerProblem: { en: "The header row does not match the template", kn: "ಶೀರ್ಷಿಕೆ ಸಾಲು ನಮೂನೆಗೆ ಹೊಂದುತ್ತಿಲ್ಲ" },
  missingCols: { en: "Missing required columns", kn: "ಕಾಣೆಯಾದ ಅಗತ್ಯ ಕಾಲಂಗಳು" },
  unknownCols: { en: "Columns not in the template (they will be ignored)", kn: "ನಮೂನೆಯಲ್ಲಿಲ್ಲದ ಕಾಲಂಗಳು (ನಿರ್ಲಕ್ಷಿಸಲಾಗುವುದು)" },
  rows: { en: "rows", kn: "ಸಾಲುಗಳು" },
  ok: { en: "will be accepted", kn: "ಸ್ವೀಕೃತವಾಗುತ್ತವೆ" },
  rejected: { en: "rejected", kn: "ತಿರಸ್ಕೃತ" },
  flagged: { en: "accepted with a flag", kn: "ಗುರುತಿನೊಂದಿಗೆ ಸ್ವೀಕೃತ" },
  commit: { en: "Submit the accepted rows", kn: "ಸ್ವೀಕೃತ ಸಾಲುಗಳನ್ನು ಸಲ್ಲಿಸಿ" },
  downloadErrors: { en: "Download the rejected rows with reasons", kn: "ಕಾರಣಗಳೊಂದಿಗೆ ತಿರಸ್ಕೃತ ಸಾಲುಗಳನ್ನು ಪಡೆಯಿರಿ" },
  committed: { en: "Submitted. Rejected rows were not imported — fix them and upload again.", kn: "ಸಲ್ಲಿಕೆಯಾಗಿದೆ. ತಿರಸ್ಕೃತ ಸಾಲುಗಳನ್ನು ತೆಗೆದುಕೊಂಡಿಲ್ಲ — ಸರಿಪಡಿಸಿ ಮತ್ತೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ." },
  allOrNothing: { en: "Only valid rows are imported. Nothing is imported partially and silently.", kn: "ಸರಿಯಾದ ಸಾಲುಗಳನ್ನು ಮಾತ್ರ ತೆಗೆದುಕೊಳ್ಳಲಾಗುತ್ತದೆ. ಮೌನವಾಗಿ ಭಾಗಶಃ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ." },
  row: { en: "Row", kn: "ಸಾಲು" },
  noRows: { en: "No rows found. Paste the header row along with the data.", kn: "ಸಾಲುಗಳು ಸಿಗಲಿಲ್ಲ. ಶೀರ್ಷಿಕೆ ಸಾಲಿನೊಂದಿಗೆ ದತ್ತಾಂಶವನ್ನು ಅಂಟಿಸಿ." },
  copyHeaders: { en: "Copy the header row", kn: "ಶೀರ್ಷಿಕೆ ಸಾಲನ್ನು ನಕಲಿಸಿ" },
  copied: { en: "Copied", kn: "ನಕಲಾಗಿದೆ" },
  sample: { en: "Load a sample sheet", kn: "ಮಾದರಿ ಶೀಟ್ ತುಂಬಿಸಿ" },
  pickHint: { en: "type or pick from the list", kn: "ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಪಟ್ಟಿಯಿಂದ ಆರಿಸಿ" },
  pickDistrictFirst: { en: "Choose a district first", kn: "ಮೊದಲು ಜಿಲ್ಲೆ ಆರಿಸಿ" },
  otherNotListed: { en: "Other — not in the list", kn: "ಇತರೆ — ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ" },
  typeTheName: { en: "Type the name", kn: "ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ" },
  fillExample: { en: "Fill with an example", kn: "ಉದಾಹರಣೆಯಿಂದ ತುಂಬಿಸಿ" },
  exampleNote: {
    en: "Example values, for trying the form. Change anything, or clear and start again.",
    kn: "ನಮೂನೆಯನ್ನು ಪ್ರಯತ್ನಿಸಲು ಉದಾಹರಣೆ ಮೌಲ್ಯಗಳು. ಯಾವುದನ್ನೂ ಬದಲಿಸಿ, ಅಥವಾ ತೆರವುಗೊಳಿಸಿ ಮತ್ತೆ ಆರಂಭಿಸಿ.",
  },
  submittingAs: { en: "Submitting as", kn: "ಸಲ್ಲಿಸುತ್ತಿರುವವರು" },
  fromPosting: { en: "from your posting", kn: "ನಿಮ್ಮ ವ್ಯಾಪ್ತಿಯಿಂದ" },
  downloadCsv: { en: "Download a blank sheet", kn: "ಖಾಲಿ ಶೀಟ್ ಪಡೆಯಿರಿ" },
  templateWhat: {
    en: "Two ways to start a district sheet: copy the header row straight into a Google Sheet, or download a blank CSV and open it with File → Import in Google Sheets. Either way the column names are what the platform matches on.",
    kn: "ಜಿಲ್ಲಾ ಶೀಟ್ ಆರಂಭಿಸಲು ಎರಡು ದಾರಿ: ಶೀರ್ಷಿಕೆ ಸಾಲನ್ನು ನೇರವಾಗಿ ಗೂಗಲ್ ಶೀಟ್‌ಗೆ ನಕಲಿಸಿ, ಅಥವಾ ಖಾಲಿ ಸಿಎಸ್‌ವಿ ಪಡೆದು ಗೂಗಲ್ ಶೀಟ್‌ನಲ್ಲಿ File → Import ಮೂಲಕ ತೆರೆಯಿರಿ. ಎರಡರಲ್ಲೂ ಕಾಲಂ ಹೆಸರುಗಳೇ ಹೊಂದಾಣಿಕೆಗೆ ಆಧಾರ.",
  },
} as const;

export function tr(k: keyof typeof T, lang: Lang) {
  return T[k][lang];
}

/** Prefills the single-parcel form so a reviewer can see a complete entry. */
export const EXAMPLE: Row = {
  hobli: "Janakal", village: "Banasihalli", survey: "142/3", subdiv: "P2",
  category: "Revenue wasteland (Bane/Banjar)", dept: "Karnataka Forest Department",
  rtc: "3.20", offered: "2.04", lat: "14.20140", lng: "76.40210",
  terrain: "Gently undulating", vegetation: "Grass / weed cover only",
  water: "Seasonal source within 500 m", access: "Motorable within 500 m",
  soil: "Red loamy", encroach: "No", dispute: "No", grazing: "Yes",
  protection: "Not fenced", season: "Monsoon 2027",
  custodian: "Gram Panchayat, Banasihalli", accepted: "No",
  officer: "S. Rangappa", designation: "RFO, Hosadurga", mobile: "9448000000",
  remarks: "Adjacent to school compound; borewell 300 m",
};

export const SAMPLE = [
  HEADERS.join("\t"),
  ["Chitradurga","Hosadurga","Janakal","Banasihalli","142/3","P2","Revenue wasteland (Bane/Banjar)","Karnataka Forest Department","3.20","2.04","14.20140","76.40210","Gently undulating","Grass / weed cover only","Seasonal source within 500 m","Motorable within 500 m","Red loamy","No","No","Yes","Not fenced","Monsoon 2027","Gram Panchayat, Banasihalli","No","S. Rangappa","RFO, Hosadurga","9448000000","Adjacent to school compound"].join("\t"),
  ["Chitradurga","Hosadurga","Janakal","Banasihalli","142/3","P2","Gomala / grazing land","Revenue Department","1.80","1.80","14.20150","76.40230","Flat","Scattered scrub","Source 500 m to 2 km","Cart track only","","No","No","Yes","Not fenced","Monsoon 2027","Gram Panchayat, Banasihalli","No","S. Rangappa","RFO, Hosadurga","9448000000","Second patch"].join("\t"),
  ["Chitradurga","Challakere","Parashurampura","Siddeswaranadurga","88/1","","Tank foreshore / bund","Minor Irrigation Department","5.60","6.20","76.51000","14.31000","Flat","Bare - no vegetation","Perennial source within 500 m","Motorable road up to site","Black cotton","Not known","No","No","Natural boundary (bund, canal, rock)","Monsoon 2027","Gram Panchayat, Siddeswaranadurga","No","K. Nagaraj","AEE, Minor Irrigation","98450","Tank bund stretch"].join("\t"),
  ["Tumakuru","Sira","Kallambella","Seebi Agrahara","47/2","","Forest land - degraded","Karnataka Forest Department","4.10","0.35","13.74200","76.90100","Undulating","Existing tree cover present","No source within 2 km","Foot access only","Red sandy","Yes","Not known","Yes","Not fenced","Monsoon 2028","","No","M. Latha","DRFO, Sira","9902000000","Steep upper slope"].join("\t"),
  ["Belagavi","Savadatti","Kitada","Akkisagara","210/4","A","Roadside / avenue strip","Public Works Department","2.40","2.40","15.79800","75.14200","Flat","Grass / weed cover only","Piped / tanker supply arranged","Motorable road up to site","","No","No","No","Not fenced","Monsoon 2027","PWD Sub-division, Savadatti","Yes","R. Patil","AE, PWD","9448111222","Both sides of the approach road"].join("\t"),
].join("\n");

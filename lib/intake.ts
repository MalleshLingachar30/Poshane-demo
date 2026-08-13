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
  navRegister: { en: "Offers received", kn: "ಬಂದ ಆಫರ್‌ಗಳು" },
  navRecord: { en: "Record a site visit", kn: "ಸ್ಥಳ ಭೇಟಿ ದಾಖಲಿಸಿ" },
  navVerifyReg: { en: "Verified parcel register", kn: "ಪರಿಶೀಲಿತ ಜಮೀನು ನೋಂದಣಿ" },
  navCompare: { en: "Compare and issue", kn: "ಹೋಲಿಸಿ ಮತ್ತು ನೀಡಿ" },
  asSubmitted: {
    en: "Exactly as the department submitted it. Nothing on this screen has been checked against the ground.",
    kn: "ಇಲಾಖೆ ಸಲ್ಲಿಸಿದಂತೆಯೇ. ಈ ಪರದೆಯಲ್ಲಿ ಯಾವುದನ್ನೂ ನೆಲದ ಮೇಲೆ ಪರಿಶೀಲಿಸಿಲ್ಲ.",
  },
  submittedBy: { en: "Submitted by", kn: "ಸಲ್ಲಿಸಿದವರು" },
  whichParcel: { en: "Which parcel did you visit", kn: "ಯಾವ ಜಮೀನಿಗೆ ಭೇಟಿ ನೀಡಿದಿರಿ" },
  assignedToYou: { en: "Assigned to you, not yet recorded", kn: "ನಿಮಗೆ ನಿಯೋಜಿತ, ಇನ್ನೂ ದಾಖಲಿಸಿಲ್ಲ" },
  declaredWas: { en: "The department declared", kn: "ಇಲಾಖೆ ತಿಳಿಸಿದ್ದು" },
  officerNotes: { en: "What you observed", kn: "ನೀವು ಗಮನಿಸಿದ್ದು" },
  siteSurvey: { en: "Site survey — for the species plan", kn: "ಸ್ಥಳ ಸಮೀಕ್ಷೆ — ಪ್ರಭೇದ ಯೋಜನೆಗಾಗಿ" },
  surveyNote: {
    en: "None of this can come from a department's form. It is why an officer has to stand on the ground before anything is planted.",
    kn: "ಇದಾವುದೂ ಇಲಾಖೆಯ ನಮೂನೆಯಿಂದ ಬರಲಾರದು. ನೆಡುವ ಮೊದಲು ಅಧಿಕಾರಿ ನೆಲದ ಮೇಲೆ ನಿಲ್ಲಬೇಕಾದ ಕಾರಣವೇ ಇದು.",
  },
  fldZone: { en: "Agro-climatic zone", kn: "ಕೃಷಿ-ಹವಾಮಾನ ವಲಯ" },
  fldSoil: { en: "Soil type", kn: "ಮಣ್ಣಿನ ಬಗೆ" },
  fldDepth: { en: "Soil depth", kn: "ಮಣ್ಣಿನ ಆಳ" },
  fldSlope: { en: "Slope", kn: "ಇಳಿಜಾರು" },
  fldDrainage: { en: "Drainage", kn: "ಬಸಿತ" },
  fldWaterDist: { en: "Nearest water source", kn: "ಹತ್ತಿರದ ನೀರಿನ ಮೂಲ" },
  fldAddress: { en: "Site address and landmark", kn: "ಸ್ಥಳದ ವಿಳಾಸ ಮತ್ತು ಗುರುತು" },
  fldAddressHint: {
    en: "How a nursery lorry or an audit officer finds this parcel.",
    kn: "ನರ್ಸರಿ ಲಾರಿ ಅಥವಾ ಲೆಕ್ಕಪರಿಶೋಧನಾ ಅಧಿಕಾರಿ ಈ ಜಮೀನನ್ನು ಹೇಗೆ ತಲುಪುತ್ತಾರೆ.",
  },
  fldLandType: { en: "Land type confirmed on site", kn: "ಸ್ಥಳದಲ್ಲಿ ದೃಢಪಟ್ಟ ಭೂಮಿಯ ಬಗೆ" },
  sitePlanTitle: { en: "Species plan proposed for this parcel", kn: "ಈ ಜಮೀನಿಗೆ ಪ್ರಸ್ತಾವಿತ ಪ್ರಭೇದ ಯೋಜನೆ" },
  sitePlanNote: {
    en: "Derived from the survey above, and advisory. The command centre proposes; the Forest Department's species master governs, and a human confirms before any dispatch.",
    kn: "ಮೇಲಿನ ಸಮೀಕ್ಷೆಯಿಂದ ಪಡೆದದ್ದು, ಸಲಹಾತ್ಮಕ ಮಾತ್ರ. ನಿಯಂತ್ರಣ ಕೇಂದ್ರ ಸೂಚಿಸುತ್ತದೆ; ಅರಣ್ಯ ಇಲಾಖೆಯ ಪ್ರಭೇದ ಪಟ್ಟಿಯೇ ಅಂತಿಮ, ಮತ್ತು ಕಳುಹಿಸುವ ಮೊದಲು ಮನುಷ್ಯ ದೃಢಪಡಿಸುತ್ತಾರೆ.",
  },
  planSpacing: { en: "Spacing", kn: "ಅಂತರ" },
  planPit: { en: "Pit size", kn: "ಗುಂಡಿ ಅಳತೆ" },
  planDensity: { en: "Saplings per hectare", kn: "ಪ್ರತಿ ಹೆಕ್ಟೇರಿಗೆ ಸಸಿಗಳು" },
  planTotal: { en: "Total for the walked area", kn: "ನಡೆದ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ಒಟ್ಟು" },
  planExcluded: { en: "Set aside", kn: "ಹೊರಗಿಟ್ಟದ್ದು" },
  planNoZone: { en: "Choose a zone and soil to see the proposed plan.", kn: "ಪ್ರಸ್ತಾವಿತ ಯೋಜನೆ ನೋಡಲು ವಲಯ ಮತ್ತು ಮಣ್ಣು ಆರಿಸಿ." },
  decision: { en: "Decision", kn: "ನಿರ್ಧಾರ" },
  saveVisit: { en: "Save the site visit", kn: "ಸ್ಥಳ ಭೇಟಿ ಉಳಿಸಿ" },
  visitSaved: { en: "Site visit recorded", kn: "ಸ್ಥಳ ಭೇಟಿ ದಾಖಲಾಗಿದೆ" },
  visitSavedNote: {
    en: "It now appears under Visits recorded, and the parcel moves to Compare and issue.",
    kn: "ಈಗ ಅದು ದಾಖಲಾದ ಭೇಟಿಗಳಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ, ಮತ್ತು ಜಮೀನು ಹೋಲಿಕೆ ಹಂತಕ್ಕೆ ಹೋಗುತ್ತದೆ.",
  },
  noIdHere: {
    en: "Recording a visit does not issue a Location ID. The two records are compared first.",
    kn: "ಭೇಟಿ ದಾಖಲಿಸಿದರೆ ಲೊಕೇಶನ್ ಐಡಿ ದೊರೆಯುವುದಿಲ್ಲ. ಮೊದಲು ಎರಡು ದಾಖಲೆಗಳನ್ನು ಹೋಲಿಸಲಾಗುತ್ತದೆ.",
  },
  visitsLede: {
    en: "What the verification cadre recorded on the ground. A separate record from the department's offer, entered by a different person.",
    kn: "ಪರಿಶೀಲನಾ ದಳ ನೆಲದ ಮೇಲೆ ದಾಖಲಿಸಿದ್ದು. ಇಲಾಖೆಯ ಆಫರ್‌ಗಿಂತ ಪ್ರತ್ಯೇಕ ದಾಖಲೆ, ಬೇರೆ ವ್ಯಕ್ತಿ ದಾಖಲಿಸಿದ್ದು.",
  },
  visits: { en: "visits", kn: "ಭೇಟಿಗಳು" },
  visitedOn: { en: "Visited", kn: "ಭೇಟಿ" },
  compareLede: {
    en: "The department's offer and the officer's record, side by side. Differences are marked. A Location ID is issued from here, and only where both records support it.",
    kn: "ಇಲಾಖೆಯ ಆಫರ್ ಮತ್ತು ಅಧಿಕಾರಿಯ ದಾಖಲೆ, ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ. ವ್ಯತ್ಯಾಸಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಇಲ್ಲಿಂದಲೇ ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗುತ್ತದೆ, ಎರಡೂ ದಾಖಲೆಗಳು ಒಪ್ಪಿದಾಗ ಮಾತ್ರ.",
  },
  awaitingVisit: { en: "No site visit recorded yet", kn: "ಇನ್ನೂ ಸ್ಥಳ ಭೇಟಿ ದಾಖಲಾಗಿಲ್ಲ" },
  differencesFound: { en: "differences", kn: "ವ್ಯತ್ಯಾಸಗಳು" },
  noDifference: { en: "matches the offer in every field", kn: "ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಆಫರ್‌ಗೆ ಹೊಂದುತ್ತದೆ" },
  issueId: { en: "Issue the Location ID", kn: "ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಿ" },
  cannotIssue: { en: "Cannot be issued — the officer did not accept this parcel", kn: "ನೀಡಲಾಗದು — ಅಧಿಕಾರಿ ಈ ಜಮೀನನ್ನು ಸ್ವೀಕರಿಸಿಲ್ಲ" },
  readyToIssue: { en: "Ready to issue", kn: "ನೀಡಲು ಸಿದ್ಧ" },
  thisSession: { en: "Recorded in this session", kn: "ಈ ಅವಧಿಯಲ್ಲಿ ದಾಖಲಾದವು" },
  justRecorded: { en: "just recorded", kn: "ಈಗಷ್ಟೇ ದಾಖಲಾಗಿದೆ" },
  alreadyIssued: { en: "Issued", kn: "ನೀಡಲಾಗಿದೆ" },
  noIdYet: {
    en: "No Location ID. An offer carries only its offer reference until a verification officer has walked it.",
    kn: "ಲೊಕೇಶನ್ ಐಡಿ ಇಲ್ಲ. ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ ನಡೆಯುವವರೆಗೆ ಆಫರ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಮಾತ್ರ.",
  },
  grpIntake: { en: "Land intake", kn: "ಭೂಮಿ ಸ್ವೀಕೃತಿ" },
  stage1: { en: "Land intake", kn: "ಭೂಮಿ ಸ್ವೀಕೃತಿ" },
  stage2: { en: "Land verification", kn: "ಭೂಮಿ ಪರಿಶೀಲನೆ" },
  stage3: { en: "Species and nursery", kn: "ಪ್ರಭೇದ ಮತ್ತು ನರ್ಸರಿ" },
  stage4: { en: "Dispatch and planting", kn: "ಸಾಗಣೆ ಮತ್ತು ನೆಡುವಿಕೆ" },
  stage5: { en: "Census and audit", kn: "ಗಣತಿ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ" },
  hIntake: { en: "Land intake", kn: "ಭೂಮಿ ಸ್ವೀಕೃತಿ" },
  hVerify: { en: "Land verification", kn: "ಭೂಮಿ ಪರಿಶೀಲನೆ" },
  hCompare: { en: "Comparison and Location ID", kn: "ಹೋಲಿಕೆ ಮತ್ತು ಲೊಕೇಶನ್ ಐಡಿ" },
  ledeIntake: {
    en: "Departments offer land here. Nothing on these screens approves anything — an offer is a proposal, and it carries only an offer reference until an officer has stood on the ground.",
    kn: "ಇಲಾಖೆಗಳು ಇಲ್ಲಿ ಭೂಮಿಯನ್ನು ನೀಡುತ್ತವೆ. ಈ ಪರದೆಗಳಲ್ಲಿ ಯಾವುದೂ ಅನುಮೋದನೆ ನೀಡುವುದಿಲ್ಲ — ಆಫರ್ ಒಂದು ಪ್ರಸ್ತಾವನೆ, ಅಧಿಕಾರಿ ನೆಲದ ಮೇಲೆ ನಿಲ್ಲುವವರೆಗೆ ಆಫರ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಮಾತ್ರ.",
  },
  ledeVerify: {
    en: "A retired Range Forest Officer visits the site and records what is actually there. This is a separate survey, not a confirmation — it is what lets the command centre write a species plan for this particular piece of ground.",
    kn: "ನಿವೃತ್ತ ವಲಯ ಅರಣ್ಯಾಧಿಕಾರಿ ಸ್ಥಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ನಿಜವಾಗಿ ಏನಿದೆ ಎಂದು ದಾಖಲಿಸುತ್ತಾರೆ. ಇದು ಪ್ರತ್ಯೇಕ ಸಮೀಕ್ಷೆ, ಕೇವಲ ದೃಢೀಕರಣವಲ್ಲ — ಈ ನಿರ್ದಿಷ್ಟ ಜಮೀನಿಗೆ ಪ್ರಭೇದ ಯೋಜನೆ ರೂಪಿಸಲು ಇದೇ ಆಧಾರ.",
  },
  ledeCompare: {
    en: "The two records placed side by side. Differences are marked, and a Location ID is issued only where both support it.",
    kn: "ಎರಡು ದಾಖಲೆಗಳನ್ನು ಅಕ್ಕಪಕ್ಕ ಇರಿಸಲಾಗಿದೆ. ವ್ಯತ್ಯಾಸಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ, ಎರಡೂ ಒಪ್ಪಿದಾಗ ಮಾತ್ರ ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗುತ್ತದೆ.",
  },
  grpVerify: { en: "Land verification", kn: "ಭೂಮಿ ಪರಿಶೀಲನೆ" },
  grpPlans: { en: "Species and nursery", kn: "ಪ್ರಭೇದ ಮತ್ತು ನರ್ಸರಿ" },
  grpField: { en: "Dispatch and planting", kn: "ಸಾಗಣೆ ಮತ್ತು ನೆಡುವಿಕೆ" },
  grpCensus: { en: "Census and audit", kn: "ಗಣತಿ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ" },
  navCensus: { en: "Record a census", kn: "ಗಣತಿ ದಾಖಲಿಸಿ" },
  navAudit: { en: "Audit inspection", kn: "ಲೆಕ್ಕಪರಿಶೋಧನೆ" },
  hCensus: { en: "Survival census", kn: "ಉಳಿವಿನ ಗಣತಿ" },
  hAudit: { en: "Audit inspection", kn: "ಲೆಕ್ಕಪರಿಶೋಧನೆ" },
  ledeCensus: {
    en: "The count that decides whether the programme worked. Made on the ground by the implementing agency and co-signed by an officer of the audit cadre — survival is computed from the two counts, never entered.",
    kn: "ಕಾರ್ಯಕ್ರಮ ಫಲ ನೀಡಿತೇ ಎಂದು ನಿರ್ಧರಿಸುವ ಎಣಿಕೆ. ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ ನೆಲದ ಮೇಲೆ ಎಣಿಸಿ, ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಳದ ಅಧಿಕಾರಿ ಸಹಿ ಮಾಡುತ್ತಾರೆ — ಉಳಿವನ್ನು ಎರಡು ಎಣಿಕೆಗಳಿಂದ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ, ನಮೂದಿಸುವುದಿಲ್ಲ.",
  },
  ledeAudit: {
    en: "An officer of the audit cadre inspects the parcel independently. They may never audit a parcel whose boundary they walked — the rule is enforced against the parcel, not against the roster.",
    kn: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಳದ ಅಧಿಕಾರಿ ಜಮೀನನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ತಾವು ಗಡಿ ನಡೆದ ಜಮೀನನ್ನು ಎಂದಿಗೂ ಲೆಕ್ಕಪರಿಶೋಧಿಸಲಾರರು — ಈ ನಿಯಮ ನಾಮಪಟ್ಟಿಗಲ್ಲ, ಜಮೀನಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ.",
  },
  auditOfficer: { en: "Audit officer", kn: "ಲೆಕ್ಕಪರಿಶೋಧನಾ ಅಧಿಕಾರಿ" },
  cannotAudit: { en: "Cannot audit this parcel", kn: "ಈ ಜಮೀನನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸಲಾಗದು" },
  cannotAuditWhy: {
    en: "This officer walked the boundary of this parcel and issued its Location ID. Auditing it would be inspecting their own work. Another officer of the cadre must take it.",
    kn: "ಈ ಅಧಿಕಾರಿಯೇ ಈ ಜಮೀನಿನ ಗಡಿ ನಡೆದು ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಿದ್ದಾರೆ. ಇದನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸಿದರೆ ತಮ್ಮದೇ ಕೆಲಸವನ್ನು ತಪಾಸಣೆ ಮಾಡಿದಂತೆ. ದಳದ ಇನ್ನೊಬ್ಬ ಅಧಿಕಾರಿ ಇದನ್ನು ವಹಿಸಬೇಕು.",
  },
  alsoOnVerification: { en: "also serves on the verification cadre", kn: "ಪರಿಶೀಲನಾ ದಳದಲ್ಲೂ ಇದ್ದಾರೆ" },
  whichParcelCensus: { en: "Which parcel are you counting", kn: "ಯಾವ ಜಮೀನನ್ನು ಎಣಿಸುತ್ತಿದ್ದೀರಿ" },
  whichParcelAudit: { en: "Which parcel are you inspecting", kn: "ಯಾವ ಜಮೀನನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೀರಿ" },
  plantedCount: { en: "Planted", kn: "ನೆಟ್ಟದ್ದು" },
  survivingCount: { en: "Surviving", kn: "ಉಳಿದದ್ದು" },
  survivalComputed: { en: "Survival, computed", kn: "ಉಳಿವು, ಲೆಕ್ಕಹಾಕಿದ್ದು" },
  coSignedBy: { en: "Co-signed by", kn: "ಸಹಿ ಮಾಡಿದವರು" },
  saveCensus: { en: "Save the census", kn: "ಗಣತಿ ಉಳಿಸಿ" },
  censusSaved: { en: "Census recorded", kn: "ಗಣತಿ ದಾಖಲಾಗಿದೆ" },
  belowThresholdNow: {
    en: "Below the 75% threshold. A rectification has been raised against the implementing agency with a named owner and a deadline.",
    kn: "75% ಮಿತಿಗಿಂತ ಕಡಿಮೆ. ಹೊಣೆಗಾರ ಮತ್ತು ಗಡುವಿನೊಂದಿಗೆ ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆಯ ವಿರುದ್ಧ ಸರಿಪಡಿಸುವಿಕೆ ದಾಖಲಾಗಿದೆ.",
  },
  aboveThreshold: {
    en: "Above the threshold. The parcel stays under annual monitoring.",
    kn: "ಮಿತಿಗಿಂತ ಮೇಲೆ. ಜಮೀನು ವಾರ್ಷಿಕ ನಿಗಾದಲ್ಲಿ ಮುಂದುವರಿಯುತ್ತದೆ.",
  },
  nothingToCount: { en: "Nothing planted and awaiting a count.", kn: "ಎಣಿಕೆಗೆ ಬಾಕಿ ಇರುವ ನೆಡುವಿಕೆ ಇಲ್ಲ." },
  nothingToAudit: { en: "Nothing planted and awaiting inspection.", kn: "ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ ಇರುವ ನೆಡುವಿಕೆ ಇಲ್ಲ." },
  cycle: { en: "Count cycle", kn: "ಗಣತಿ ಚಕ್ರ" },
  auditDecision: { en: "Inspection outcome", kn: "ಪರಿಶೀಲನೆಯ ಫಲಿತಾಂಶ" },
  cleared: { en: "Cleared", kn: "ತೀರುವಳಿ" },
  flagged: { en: "Flagged", kn: "ಗುರುತಿಸಲಾಗಿದೆ" },
  finding: { en: "Finding", kn: "ಕಂಡುಬಂದದ್ದು" },
  saveAudit: { en: "Save the inspection", kn: "ಪರಿಶೀಲನೆ ಉಳಿಸಿ" },
  auditSaved: { en: "Inspection recorded", kn: "ಪರಿಶೀಲನೆ ದಾಖಲಾಗಿದೆ" },
  verifiedByLabel: { en: "Boundary walked by", kn: "ಗಡಿ ನಡೆದವರು" },
  openRectifications: { en: "Open rectifications", kn: "ಬಾಕಿ ಸರಿಪಡಿಸುವಿಕೆಗಳು" },
  markClosed: { en: "Mark rectified", kn: "ಸರಿಪಡಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ" },
  escalate: { en: "Escalate to the DFO", kn: "ಡಿಎಫ್‌ಒಗೆ ಉನ್ನತೀಕರಿಸಿ" },
  escalatedTo: { en: "Escalated to", kn: "ಉನ್ನತೀಕರಿಸಲಾಗಿದೆ" },
  rectClosed: { en: "Rectified", kn: "ಸರಿಪಡಿಸಲಾಗಿದೆ" },
  ownerLabel: { en: "Named owner", kn: "ಹೊಣೆಗಾರ" },
  plantedAwaitingCensus: { en: "Planted, awaiting its count", kn: "ನೆಟ್ಟಿದೆ, ಎಣಿಕೆಗೆ ಬಾಕಿ" },
  surviving: { en: "Surviving", kn: "ಉಳಿದಿರುವುದು" },
  countedBy: { en: "Counted by", kn: "ಎಣಿಸಿದವರು" },
  cosignedBy: { en: "Co-signed by", kn: "ಜೊತೆಯಲ್ಲಿ ಸಹಿ ಹಾಕಿದವರು" },
  belowThresholdNote: {
    en: "Below the threshold. Saving this count raises a rectification against the implementing agency, with a deadline.",
    kn: "ಮಿತಿಗಿಂತ ಕಡಿಮೆ. ಈ ಎಣಿಕೆಯನ್ನು ಉಳಿಸಿದರೆ ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆಯ ಮೇಲೆ ಗಡುವಿನೊಂದಿಗೆ ಸರಿಪಡಿಸುವಿಕೆ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.",
  },
  cannotAuditNote: {
    en: "This officer walked the boundary of this parcel at verification. They may audit any other parcel in the taluk, but not the one they verified — an officer checking their own work is not a check.",
    kn: "ಈ ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆಯ ವೇಳೆ ಈ ಜಮೀನಿನ ಗಡಿಯನ್ನು ನಡೆದಿದ್ದಾರೆ. ತಾಲ್ಲೂಕಿನ ಬೇರೆ ಯಾವ ಜಮೀನನ್ನಾದರೂ ಪರಿಶೋಧಿಸಬಹುದು, ತಾವು ಪರಿಶೀಲಿಸಿದ್ದನ್ನಲ್ಲ — ತನ್ನದೇ ಕೆಲಸವನ್ನು ತಾನೇ ಪರಿಶೀಲಿಸುವುದು ಪರಿಶೀಲನೆಯಲ್ಲ.",
  },
  verifiedByThisOfficer: { en: "Verified by this officer", kn: "ಈ ಅಧಿಕಾರಿಯಿಂದ ಪರಿಶೀಲಿತ" },
  inspectionDecision: { en: "Inspection outcome", kn: "ತಪಾಸಣೆಯ ಫಲಿತಾಂಶ" },
  auditFlagged: { en: "Flagged", kn: "ಗುರುತಿಸಲಾಗಿದೆ" },
  namedOwner: { en: "Named owner", kn: "ಹೊಣೆಗಾರ" },
  raisedOn: { en: "Raised", kn: "ಸೃಷ್ಟಿಯಾದದ್ದು" },
  markCleared: { en: "Mark as cleared", kn: "ತೀರುವಳಿ ಎಂದು ಗುರುತಿಸಿ" },
  noRectifications: { en: "Nothing outstanding.", kn: "ಬಾಕಿ ಏನೂ ಇಲ್ಲ." },
  stOpen: { en: "Open", kn: "ಬಾಕಿ" },
  stEscalated: { en: "Escalated to district", kn: "ಜಿಲ್ಲೆಗೆ ಉನ್ನತೀಕರಿಸಲಾಗಿದೆ" },
  stClosed: { en: "Cleared", kn: "ತೀರುವಳಿ" },
  navDispatch: { en: "Dispatch from nursery", kn: "ನರ್ಸರಿಯಿಂದ ಸಾಗಣೆ" },
  navPlanting: { en: "Record planting", kn: "ನೆಡುವಿಕೆ ದಾಖಲಿಸಿ" },
  hDispatch: { en: "Dispatch from nursery", kn: "ನರ್ಸರಿಯಿಂದ ಸಾಗಣೆ" },
  hPlanting: { en: "Planting", kn: "ನೆಡುವಿಕೆ" },
  ledeDispatch: {
    en: "What a nursery actually sent, against what IAFT approved for that parcel. A species dispatched outside the approved plan is flagged — not blocked, because there are legitimate reasons, but never silent.",
    kn: "ಐಎಎಫ್‌ಟಿ ಆ ಜಮೀನಿಗೆ ಅನುಮೋದಿಸಿದ್ದಕ್ಕೆ ಎದುರಾಗಿ ನರ್ಸರಿ ನಿಜವಾಗಿ ಏನು ಕಳುಹಿಸಿತು. ಅನುಮೋದಿತ ಯೋಜನೆಯ ಹೊರಗಿನ ಪ್ರಭೇದವನ್ನು ಗುರುತಿಸಲಾಗುತ್ತದೆ — ತಡೆಯುವುದಿಲ್ಲ, ಕಾರಣಗಳಿರಬಹುದು, ಆದರೆ ಮೌನವಾಗಿ ಬಿಡುವುದಿಲ್ಲ.",
  },
  ledePlanting: {
    en: "The implementing agency records what went into the ground, against what arrived. The tag is bound to the parcel here, and from this moment it appears in the public record.",
    kn: "ಬಂದದ್ದಕ್ಕೆ ಎದುರಾಗಿ ನೆಲಕ್ಕೆ ಏನು ಹೋಯಿತು ಎಂದು ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ ದಾಖಲಿಸುತ್ತದೆ. ಇಲ್ಲಿ ಟ್ಯಾಗ್ ಜಮೀನಿಗೆ ಜೋಡಣೆಯಾಗುತ್ತದೆ, ಈ ಕ್ಷಣದಿಂದ ಅದು ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
  },
  batch: { en: "Batch", kn: "ಬ್ಯಾಚ್" },
  nursery: { en: "Nursery", kn: "ನರ್ಸರಿ" },
  dispatchedOn: { en: "Dispatched", kn: "ಸಾಗಿಸಿದ ದಿನಾಂಕ" },
  receivedBy: { en: "Received by", kn: "ಸ್ವೀಕರಿಸಿದವರು" },
  vehicle: { en: "Vehicle", kn: "ವಾಹನ" },
  inPlan: { en: "in the approved plan", kn: "ಅನುಮೋದಿತ ಯೋಜನೆಯಲ್ಲಿದೆ" },
  offPlanTag: { en: "not in the approved plan", kn: "ಅನುಮೋದಿತ ಯೋಜನೆಯಲ್ಲಿಲ್ಲ" },
  offPlanNote: {
    en: "This species was not in the plan IAFT approved for this parcel. The substitution stands on the record with the batch that carried it, and the reviewer decides whether it is accepted.",
    kn: "ಈ ಪ್ರಭೇದ ಐಎಎಫ್‌ಟಿ ಈ ಜಮೀನಿಗೆ ಅನುಮೋದಿಸಿದ ಯೋಜನೆಯಲ್ಲಿ ಇರಲಿಲ್ಲ. ಬದಲಿಯನ್ನು ತಂದ ಬ್ಯಾಚ್‌ನೊಂದಿಗೆ ದಾಖಲೆಯಲ್ಲಿ ಉಳಿಯುತ್ತದೆ, ಅದನ್ನು ಒಪ್ಪಬೇಕೇ ಎಂದು ಪರಿಶೀಲಕರು ನಿರ್ಧರಿಸುತ್ತಾರೆ.",
  },
  awaitingDispatch: { en: "Approved, awaiting dispatch", kn: "ಅನುಮೋದಿತ, ಸಾಗಣೆಗೆ ಬಾಕಿ" },
  dispatchIt: { en: "Record the dispatch", kn: "ಸಾಗಣೆ ದಾಖಲಿಸಿ" },
  whichParcelDispatch: { en: "Which parcel is this batch for", kn: "ಈ ಬ್ಯಾಚ್ ಯಾವ ಜಮೀನಿಗೆ" },
  nothingToDispatch: { en: "Nothing approved and awaiting dispatch.", kn: "ಸಾಗಣೆಗೆ ಬಾಕಿ ಇರುವ ಅನುಮೋದಿತ ಜಮೀನು ಇಲ್ಲ." },
  dispatched: { en: "Dispatched", kn: "ಸಾಗಿಸಿದ್ದು" },
  plantedQty: { en: "Planted", kn: "ನೆಟ್ಟದ್ದು" },
  notPlanted: { en: "not planted", kn: "ನೆಡಲಿಲ್ಲ" },
  agency: { en: "Implementing agency", kn: "ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ" },
  pitsDug: { en: "Pits dug", kn: "ತೋಡಿದ ಗುಂಡಿಗಳು" },
  tagBound: { en: "Tag bound to the parcel", kn: "ಜಮೀನಿಗೆ ಜೋಡಿಸಿದ ಟ್ಯಾಗ್" },
  whichParcelPlant: { en: "Which parcel are you planting", kn: "ಯಾವ ಜಮೀನಿನಲ್ಲಿ ನೆಡುತ್ತಿದ್ದೀರಿ" },
  awaitingPlanting: { en: "Dispatched, awaiting planting", kn: "ಸಾಗಿಸಲಾಗಿದೆ, ನೆಡುವಿಕೆಗೆ ಬಾಕಿ" },
  nothingToPlant: { en: "Nothing dispatched and awaiting planting.", kn: "ನೆಡುವಿಕೆಗೆ ಬಾಕಿ ಇರುವ ಸಾಗಣೆ ಇಲ್ಲ." },
  recordPlanting: { en: "Record the planting", kn: "ನೆಡುವಿಕೆ ದಾಖಲಿಸಿ" },
  plantedNow: {
    en: "Planted. The parcel now carries a tag and appears in the public record for this session — the same page a citizen reaches by scanning it. This build has no database, so it cannot be served to a second device.",
    kn: "ನೆಡಲಾಗಿದೆ. ಈಗ ಜಮೀನಿಗೆ ಟ್ಯಾಗ್ ಇದೆ ಮತ್ತು ಈ ಅವಧಿಯ ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ — ನಾಗರಿಕರು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ತಲುಪುವ ಪುಟವೇ ಇದು. ಈ ಆವೃತ್ತಿಗೆ ದತ್ತಸಂಚಯ ಇಲ್ಲದ ಕಾರಣ ಇನ್ನೊಂದು ಸಾಧನಕ್ಕೆ ನೀಡಲಾಗದು.",
  },
  gapNote: {
    en: "Seedlings that arrived but were not planted stay on the record with the reason. They are not quietly dropped from the count.",
    kn: "ಬಂದರೂ ನೆಡದ ಸಸಿಗಳು ಕಾರಣದೊಂದಿಗೆ ದಾಖಲೆಯಲ್ಲಿ ಉಳಿಯುತ್ತವೆ. ಎಣಿಕೆಯಿಂದ ಮೌನವಾಗಿ ತೆಗೆಯುವುದಿಲ್ಲ.",
  },
  filterDistrict: { en: "District", kn: "ಜಿಲ್ಲೆ" },
  allDistricts: { en: "All districts", kn: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು" },
  navPlans: { en: "Site-specific plans", kn: "ಸ್ಥಳ-ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಗಳು" },
  navReview: { en: "IAFT review", kn: "ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನೆ" },
  navNursery: { en: "Nursery raising plan", kn: "ನರ್ಸರಿ ಬೆಳೆಸುವ ಯೋಜನೆ" },
  navAllocation: { en: "Raising requirement", kn: "ಬೆಳೆಸುವ ಅಗತ್ಯ" },
  hAllocation: { en: "Nursery raising requirement", kn: "ನರ್ಸರಿ ಬೆಳೆಸುವ ಅಗತ್ಯ" },
  ledeAllocation: {
    en: "What each nursery location must raise for this programme, and by when. Demand follows the parcel's taluk to the nursery that serves it. This is the statement issued to the Karnataka Forest Department so they can plan raising at that location.",
    kn: "ಈ ಕಾರ್ಯಕ್ರಮಕ್ಕಾಗಿ ಪ್ರತಿ ನರ್ಸರಿ ಸ್ಥಳ ಏನನ್ನು, ಯಾವಾಗ ಬೆಳೆಸಬೇಕು. ಜಮೀನಿನ ತಾಲ್ಲೂಕಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುವ ನರ್ಸರಿಗೆ ಬೇಡಿಕೆ ಹೋಗುತ್ತದೆ. ಆ ಸ್ಥಳದಲ್ಲಿ ಬೆಳೆಸುವ ಯೋಜನೆ ರೂಪಿಸಲು ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆಗೆ ಈ ಹೇಳಿಕೆಯನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
  },
  additionalNote: {
    en: "This is a requirement to raise, not a draw on stock. Seedlings standing in a Forest Department nursery today were raised for other schemes and are not available to this programme — what follows is additional to whatever the nursery already holds.",
    kn: "ಇದು ಬೆಳೆಸಬೇಕಾದ ಅಗತ್ಯ, ಈಗಿರುವ ಸಸಿಗಳ ಮೇಲಿನ ಹಕ್ಕು ಅಲ್ಲ. ಇಂದು ಅರಣ್ಯ ಇಲಾಖೆಯ ನರ್ಸರಿಯಲ್ಲಿ ಇರುವ ಸಸಿಗಳನ್ನು ಬೇರೆ ಯೋಜನೆಗಳಿಗಾಗಿ ಬೆಳೆಸಲಾಗಿದೆ, ಅವು ಈ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಲಭ್ಯವಿಲ್ಲ — ಮುಂದಿನದು ನರ್ಸರಿಯಲ್ಲಿ ಈಗಾಗಲೇ ಇರುವುದಕ್ಕೆ ಹೆಚ್ಚುವರಿ.",
  },
  toRaiseHere: { en: "To raise at this location", kn: "ಈ ಸ್ಥಳದಲ್ಲಿ ಬೆಳೆಸಬೇಕಾದದ್ದು" },
  serves: { en: "serves", kn: "ಸೇವೆ ಸಲ್ಲಿಸುವ ತಾಲ್ಲೂಕುಗಳು" },
  noNursery: { en: "No nursery location on record", kn: "ದಾಖಲೆಯಲ್ಲಿ ನರ್ಸರಿ ಸ್ಥಳವಿಲ್ಲ" },
  noNurseryNote: {
    en: "Demand from taluks with no nursery location on record. The department decides where this is raised — a neighbouring range, or an accredited private nursery.",
    kn: "ದಾಖಲೆಯಲ್ಲಿ ನರ್ಸರಿ ಸ್ಥಳವಿಲ್ಲದ ತಾಲ್ಲೂಕುಗಳ ಬೇಡಿಕೆ. ಇದನ್ನು ಎಲ್ಲಿ ಬೆಳೆಸಬೇಕೆಂದು ಇಲಾಖೆ ನಿರ್ಧರಿಸುತ್ತದೆ — ಪಕ್ಕದ ವಲಯ ಅಥವಾ ಮಾನ್ಯತೆ ಪಡೆದ ಖಾಸಗಿ ನರ್ಸರಿ.",
  },
  plantingSeason: { en: "Planting season", kn: "ನೆಡುವ ಋತು" },
  sowingBegins: { en: "Sowing to begin", kn: "ಬಿತ್ತನೆ ಆರಂಭ" },
  leadTime: { en: "raising lead time", kn: "ಬೆಳೆಸುವ ಅವಧಿ" },
  months: { en: "months", kn: "ತಿಂಗಳು" },
  govFirst: { en: "Government", kn: "ಸರ್ಕಾರಿ" },
  privateAcc: { en: "Private, accredited", kn: "ಖಾಸಗಿ, ಮಾನ್ಯತೆ ಪಡೆದ" },
  capacity: { en: "Capacity", kn: "ಸಾಮರ್ಥ್ಯ" },
  requiredQty: { en: "Required", kn: "ಅಗತ್ಯವಿರುವುದು" },
  allocated: { en: "Allocated", kn: "ಹಂಚಿಕೆಯಾದದ್ದು" },
  shortfall: { en: "Shortfall", kn: "ಕೊರತೆ" },
  shortfallNote: {
    en: "Capacity in this district does not cover the demand. The balance must be sourced from a neighbouring division or by accrediting further private capacity — it is not planted by leaving it unstated.",
    kn: "ಈ ಜಿಲ್ಲೆಯ ಸಾಮರ್ಥ್ಯ ಬೇಡಿಕೆಯನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ. ಉಳಿದದ್ದನ್ನು ಪಕ್ಕದ ವಿಭಾಗದಿಂದ ಅಥವಾ ಹೆಚ್ಚಿನ ಖಾಸಗಿ ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಮಾನ್ಯತೆ ನೀಡಿ ಪಡೆಯಬೇಕು — ತಿಳಿಸದೆ ಬಿಟ್ಟರೆ ನೆಡುವಿಕೆ ಆಗುವುದಿಲ್ಲ.",
  },
  downloadDemand: { en: "Download for the Forest Department", kn: "ಅರಣ್ಯ ಇಲಾಖೆಗಾಗಿ ಪಡೆಯಿರಿ" },
  scaleNote: {
    en: "At demonstration volumes the demand fits comfortably inside one or two nurseries. At programme scale it will not, which is when the allocation order and the shortfall line start doing real work.",
    kn: "ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯ ಪ್ರಮಾಣದಲ್ಲಿ ಬೇಡಿಕೆ ಒಂದೆರಡು ನರ್ಸರಿಗಳಲ್ಲೇ ಹೊಂದುತ್ತದೆ. ಕಾರ್ಯಕ್ರಮದ ಪ್ರಮಾಣದಲ್ಲಿ ಹಾಗಾಗುವುದಿಲ್ಲ, ಆಗಲೇ ಹಂಚಿಕೆಯ ಕ್ರಮ ಮತ್ತು ಕೊರತೆಯ ಸಾಲು ನಿಜವಾದ ಕೆಲಸ ಮಾಡುತ್ತವೆ.",
  },
  nurseryMasterNote: {
    en: "Nursery locations here are illustrative. In production the list is read from the Forest Department's own e-Nursery register — the platform states a requirement against locations the department publishes, and never invents a nursery. How much capacity a location has, and whether the balance is raised in-house or through accredited private nurseries, is the department's decision.",
    kn: "ಇಲ್ಲಿನ ನರ್ಸರಿ ಸ್ಥಳಗಳು ಉದಾಹರಣೆ ಮಾತ್ರ. ಉತ್ಪಾದನೆಯಲ್ಲಿ ಈ ಪಟ್ಟಿಯನ್ನು ಅರಣ್ಯ ಇಲಾಖೆಯ ಇ-ನರ್ಸರಿ ನೋಂದಣಿಯಿಂದ ಓದಲಾಗುತ್ತದೆ — ಇಲಾಖೆ ಪ್ರಕಟಿಸಿದ ಸ್ಥಳಗಳಿಗೆ ಮಾತ್ರ ವೇದಿಕೆ ಅಗತ್ಯವನ್ನು ತಿಳಿಸುತ್ತದೆ, ನರ್ಸರಿಯನ್ನು ಎಂದಿಗೂ ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ. ಸ್ಥಳದ ಸಾಮರ್ಥ್ಯ ಎಷ್ಟು, ಉಳಿದದ್ದನ್ನು ಸ್ವಂತ ಬೆಳೆಸಬೇಕೋ ಅಥವಾ ಮಾನ್ಯತೆ ಪಡೆದ ಖಾಸಗಿ ನರ್ಸರಿಯಿಂದ ಪಡೆಯಬೇಕೋ ಎಂಬುದು ಇಲಾಖೆಯ ನಿರ್ಧಾರ.",
  },
  hPlans: { en: "Site-specific plans", kn: "ಸ್ಥಳ-ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಗಳು" },
  hReview: { en: "IAFT review", kn: "ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನೆ" },
  hNursery: { en: "Nursery raising plan", kn: "ನರ್ಸರಿ ಬೆಳೆಸುವ ಯೋಜನೆ" },
  ledePlans: {
    en: "One plan per Location ID, built from the verified record against the IAFT silvi-zone species statement. The district fixes the zone, the land category fixes the planting model, and the walked area fixes the count. The platform proposes; it does not decide.",
    kn: "ಪ್ರತಿ ಲೊಕೇಶನ್ ಐಡಿಗೆ ಒಂದು ಯೋಜನೆ, ಪರಿಶೀಲಿತ ದಾಖಲೆಯಿಂದ ಐಎಎಫ್‌ಟಿ ಸಿಲ್ವಿ-ವಲಯ ಪ್ರಭೇದ ಹೇಳಿಕೆಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿಸಲಾಗಿದೆ. ಜಿಲ್ಲೆ ವಲಯವನ್ನು, ಭೂಮಿಯ ವರ್ಗ ನೆಡುವ ಮಾದರಿಯನ್ನು, ನಡೆದ ವಿಸ್ತೀರ್ಣ ಸಂಖ್ಯೆಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ. ವೇದಿಕೆ ಸೂಚಿಸುತ್ತದೆ; ನಿರ್ಧರಿಸುವುದಿಲ್ಲ.",
  },
  ledeReview: {
    en: "The IAFT team reviews each proposed plan against the verified record and either approves it or returns it with remarks. Nothing reaches nursery planning unapproved.",
    kn: "ಐಎಎಫ್‌ಟಿ ತಂಡ ಪ್ರತಿ ಪ್ರಸ್ತಾವಿತ ಯೋಜನೆಯನ್ನು ಪರಿಶೀಲಿತ ದಾಖಲೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ ಅನುಮೋದಿಸುತ್ತದೆ ಅಥವಾ ಟಿಪ್ಪಣಿಯೊಂದಿಗೆ ಮರಳಿಸುತ್ತದೆ. ಅನುಮೋದನೆ ಇಲ್ಲದೆ ಯಾವುದೂ ನರ್ಸರಿ ಯೋಜನೆಗೆ ಹೋಗುವುದಿಲ್ಲ.",
  },
  ledeNursery: {
    en: "Approved plans, aggregated into what each district must raise — by species and polybag size, with a casualty replacement margin. This is the statement the Forest Department and the PMU act on.",
    kn: "ಅನುಮೋದಿತ ಯೋಜನೆಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ ಪ್ರತಿ ಜಿಲ್ಲೆ ಏನನ್ನು ಬೆಳೆಸಬೇಕೆಂದು ತೋರಿಸುತ್ತದೆ — ಪ್ರಭೇದ ಮತ್ತು ಚೀಲದ ಅಳತೆವಾರು, ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಪ್ರಮಾಣದೊಂದಿಗೆ. ಅರಣ್ಯ ಇಲಾಖೆ ಮತ್ತು ಪಿಎಂಯು ಈ ಹೇಳಿಕೆಯ ಮೇಲೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.",
  },
  silviZone: { en: "Silvi zone", kn: "ಸಿಲ್ವಿ ವಲಯ" },
  plantingModel: { en: "Planting model", kn: "ನೆಡುವ ಮಾದರಿ" },
  bagSize: { en: "Polybag size", kn: "ಚೀಲದ ಅಳತೆ" },
  eligibleSpecies: { en: "Eligible species — IAFT statement", kn: "ಅರ್ಹ ಪ್ರಭೇದಗಳು — ಐಎಎಫ್‌ಟಿ ಹೇಳಿಕೆ" },
  saplings: { en: "saplings", kn: "ಸಸಿಗಳು" },
  reviewerNotes: { en: "For the reviewer's attention", kn: "ಪರಿಶೀಲಕರ ಗಮನಕ್ಕೆ" },
  notesNever: {
    en: "These are notes, not exclusions. A species is removed by a scientist, never by the system.",
    kn: "ಇವು ಟಿಪ್ಪಣಿಗಳು, ಹೊರಗಿಡುವಿಕೆ ಅಲ್ಲ. ಪ್ರಭೇದವನ್ನು ವಿಜ್ಞಾನಿ ತೆಗೆಯುತ್ತಾರೆ, ವ್ಯವಸ್ಥೆ ಎಂದಿಗೂ ಅಲ್ಲ.",
  },
  stDraft: { en: "Draft", kn: "ಕರಡು" },
  stSubmitted: { en: "Awaiting IAFT review", kn: "ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ" },
  stApproved: { en: "Approved by IAFT", kn: "ಐಎಎಫ್‌ಟಿ ಅನುಮೋದಿಸಿದೆ" },
  stReturned: { en: "Returned with remarks", kn: "ಟಿಪ್ಪಣಿಯೊಂದಿಗೆ ಮರಳಿಸಲಾಗಿದೆ" },
  submitForReview: { en: "Submit for IAFT review", kn: "ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ" },
  approvePlan: { en: "Approve", kn: "ಅನುಮೋದಿಸಿ" },
  returnPlan: { en: "Return with remarks", kn: "ಟಿಪ್ಪಣಿಯೊಂದಿಗೆ ಮರಳಿಸಿ" },
  remarks: { en: "Remarks", kn: "ಟಿಪ್ಪಣಿ" },
  reviewedBy: { en: "Reviewed by", kn: "ಪರಿಶೀಲಿಸಿದವರು" },
  reviewingAs: { en: "Reviewing as", kn: "ಪರಿಶೀಲಿಸುತ್ತಿರುವವರು" },
  awaitingReview: { en: "Awaiting review", kn: "ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ" },
  nothingToReview: { en: "Nothing awaiting review.", kn: "ಪರಿಶೀಲನೆಗೆ ಏನೂ ಬಾಕಿ ಇಲ್ಲ." },
  includeSpecies: { en: "included in the plan", kn: "ಯೋಜನೆಯಲ್ಲಿ ಸೇರಿದೆ" },
  margin: { en: "Casualty replacement margin", kn: "ಸತ್ತ ಸಸಿಗಳ ಬದಲಿ ಪ್ರಮಾಣ" },
  marginNote: {
    en: "No programme standard is set yet, so this is tunable. Changing it recomputes every district below.",
    kn: "ಇನ್ನೂ ಕಾರ್ಯಕ್ರಮದ ಮಾನದಂಡ ನಿಗದಿಯಾಗಿಲ್ಲ, ಆದ್ದರಿಂದ ಇದನ್ನು ಬದಲಿಸಬಹುದು. ಬದಲಿಸಿದರೆ ಕೆಳಗಿನ ಪ್ರತಿ ಜಿಲ್ಲೆಯೂ ಮರುಲೆಕ್ಕಾಚಾರವಾಗುತ್ತದೆ.",
  },
  planned: { en: "Planned", kn: "ಯೋಜಿತ" },
  toRaise: { en: "To raise", kn: "ಬೆಳೆಸಬೇಕಾದದ್ದು" },
  parcelsCount: { en: "parcels", kn: "ಜಮೀನುಗಳು" },
  noApproved: {
    en: "No approved plans yet. Approve a plan under IAFT review and it appears here.",
    kn: "ಇನ್ನೂ ಅನುಮೋದಿತ ಯೋಜನೆಗಳಿಲ್ಲ. ಐಎಎಫ್‌ಟಿ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಅನುಮೋದಿಸಿದರೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
  },
  demandNote: {
    en: "Government nurseries raise against this statement; the balance is sourced from accredited private nurseries. Raising season works back from the planting monsoon.",
    kn: "ಸರ್ಕಾರಿ ನರ್ಸರಿಗಳು ಈ ಹೇಳಿಕೆಯ ಪ್ರಕಾರ ಬೆಳೆಸುತ್ತವೆ; ಉಳಿದದ್ದನ್ನು ಮಾನ್ಯತೆ ಪಡೆದ ಖಾಸಗಿ ನರ್ಸರಿಗಳಿಂದ ಪಡೆಯಲಾಗುತ್ತದೆ. ಬೆಳೆಸುವ ಋತುವನ್ನು ನೆಡುವ ಮಳೆಗಾಲದಿಂದ ಹಿಂದಕ್ಕೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
  },
  grpOutcome: { en: "3 · Comparison", kn: "3 · ಹೋಲಿಕೆ" },
  searchParcelIk: { en: "Search", kn: "ಹುಡುಕಿ" },
  navVerify: { en: "Verification", kn: "ಪರಿಶೀಲನೆ" },
  registerLede: {
    en: "Every parcel a department has offered, and where each one has reached. An offer reference is issued on submission; a Location ID only after verification and custody.",
    kn: "ಇಲಾಖೆಗಳು ನೀಡಿದ ಪ್ರತಿ ಜಮೀನು ಮತ್ತು ಅದು ಯಾವ ಹಂತದಲ್ಲಿದೆ. ಸಲ್ಲಿಕೆಯಾದಾಗ ಆಫರ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ; ಪರಿಶೀಲನೆ ಮತ್ತು ಪಾಲನೆಯ ನಂತರವೇ ಲೊಕೇಶನ್ ಐಡಿ.",
  },
  verifyLede: {
    en: "Retired Range Forest Officers, two per taluk. They walk what the department offered and record what they actually found.",
    kn: "ನಿವೃತ್ತ ವಲಯ ಅರಣ್ಯಾಧಿಕಾರಿಗಳು, ತಾಲ್ಲೂಕಿಗೆ ಇಬ್ಬರು. ಇಲಾಖೆ ನೀಡಿದ ಜಮೀನನ್ನು ನಡೆದು, ನಿಜವಾಗಿ ಕಂಡದ್ದನ್ನು ದಾಖಲಿಸುತ್ತಾರೆ.",
  },
  officer: { en: "Verification officer", kn: "ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ" },
  queue: { en: "Assigned to you", kn: "ನಿಮಗೆ ನಿಯೋಜಿತ" },
  nothingAssigned: { en: "Nothing assigned in your taluk right now.", kn: "ಸದ್ಯಕ್ಕೆ ನಿಮ್ಮ ತಾಲ್ಲೂಕಿನಲ್ಲಿ ಏನೂ ನಿಯೋಜಿತವಾಗಿಲ್ಲ." },
  declared: { en: "Department declared", kn: "ಇಲಾಖೆ ತಿಳಿಸಿದ್ದು" },
  foundOnSite: { en: "Officer found on site", kn: "ಅಧಿಕಾರಿ ಕಂಡದ್ದು" },
  sameAsDeclared: { en: "same", kn: "ಅದೇ" },
  boundaryWalk: { en: "Boundary walk", kn: "ಗಡಿ ನಡಿಗೆ" },
  walkedArea: { en: "Area walked (ha)", kn: "ನಡೆದ ವಿಸ್ತೀರ್ಣ (ಹೆ.)" },
  geometryClosed: { en: "Boundary closed without crossing itself", kn: "ಗಡಿ ತನ್ನನ್ನೇ ಕತ್ತರಿಸದೆ ಮುಚ್ಚಿದೆ" },
  recordWalk: { en: "Record the walked boundary", kn: "ನಡೆದ ಗಡಿಯನ್ನು ದಾಖಲಿಸಿ" },
  recordLine: { en: "Record the traced centre-line", kn: "ದಾಖಲಿಸಿದ ಕೇಂದ್ರ ರೇಖೆ ದಾಖಲಿಸಿ" },
  captureMode: { en: "How is this ground measured", kn: "ಈ ನೆಲವನ್ನು ಹೇಗೆ ಅಳೆಯಲಾಗುತ್ತದೆ" },
  modeRing: { en: "Walk the boundary — a block or bund planting", kn: "ಗಡಿ ನಡೆಯಿರಿ — ಬ್ಲಾಕ್ ಅಥವಾ ಬದು ನೆಡುವಿಕೆ" },
  modeLine: { en: "Trace the centre-line — a roadside, canal bank or compound boundary", kn: "ಕೇಂದ್ರ ರೇಖೆ ದಾಖಲಿಸಿ — ರಸ್ತೆ ಬದಿ, ಕಾಲುವೆ ದಂಡೆ ಅಥವಾ ಆವರಣದ ಗಡಿ" },
  modeNote: {
    en: "A roadside strip is a run, not an area. Walking a ring around it and computing hectares would give a number that means nothing — the planting models for these are quoted per kilometre.",
    kn: "ರಸ್ತೆ ಬದಿ ಒಂದು ಉದ್ದ, ವಿಸ್ತೀರ್ಣವಲ್ಲ. ಅದರ ಸುತ್ತ ವರ್ತುಲ ನಡೆದು ಹೆಕ್ಟೇರ್ ಲೆಕ್ಕಹಾಕಿದರೆ ಅರ್ಥವಿಲ್ಲದ ಸಂಖ್ಯೆ ಬರುತ್ತದೆ — ಇವುಗಳ ನೆಡುವ ಮಾದರಿಗಳನ್ನು ಪ್ರತಿ ಕಿಲೋಮೀಟರಿಗೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
  },
  stripWidth: { en: "Planted strip width (m)", kn: "ನೆಡುವ ಪಟ್ಟಿಯ ಅಗಲ (ಮೀ)" },
  lengthTraced: { en: "Length traced", kn: "ದಾಖಲಿಸಿದ ಉದ್ದ" },
  lineRecorded: { en: "Centre-line recorded", kn: "ಕೇಂದ್ರ ರೇಖೆ ದಾಖಲಾಗಿದೆ" },
  traceAgain: { en: "Trace it again", kn: "ಮತ್ತೆ ದಾಖಲಿಸಿ" },
  stripArea: { en: "Strip area it occupies", kn: "ಆಕ್ರಮಿಸುವ ಪಟ್ಟಿಯ ವಿಸ್ತೀರ್ಣ" },
  walkRecorded: { en: "Boundary recorded", kn: "ಗಡಿ ದಾಖಲಾಗಿದೆ" },
  walkAgain: { en: "Record it again", kn: "ಮತ್ತೆ ದಾಖಲಿಸಿ" },
  areaComputed: { en: "Area, computed from the ring", kn: "ಗಡಿಯಿಂದ ಲೆಕ್ಕಹಾಕಿದ ವಿಸ್ತೀರ್ಣ" },
  walkIsInput: {
    en: "Nobody types the area. The handset logs a fix every few seconds as the officer walks, and the area and perimeter are computed from that track. This is why the walked figure can differ from the department's.",
    kn: "ವಿಸ್ತೀರ್ಣವನ್ನು ಯಾರೂ ಟೈಪ್ ಮಾಡುವುದಿಲ್ಲ. ಅಧಿಕಾರಿ ನಡೆಯುವಾಗ ಸಾಧನ ಪ್ರತಿ ಕೆಲವು ಸೆಕೆಂಡಿಗೊಮ್ಮೆ ಸ್ಥಾನ ದಾಖಲಿಸುತ್ತದೆ, ಆ ಜಾಡಿನಿಂದ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಸುತ್ತಳತೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ. ಆದ್ದರಿಂದಲೇ ನಡೆದ ಅಂಕಿ ಇಲಾಖೆಯದಕ್ಕಿಂತ ಭಿನ್ನವಾಗಿರಬಹುದು.",
  },
  walkNone: {
    en: "No boundary recorded yet. Until the officer walks it there is no polygon, and without a polygon nothing can be checked.",
    kn: "ಇನ್ನೂ ಗಡಿ ದಾಖಲಾಗಿಲ್ಲ. ಅಧಿಕಾರಿ ನಡೆಯುವವರೆಗೆ ಬಹುಭುಜ ಇಲ್ಲ, ಬಹುಭುಜ ಇಲ್ಲದೆ ಏನನ್ನೂ ಪರಿಶೀಲಿಸಲಾಗದು.",
  },
  walkPoints: { en: "GPS points recorded", kn: "ದಾಖಲಾದ ಜಿಪಿಎಸ್ ಬಿಂದುಗಳು" },
  walkAccuracy: { en: "GPS accuracy", kn: "ಜಿಪಿಎಸ್ ನಿಖರತೆ" },
  walkPerimeter: { en: "Perimeter walked", kn: "ನಡೆದ ಸುತ್ತಳತೆ" },
  walkTime: { en: "Walk started and ended", kn: "ನಡಿಗೆ ಆರಂಭ ಮತ್ತು ಅಂತ್ಯ" },
  walkDevice: { en: "Device", kn: "ಸಾಧನ" },
  walkCentroid: { en: "Centroid", kn: "ಕೇಂದ್ರ ಬಿಂದು" },
  walkVersion: { en: "Geometry version", kn: "ಗಡಿ ಆವೃತ್ತಿ" },
  walkTolerance: { en: "Simplification tolerance", kn: "ಸರಳೀಕರಣ ಸಹನೆ" },
  walkRaw: {
    en: "The raw track is written once and never edited. A simplified working polygon is stored beside it, and that is what every later check runs against.",
    kn: "ನಡೆದ ಮೂಲ ಜಾಡನ್ನು ಒಮ್ಮೆ ಬರೆದು ಎಂದಿಗೂ ತಿದ್ದುವುದಿಲ್ಲ. ಅದರ ಪಕ್ಕದಲ್ಲಿ ಸರಳೀಕೃತ ಕಾರ್ಯ ಬಹುಭುಜ ಸಂಗ್ರಹವಾಗುತ್ತದೆ, ಮುಂದಿನ ಎಲ್ಲಾ ಪರಿಶೀಲನೆಗಳು ಅದರ ಮೇಲೆ ನಡೆಯುತ್ತವೆ.",
  },
  scanThis: { en: "Scan to open the public record", kn: "ಸಾರ್ವಜನಿಕ ದಾಖಲೆ ತೆರೆಯಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" },
  tagReady: {
    en: "A tag can now be printed for this parcel and fixed on the ground.",
    kn: "ಈಗ ಈ ಜಮೀನಿಗೆ ಟ್ಯಾಗ್ ಮುದ್ರಿಸಿ ನೆಲದ ಮೇಲೆ ಜೋಡಿಸಬಹುದು.",
  },
  runChecks: { en: "Run the approval checks", kn: "ಅನುಮೋದನೆ ಪರಿಶೀಲನೆ ನಡೆಸಿ" },
  gateResult: { en: "Gate result", kn: "ಪರಿಶೀಲನೆಯ ಫಲಿತಾಂಶ" },
  vertices: { en: "vertices recorded", kn: "ದಾಖಲಾದ ಬಿಂದುಗಳು" },
  vsRtc: { en: "against RTC extent", kn: "ಆರ್‌ಟಿಸಿ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ಹೋಲಿಸಿ" },
  overlapFound: { en: "Overlap with the register", kn: "ನೋಂದಣಿಯೊಂದಿಗೆ ಅತಿವ್ಯಾಪ್ತಿ" },
  decide: { en: "Decision", kn: "ನಿರ್ಧಾರ" },
  verifyIt: { en: "Verify and assign custody", kn: "ಪರಿಶೀಲಿಸಿ ಪಾಲನೆ ನಿಗದಿಪಡಿಸಿ" },
  rejectIt: { en: "Do not accept", kn: "ಸ್ವೀಕರಿಸಬೇಡಿ" },
  rejectReason: { en: "Reason", kn: "ಕಾರಣ" },
  custodyBody: { en: "Custodian body", kn: "ಪಾಲಕ ಸಂಸ್ಥೆ" },
  custodyNote: {
    en: "Custody is assigned here, not approved. No custodian, no planting.",
    kn: "ಇಲ್ಲಿ ಪಾಲನೆ ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ, ಅನುಮೋದನೆ ಅಲ್ಲ. ಪಾಲಕರಿಲ್ಲದೆ ನೆಡುವಿಕೆ ಇಲ್ಲ.",
  },
  issued: { en: "Location ID issued", kn: "ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗಿದೆ" },
  issuedNote: {
    en: "The parcel now has an identity, and a tag can be bound to the ground. It appears in the public record from here on.",
    kn: "ಈಗ ಜಮೀನಿಗೆ ಗುರುತು ದೊರೆತಿದೆ, ನೆಲಕ್ಕೆ ಟ್ಯಾಗ್ ಜೋಡಿಸಬಹುದು. ಇಲ್ಲಿಂದ ಮುಂದೆ ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
  },
  notAccepted: { en: "Not accepted", kn: "ಸ್ವೀಕರಿಸಿಲ್ಲ" },
  backToQueue: { en: "Back to the queue", kn: "ಸರತಿಗೆ ಹಿಂದೆ" },
  offerRef: { en: "Offer reference", kn: "ಆಫರ್ ಉಲ್ಲೇಖ" },
  justSubmitted: { en: "just submitted", kn: "ಈಗ ಸಲ್ಲಿಕೆಯಾಗಿದೆ" },
  allDepartments: { en: "All departments", kn: "ಎಲ್ಲಾ ಇಲಾಖೆಗಳು" },
  allStates: { en: "All stages", kn: "ಎಲ್ಲಾ ಹಂತಗಳು" },
  department: { en: "Department", kn: "ಇಲಾಖೆ" },
  stage: { en: "Stage", kn: "ಹಂತ" },
  offers: { en: "offers", kn: "ಆಫರ್‌ಗಳು" },
  twiceRejected: { en: "Twice rejected — referred to district review", kn: "ಎರಡು ಬಾರಿ ತಿರಸ್ಕೃತ — ಜಿಲ್ಲಾ ಪರಿಶೀಲನೆಗೆ" },
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

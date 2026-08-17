/**
 * Villages, by taluk.
 *
 * Supplied by the programme rather than derived, which is the only reason they
 * are here at all. Naming a village is different in kind from inventing a
 * Location ID: an ID means nothing to anyone outside the register, whereas a
 * member of the committee from Hosadurga knows whether Kellodu exists and
 * roughly where it is. So these are names the programme stands behind.
 *
 * What they do NOT bring with them is a coordinate. A village name lets a site
 * be identified and spoken about — "the Nayakanahatti site" rather than
 * "KA-CTD-CLK-0512" — but it does not place a dot on a map to any better
 * precision than the taluk already did. Village centroids would need a village
 * boundary dataset, and until one is loaded the map still seats a site in its
 * taluk and says so.
 *
 * Assignment is by order within the taluk, so a site keeps the same village
 * across reloads and across two screens in the same meeting.
 */

export const VILLAGES: Record<string, string[]> = {
  Hosadurga: ["Banasihalli", "Madadakere", "Kellodu", "Sriramapura"],
  Challakere: ["Nayakanahatti", "Parasurampura", "Sanikere", "Thallak"],
  Hiriyur: ["Babbur", "Adivala", "Maskal", "Dharmapura"],
  Holalkere: ["Ramagiri", "B. Durga", "Chikkajajur", "Gunderi"],
  Sira: ["Bukkapatna", "Kallukote", "Changavara", "Tavarekere"],
  Madhugiri: ["Badavanahalli", "Midigeshi", "Puravara", "Kodigenahalli"],
  Pavagada: ["Y.N. Hosakote", "Nagalamadike", "Thirumani", "Nidagal"],
  Koratagere: ["Holavanahalli", "Kolala", "Tumbadi", "Channarayadurga"],
  Bailhongal: ["Sampagaon", "Nesargi", "Kittur", "Hannikeri"],
  Savadatti: ["Munavalli", "Yargatti", "Tallur", "Ugargol"],
  Ramdurg: ["Katkol", "Sureban", "Salahalli", "Mudakavi"],
  Afzalpur: ["Mashal", "Gobbur", "Atnoor", "Karajagi"],
  Aland: ["Khajuri", "Narona", "Kadaganchi", "Nimbal"],
  Chittapur: ["Nalwar", "Kalgi", "Shahabad", "Wadi"],
  Sandur: ["Choranur", "Toranagallu", "Yeshwanthanagar", "Krishnanagar"],
  Siruguppa: ["Karur", "Tekkalakota", "Hatcholli", "Raravi"],
  Indi: ["Chadchan", "Horti", "Salotagi", "Tamba"],
  Sindagi: ["Almel", "Devar Hippargi", "Moratagi", "Golgeri"],
  Manvi: ["Kavital", "Sirwar", "Kurdi", "Neeramanvi"],
  Devadurga: ["Gabbur", "Jalahalli", "Galag", "Arakera"],
  Kadur: ["Birur", "Singatagere", "Yagati", "Sakarayapatna"],
  Tarikere: ["Lakkavalli", "Ajjampura", "Shivani", "Lingadahalli"],
  Arsikere: ["Banavara", "Gandasi", "Kanakatte", "Javagal"],
  Channarayapatna: ["Shravanabelagola", "Nuggihalli", "Hirisave", "Bagur"],
  Nanjangud: ["Tayur", "Hullahalli", "Badanavalu", "Tagadur"],
  Hunsur: ["Bilikere", "Gavadagere", "Hanagodu", "Kattemalalavadi"],
};

"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { useOffers } from "@/components/ProgrammeStore";
import { tr } from "@/lib/i18n";
import PublicRecord from "./PublicRecord";

/**
 * Reached by scanning a tag for a Location ID that did not exist when the site
 * was built. If the parcel was planted in this session the full public record is
 * shown, because that is what the tag is for. If it was only issued an identity
 * and not yet planted, or the session belongs to another device, we say so
 * plainly rather than showing a page that pretends.
 */
export default function JustIssued({ id }: { id: string }) {
  const { lang } = useDemo();
  const en = lang === "en";
  const { sessionParcels, plantings } = useOffers();

  const parcel = sessionParcels.find((p) => p.id === id);
  if (parcel) return <PublicRecord parcel={parcel} />;

  const planted = plantings.some((p) => p.locationId === id);

  return (
    <main>
      <Link href="/" className="mono" style={{ textDecoration: "none" }}>
        ← {tr("back", lang)}
      </Link>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="mono">{id}</div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--green)",
            margin: "6px 0 12px",
          }}
        >
          {planted
            ? (en ? "Planted in this demonstration session" : "ಈ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಲ್ಲಿ ನೆಡಲಾಗಿದೆ")
            : (en ? "Location ID issued, not yet planted" : "ಲೊಕೇಶನ್ ಐಡಿ ನೀಡಲಾಗಿದೆ, ಇನ್ನೂ ನೆಟ್ಟಿಲ್ಲ")}
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: "68ch" }}>
          {planted
            ? (en
                ? "The tag resolved correctly — this is the address a scan is meant to reach. The record was created in the browser running the demonstration, and this build has no database, so it cannot be served to a second device."
                : "ಟ್ಯಾಗ್ ಸರಿಯಾಗಿ ತಲುಪಿದೆ — ಸ್ಕ್ಯಾನ್ ತಲುಪಬೇಕಾದ ವಿಳಾಸ ಇದೇ. ದಾಖಲೆಯನ್ನು ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ನಡೆಯುತ್ತಿರುವ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ, ಈ ಆವೃತ್ತಿಗೆ ದತ್ತಸಂಚಯ ಇಲ್ಲದ ಕಾರಣ ಇನ್ನೊಂದು ಸಾಧನಕ್ಕೆ ನೀಡಲಾಗದು.")
            : (en
                ? "This parcel has an identity but nothing has been planted on it yet. A public record begins at planting — until then there is nothing to disclose, and showing a page would imply otherwise."
                : "ಈ ಜಮೀನಿಗೆ ಗುರುತು ಇದೆ ಆದರೆ ಇನ್ನೂ ಏನನ್ನೂ ನೆಟ್ಟಿಲ್ಲ. ಸಾರ್ವಜನಿಕ ದಾಖಲೆ ನೆಡುವಿಕೆಯಿಂದ ಆರಂಭವಾಗುತ್ತದೆ — ಅಲ್ಲಿಯವರೆಗೆ ಬಹಿರಂಗಪಡಿಸಲು ಏನೂ ಇಲ್ಲ.")}
        </p>

        <p className="note" style={{ marginTop: 18 }}>
          {en
            ? "Scan a tag from the Tags sheet to open a parcel that is already in this build."
            : "ಈ ಆವೃತ್ತಿಯಲ್ಲಿ ಈಗಾಗಲೇ ಇರುವ ಜಮೀನನ್ನು ತೆರೆಯಲು ಟ್ಯಾಗ್ ಹಾಳೆಯಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ."}
        </p>
      </div>
    </main>
  );
}

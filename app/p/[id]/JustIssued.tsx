"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { tr } from "@/lib/i18n";

/**
 * Reached by scanning a tag whose Location ID was issued during this
 * demonstration. The record exists in the session that issued it; this build
 * carries no database, so it cannot be served to another device. Saying that
 * plainly is better than a 404.
 */
export default function JustIssued({ id }: { id: string }) {
  const { lang } = useDemo();
  const en = lang === "en";

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
          {en ? "Location ID issued during this demonstration" : "ಈ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಲ್ಲಿ ನೀಡಲಾದ ಲೊಕೇಶನ್ ಐಡಿ"}
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: "68ch" }}>
          {en
            ? "The tag resolved correctly — this is the address a scan is meant to reach. The parcel behind it was verified and issued a moment ago in the browser running the demonstration, and this build has no database, so its record cannot be served to a second device."
            : "ಟ್ಯಾಗ್ ಸರಿಯಾಗಿ ತಲುಪಿದೆ — ಸ್ಕ್ಯಾನ್ ತಲುಪಬೇಕಾದ ವಿಳಾಸ ಇದೇ. ಈ ಜಮೀನನ್ನು ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ನಡೆಯುತ್ತಿರುವ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಈಗಷ್ಟೇ ಪರಿಶೀಲಿಸಿ ಐಡಿ ನೀಡಲಾಗಿದೆ, ಮತ್ತು ಈ ಆವೃತ್ತಿಗೆ ದತ್ತಸಂಚಯ ಇಲ್ಲದ ಕಾರಣ ಆ ದಾಖಲೆಯನ್ನು ಇನ್ನೊಂದು ಸಾಧನಕ್ಕೆ ನೀಡಲಾಗದು."}
        </p>

        <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: "68ch", marginTop: 12 }}>
          {en
            ? "In production the parcel is written to the register at the moment the identity is issued, and this page shows its full public record — planting, census, survival and the evidence behind each."
            : "ಉತ್ಪಾದನೆಯಲ್ಲಿ ಗುರುತು ನೀಡಿದ ಕ್ಷಣವೇ ಜಮೀನು ನೋಂದಣಿಗೆ ದಾಖಲಾಗುತ್ತದೆ, ಮತ್ತು ಈ ಪುಟ ಅದರ ಪೂರ್ಣ ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯನ್ನು ತೋರಿಸುತ್ತದೆ — ನೆಡುವಿಕೆ, ಗಣತಿ, ಉಳಿವು ಮತ್ತು ಪ್ರತಿಯೊಂದರ ಸಾಕ್ಷ್ಯ."}
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

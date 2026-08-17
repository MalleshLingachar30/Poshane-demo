"use client";

import { useDemo } from "@/components/DemoContext";
import ProgrammeMap from "@/components/ProgrammeMap";

export default function MapPage() {
  const { lang } = useDemo();
  const en = lang === "en";
  return (
    <main>
      <h1 className="page">{en ? "Where the programme is" : "ಕಾರ್ಯಕ್ರಮ ಎಲ್ಲಿದೆ"}</h1>
      <p className="lede" style={{ maxWidth: "60ch" }}>
        {en
          ? "Every planted site in the register, by district. Select a district to see its taluks, its agro-climatic zones and the sites themselves."
          : "ದಾಖಲೆಯಲ್ಲಿರುವ ಪ್ರತಿ ನೆಟ್ಟ ಸ್ಥಳವೂ ಜಿಲ್ಲೆವಾರು. ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ತಾಲ್ಲೂಕುಗಳು, ಕೃಷಿ-ಹವಾಮಾನ ವಲಯಗಳು ಮತ್ತು ಸ್ಥಳಗಳನ್ನು ನೋಡಿ."}
      </p>
      <ProgrammeMap />
    </main>
  );
}

"use client";

import { useDemo } from "@/components/DemoContext";
import EvidenceSpecimen from "@/components/EvidenceSpecimen";
import SatellitePair from "@/components/SatellitePair";
import VisitLinkage from "@/components/VisitLinkage";
import { VISITS } from "@/lib/satellite";
import type { PassResult } from "@/lib/passes";

/**
 * The client half of the evidence page. Split out so the page itself can stay
 * a server component and do the catalogue fetch while the page is generated,
 * rather than making every visitor wait on a request to ESA.
 */
export default function EvidenceView({ passes }: { passes: PassResult }) {
  const { lang } = useDemo();
  const en = lang === "en";

  return (
    <main>
      <h1 className="page">
        {en ? "What evidence looks like" : "ಸಾಕ್ಷ್ಯ ಹೇಗಿರುತ್ತದೆ"}
      </h1>
      <EvidenceSpecimen />
      <SatellitePair passes={passes} />
      {passes.ok && <VisitLinkage visits={VISITS} passes={passes.passes} />}
    </main>
  );
}

import EvidenceView from "@/components/EvidenceView";
import { getPasses } from "@/lib/passes";

export default function EvidencePage() {
  return <EvidenceView passes={getPasses()} />;
}

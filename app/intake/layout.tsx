import "./intake.css";
import IntakeShell from "@/components/IntakeShell";

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <IntakeShell>{children}</IntakeShell>;
}

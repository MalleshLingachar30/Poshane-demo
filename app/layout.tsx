import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/components/DemoContext";
import { ProgrammeProvider } from "@/components/ProgrammeStore";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Poshane — Command & Control Center (demonstration)",
  description:
    "Demonstration build of the Poshane Command & Control Center for the KSLSA Five Crore Sapling Plantation & Lake Rejuvenation Programme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <ProgrammeProvider>
          <div className="shell">
            <Header />
            {children}
          </div>
          </ProgrammeProvider>
        </DemoProvider>
      </body>
    </html>
  );
}

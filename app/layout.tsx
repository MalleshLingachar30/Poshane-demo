import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/components/DemoContext";
import { ProgrammeProvider } from "@/components/ProgrammeStore";
import Header from "@/components/Header";

export const viewport = {
  themeColor: "#1C5A33",
  // the capture screen uses 16px inputs so iOS does not zoom on focus; this
  // stops a pinch from leaving an officer stuck at 3x in the sun
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Poshane — Command & Control Center (demonstration)",
  description:
    "Demonstration build of the Poshane Command & Control Center for the KSLSA Five Crore Sapling Plantation & Lake Rejuvenation Programme.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Poshane" },
  icons: { apple: "/icons/apple-touch-icon.png" },
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

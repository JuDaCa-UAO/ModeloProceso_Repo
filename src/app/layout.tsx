import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI TECH-ED",
  description: "Demo del modelo de proceso",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

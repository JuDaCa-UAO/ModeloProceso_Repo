import "./globals.css";
import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";

const techFont = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-tech",
});

export const metadata: Metadata = {
  title: "AI TECH-ED",
  description: "Demo del modelo de proceso",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={techFont.variable}>{children}</body>
    </html>
  );
}

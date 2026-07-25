import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AccessibilityProvider } from "@/presentation/providers/AccessibilityContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title:
    "Cartilla Web: modelo de proceso para la alfabetización digital de docentes en el uso y apropiación de GenAI",
  description:
    "Cartilla Web y modelo de proceso para la alfabetización digital de docentes en el uso y apropiación de GenAI. Universidad Autónoma de Occidente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${dmSans.className} ${dmSans.variable}`}>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}

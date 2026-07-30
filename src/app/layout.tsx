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
    // `dmSans.variable` va en <html> y no en <body>: `--uao-font-sans` y
    // `--font-tech` se declaran en `:root` (= <html>) y sustituyen
    // `var(--font-dm-sans)`. Con la clase en <body>, esa variable no existía en
    // `:root`, las dos custom properties quedaban inválidas en tiempo de
    // cómputo y arrastraban consigo cada shorthand `font:` que las usaba —los
    // elementos afectados caían al 18px/400 heredado del <body> en vez de su
    // tamaño y peso de diseño.
    <html lang="es" className={dmSans.variable}>
      <body className={dmSans.className}>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}

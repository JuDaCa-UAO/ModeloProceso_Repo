import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { VolumeProvider } from "@/context/VolumeContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";

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
      <head>
        {/* Abre conexiones TCP+TLS con los dominios de YouTube antes de que
            cualquier componente solicite el iframe_api o el embed. */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://s.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        {/* Resuelve DNS para miniaturas sin abrir conexión completa */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {/* Descarga el script de la IFrame API en paralelo con el HTML */}
        <link rel="preload" as="script" href="https://www.youtube.com/iframe_api" />
      </head>
      <body className={`${dmSans.className} ${dmSans.variable}`}>
        <VolumeProvider><AccessibilityProvider>{children}</AccessibilityProvider></VolumeProvider>
      </body>
    </html>
  );
}

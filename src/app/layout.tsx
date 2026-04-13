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
      <head>
        {/* Abre conexiones TCP+TLS con los dominios de YouTube antes de que
            cualquier componente solicite el iframe_api o el embed. */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        {/* Resuelve DNS para miniaturas sin abrir conexión completa */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {/* Descarga el script de la IFrame API en paralelo con el HTML */}
        <link rel="preload" as="script" href="https://www.youtube.com/iframe_api" />
      </head>
      <body className={techFont.variable}>{children}</body>
    </html>
  );
}

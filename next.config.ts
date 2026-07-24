import type { NextConfig } from "next";
import { N8N_HOST } from "./src/infrastructure/n8n/n8n.config";

// Host externo de multimedia (infografías SVG, Matriz de Pugh PDF, videos de etapa).
// Vacío hasta definirse; al configurarlo se habilita en el CSP automáticamente.
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

const ContentSecurityPolicy = [
  `default-src 'self'`,
  // youtube.com needed for the IFrame API script (iframe_api.js)
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  // i.ytimg.com for YouTube thumbnails; MEDIA_BASE for hosted infographics (SVG/img)
  `img-src 'self' blob: data: https://i.ytimg.com ${MEDIA_BASE}`,
  // MEDIA_BASE for hosted stage videos
  `media-src 'self' ${MEDIA_BASE}`,
  // youtube-nocookie.com for the privacy-enhanced YouTube embed iframe
  `frame-src 'self' ${N8N_HOST} https://www.youtube-nocookie.com`,
  // YouTube may issue XHR/fetch requests; MEDIA_BASE for fetching hosted assets
  `connect-src 'self' ${N8N_HOST} ${MEDIA_BASE} https://www.youtube.com https://www.youtube-nocookie.com`,
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy.replace(/\n/g, "") },
  // Instruye al browser para abrir conexiones con YouTube antes de parsear el HTML.
  // Llega antes que cualquier <link> del <head>, reduciendo la latencia del primer frame.
  {
    // Solo preconnect/dns-prefetch (sin preload): el preload del iframe_api se
    // disparaba en todas las rutas y avisaba "preloaded but not used" donde no hay
    // reproductor de YouTube. El IFrame API se sigue cargando bajo demanda.
    key: "Link",
    value: [
      "<https://www.youtube-nocookie.com>; rel=preconnect",
      "<https://www.youtube.com>; rel=preconnect; crossorigin",
      "<https://i.ytimg.com>; rel=dns-prefetch",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF primero (más pequeño que webp); Next cae a webp si el navegador no lo soporta.
    formats: ["image/avif", "image/webp"],
    // Las variantes optimizadas son inmutables (dependen de la URL fuente):
    // caché larga en Vercel para no re-optimizar en cada visita.
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      {
        source: "/media/etapa-2/Matriz-de-Pugh.pdf",
        destination: "/media/descargables/etapa-2/matriz-pugh/matriz-pugh.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-3/Canvas-de-diseno.pdf",
        destination: "/media/descargables/etapa-3/canvas-diseno/canvas-etapa-3-diseno.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-3/Canvas_etapa3.png",
        destination: "/media/descargables/etapa-3/canvas-diseno/preview-canvas-etapa-3-diseno.png",
        permanent: true,
      },
      {
        source: "/media/etapa-4/descargas/Canvas-de-alistamiento-GenAI.pdf",
        destination: "/media/descargables/etapa-4/canvas-alistamiento/canvas-etapa-4-alistamiento.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-6/descargas/Canvas-de-evaluacion-GenAI.pdf",
        destination: "/media/descargables/etapa-6/canvas-evaluacion/canvas-etapa-6-evaluacion.pdf",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

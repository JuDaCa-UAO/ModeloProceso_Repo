import type { NextConfig } from "next";
import { N8N_HOST } from "./src/infrastructure/n8n/n8n.config";

// Host externo de multimedia (infografías SVG, Matriz de Pugh PDF, videos de etapa).
// Vacío hasta definirse; al configurarlo se habilita en el CSP automáticamente.
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

const ContentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  // MEDIA_BASE habilita infografías alojadas fuera de la aplicación.
  `img-src 'self' blob: data: ${MEDIA_BASE}`,
  // MEDIA_BASE for hosted stage videos
  `media-src 'self' ${MEDIA_BASE}`,
  `frame-src 'self' ${N8N_HOST}`,
  `connect-src 'self' ${N8N_HOST} ${MEDIA_BASE}`,
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy.replace(/\n/g, "") },
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
        source: "/media/descargables/etapa-2/matriz-pugh/matriz-pugh.pdf",
        destination: "/media/etapa-2/descargables/matriz-pugh/matriz-pugh.pdf",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-2/matriz-pugh/preview-matriz-pugh.png",
        destination: "/media/etapa-2/descargables/matriz-pugh/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-3/canvas-diseno/canvas-etapa-3-diseno.pdf",
        destination: "/media/etapa-3/descargables/canvas-diseno/canvas-diseno.pdf",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-3/canvas-diseno/preview-canvas-etapa-3-diseno.png",
        destination: "/media/etapa-3/descargables/canvas-diseno/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-3/matriz-experiencia/matriz-de-la-experiencia.pdf",
        destination: "/media/etapa-3/descargables/matriz-experiencia/matriz-experiencia.pdf",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-3/matriz-experiencia/preview-matriz-de-la-experiencia.png",
        destination: "/media/etapa-3/descargables/matriz-experiencia/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-4/canvas-alistamiento/canvas-etapa-4-alistamiento.pdf",
        destination: "/media/etapa-4/descargables/canvas-alistamiento/canvas-alistamiento.pdf",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-4/canvas-alistamiento/preview-canvas-etapa-4-alistamiento.png",
        destination: "/media/etapa-4/descargables/canvas-alistamiento/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-6/canvas-evaluacion/canvas-etapa-6-evaluacion.pdf",
        destination: "/media/etapa-6/descargables/canvas-evaluacion/canvas-evaluacion.pdf",
        permanent: true,
      },
      {
        source: "/media/descargables/etapa-6/canvas-evaluacion/preview-canvas-etapa-6-evaluacion.png",
        destination: "/media/etapa-6/descargables/canvas-evaluacion/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/etapa-2/Matriz-de-Pugh.pdf",
        destination: "/media/etapa-2/descargables/matriz-pugh/matriz-pugh.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-3/Canvas-de-diseno.pdf",
        destination: "/media/etapa-3/descargables/canvas-diseno/canvas-diseno.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-3/Canvas_etapa3.png",
        destination: "/media/etapa-3/descargables/canvas-diseno/vista-previa.png",
        permanent: true,
      },
      {
        source: "/media/etapa-4/descargas/Canvas-de-alistamiento-GenAI.pdf",
        destination: "/media/etapa-4/descargables/canvas-alistamiento/canvas-alistamiento.pdf",
        permanent: true,
      },
      {
        source: "/media/etapa-6/descargas/Canvas-de-evaluacion-GenAI.pdf",
        destination: "/media/etapa-6/descargables/canvas-evaluacion/canvas-evaluacion.pdf",
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

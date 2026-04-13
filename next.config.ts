import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  `default-src 'self'`,
  // youtube.com needed for the IFrame API script (iframe_api.js)
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  // i.ytimg.com for YouTube video thumbnails rendered inside the player
  `img-src 'self' blob: data: https://i.ytimg.com`,
  `media-src 'self'`,
  // youtube-nocookie.com for the privacy-enhanced YouTube embed iframe
  `frame-src 'self' ${process.env.NEXT_PUBLIC_N8N_BASE_URL ?? ""} https://www.youtube-nocookie.com`,
  // YouTube may issue XHR/fetch requests from the player for metadata
  `connect-src 'self' ${process.env.NEXT_PUBLIC_N8N_BASE_URL ?? ""} https://www.youtube.com https://www.youtube-nocookie.com`,
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
    key: "Link",
    value: [
      "<https://www.youtube-nocookie.com>; rel=preconnect",
      "<https://www.youtube.com>; rel=preconnect; crossorigin",
      "<https://i.ytimg.com>; rel=dns-prefetch",
      "<https://www.youtube.com/iframe_api>; rel=preload; as=script",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
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

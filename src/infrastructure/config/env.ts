/**
 * INFRASTRUCTURE — Config
 *
 * env.ts: acceso tipado y centralizado a todas las variables de entorno.
 *
 * Por qué aquí: process.env es infraestructura. Si se usa directamente
 * en componentes o use cases, acopla el negocio al entorno de despliegue.
 * Al centralizarlo aquí, el resto del código importa desde este módulo.
 *
 * Convención: NEXT_PUBLIC_* para variables expuestas al cliente (browser).
 *             Variables sin prefijo solo están disponibles server-side.
 */

export const ENV = {
  /** Nombre del entorno de despliegue. */
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",

  /** Habilita logging verbose en la consola. */
  VERBOSE_LOGGING:
    process.env.NEXT_PUBLIC_VERBOSE_LOGGING === "true" ||
    process.env.NEXT_PUBLIC_APP_ENV === "development",

  /**
   * Base del CDN genérico de multimedia (misma variable que ya usa
   * `next.config.ts` para el CSP — no se duplica bajo otro nombre).
   * Vacía hasta que exista un host configurado.
   */
  MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "",

  /** URL pública de Cloudflare R2 (adaptador `CloudflareR2Adapter`, aún sin bucket real). */
  CLOUDFLARE_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL ?? "",

  /** Customer code de Cloudflare Stream (adaptador `CloudflareStreamAdapter`, aún sin cuenta real). */
  CLOUDFLARE_STREAM_CUSTOMER_CODE: process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE ?? "",

  /** Account hash de Cloudflare Images (adaptador `CloudflareImagesAdapter`, aún sin cuenta real). */
  CLOUDFLARE_IMAGES_ACCOUNT_HASH: process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH ?? "",
} as const;

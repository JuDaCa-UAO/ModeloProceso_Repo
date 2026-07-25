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
  /**
   * Base del CDN genérico de multimedia (misma variable que ya usa
   * `next.config.ts` para el CSP — no se duplica bajo otro nombre).
   * Vacía hasta que exista un host configurado.
   */
  MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "",
} as const;

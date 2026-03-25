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
  /** URL base de la instancia de N8N (usada en CSP y en adapters). */
  N8N_BASE_URL: process.env.NEXT_PUBLIC_N8N_BASE_URL ?? "https://n8n.srv1512853.hstgr.cloud",

  /** ID del formulario de autodiagnóstico en N8N. */
  N8N_AUTODIAG_FORM_ID: process.env.NEXT_PUBLIC_N8N_AUTODIAG_FORM_ID ?? "130fca67-74d5-4a0e-90a2-f2bd133bfb59",

  /** Nombre del entorno de despliegue. */
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",

  /** Habilita logging verbose en la consola. */
  VERBOSE_LOGGING:
    process.env.NEXT_PUBLIC_VERBOSE_LOGGING === "true" ||
    process.env.NEXT_PUBLIC_APP_ENV === "development",
} as const;

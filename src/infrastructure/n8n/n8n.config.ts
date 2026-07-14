/**
 * INFRASTRUCTURE — N8N Config
 *
 * Único archivo donde vive la URL del formulario de autodiagnóstico de N8N.
 * La instancia es fija (no varía por entorno), por lo que se declara como
 * constante literal en vez de variable de entorno.
 */

export const N8N_HOST = "https://n8n.srv1512853.hstgr.cloud";

/** URL completa del formulario de autodiagnóstico de Etapa 1. */
export const N8N_AUTODIAGNOSTIC_FORM_URL = `${N8N_HOST}/form/130fca67-74d5-4a0e-90a2-f2bd133bfb59`;

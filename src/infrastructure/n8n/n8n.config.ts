/**
 * INFRASTRUCTURE — N8N Config
 *
 * Único archivo donde viven las URLs y endpoints de N8N.
 * ANTES: la URL del formulario estaba hardcodeada en Etapa1Client.tsx (error crítico).
 * AHORA: configurado desde variables de entorno, con fallback explícito.
 *
 * Al mover esto a Infrastructure, podemos:
 *  - Cambiar la URL sin tocar código de presentación.
 *  - Usar diferentes instancias de N8N por entorno (dev/staging/prod).
 *  - Mockear el adapter en tests de integración.
 */

import { ENV } from "../config/env";

export const N8N_CONFIG = {
  /** URL base de la instancia de N8N. */
  baseUrl: ENV.N8N_BASE_URL,

  forms: {
    /** URL completa del formulario de autodiagnóstico de Etapa 1. */
    autodiagnostic: `${ENV.N8N_BASE_URL}/form/${ENV.N8N_AUTODIAG_FORM_ID}`,
  },
} as const;

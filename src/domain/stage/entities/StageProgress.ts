/**
 * DOMAIN — Entity
 *
 * Estado de progreso de un docente dentro de una etapa.
 * Solo contiene campos activamente usados por el motor de frames.
 * No importa React ni ningún framework.
 */

export type Stage1ProgressState = {
  /** Cuántos frames han sido completados en la etapa. */
  completedFrames: number;
  /** El docente aceptó que no es evaluación administrativa (Frame 6). */
  consentAdmin: boolean;
  /** El docente aceptó el uso de sus respuestas (Frame 6). */
  consentUsage: boolean;
  /** Correo del docente para envío de resultado (PII — cifrar en producción). */
  email: string;
  /** El docente confirmó haber completado el autodiagnóstico (Frame 8). */
  autodiagnosticCompleted: boolean;
};

export const STAGE1_PROGRESS_DEFAULT: Stage1ProgressState = {
  completedFrames: 0,
  consentAdmin: false,
  consentUsage: false,
  email: "",
  autodiagnosticCompleted: false,
};

/**
 * Coerce seguro: convierte un objeto arbitrario (deserializado de JSON)
 * en un Stage1ProgressState bien tipado. Tolera datos de versiones anteriores.
 */
export function coerceStage1Progress(raw: unknown): Stage1ProgressState {
  if (!raw || typeof raw !== "object") return { ...STAGE1_PROGRESS_DEFAULT };
  const v = raw as Record<string, unknown>;

  const frames = typeof v.completedFrames === "number" ? v.completedFrames : 0;

  return {
    completedFrames: isNaN(frames) || frames < 0 ? 0 : frames,
    consentAdmin: Boolean(v.consentAdmin),
    consentUsage: Boolean(v.consentUsage),
    email: typeof v.email === "string" ? v.email : "",
    autodiagnosticCompleted: Boolean(v.autodiagnosticCompleted),
  };
}

/**
 * DOMAIN — Entity
 *
 * Estado de progreso mutable de un docente dentro de la Etapa 1.
 * Representa el modelo de datos canónico. No contiene lógica de negocio
 * (esa vive en las Rules). No importa React ni ningún framework.
 *
 * Depende de: HierarchyLevel (value object del mismo dominio).
 */

import type { StageResultId } from "../value-objects/HierarchyLevel";

export type Stage1ProgressState = {
  /** La animación de introducción comenzó a reproducirse. */
  stage1AnimationStarted: boolean;
  /** La animación de introducción fue vista completa (habilita el resto). */
  stage1AnimationViewed: boolean;
  /** El docente aceptó que no es evaluación administrativa. */
  consentAdmin: boolean;
  /** El docente aceptó el uso de sus respuestas para generar resultado. */
  consentUsage: boolean;
  /** Correo para enviar resultado (PII — cifrar antes de persistir en producción). */
  email: string;
  /** El módulo de autodiagnóstico fue abierto/iniciado. */
  autodiagnosticStarted: boolean;
  /** El docente confirmó haber completado el autodiagnóstico. */
  autodiagnosticCompleted: boolean;
  /** ID del nivel jerárquico resultante del diagnóstico. */
  resultStateId: StageResultId;
  /** La animación de transición E1→E2 fue vista completa. */
  transitionAnimationViewed: boolean;
};

/** Estado inicial/default — sin efectos secundarios. */
export const STAGE1_PROGRESS_DEFAULT: Stage1ProgressState = {
  stage1AnimationStarted: false,
  stage1AnimationViewed: false,
  consentAdmin: false,
  consentUsage: false,
  email: "",
  autodiagnosticStarted: false,
  autodiagnosticCompleted: false,
  resultStateId: "intermedio",
  transitionAnimationViewed: false,
};

/**
 * Coerce seguro: convierte un objeto arbitrario (p.ej. deserializado de JSON)
 * en un Stage1ProgressState bien tipado, con defaults para campos faltantes.
 * Puro, sin efectos secundarios.
 */
export function coerceStage1Progress(raw: unknown): Stage1ProgressState {
  if (!raw || typeof raw !== "object") return STAGE1_PROGRESS_DEFAULT;
  const v = raw as Partial<Stage1ProgressState>;
  return {
    stage1AnimationStarted: Boolean(v.stage1AnimationStarted),
    stage1AnimationViewed: Boolean(v.stage1AnimationViewed),
    consentAdmin: Boolean(v.consentAdmin),
    consentUsage: Boolean(v.consentUsage),
    email: typeof v.email === "string" ? v.email : "",
    autodiagnosticStarted: Boolean(v.autodiagnosticStarted),
    autodiagnosticCompleted: Boolean(v.autodiagnosticCompleted),
    resultStateId:
      v.resultStateId === "inicial" ||
      v.resultStateId === "intermedio" ||
      v.resultStateId === "avanzado"
        ? v.resultStateId
        : "intermedio",
    transitionAnimationViewed: Boolean(v.transitionAnimationViewed),
  };
}

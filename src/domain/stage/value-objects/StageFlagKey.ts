/**
 * DOMAIN — Value Object
 *
 * Identifiers de hitos de progreso dentro de una etapa.
 * Son flags booleanos derivados del estado raw; no se persisten directamente
 * como flags sino que se computan via EvaluateFlagsUseCase.
 *
 * Depende de: nada (puro TypeScript, sin imports externos).
 */

export type StageFlagKey =
  | "stage1AnimationViewed"
  | "consentValidated"
  | "autodiagnosticStarted"
  | "autodiagnosticCompleted"
  | "intentionSaved"
  | "transitionAnimationViewed";

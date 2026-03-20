/**
 * APPLICATION — Use Case
 *
 * EvaluateFlagsUseCase: computa el mapa de flags derivados
 * a partir del estado raw de progreso de Stage 1.
 *
 * Esta lógica vivía antes en el hook `useStageProgress` (capa de presentación),
 * lo cual la hacía intestable sin montar componentes. Ahora es una función
 * pura de la capa Application.
 *
 * Depende de: ConsentRule, StageFlagKey, Stage1ProgressState (todas del dominio).
 */

import { evaluateConsent } from "@domain/stage/rules/ConsentRule";
import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";

/**
 * Retorna el mapa completo de flags booleanos derivados del estado actual.
 * Función pura — dado el mismo estado, siempre retorna el mismo mapa.
 *
 * @example
 * const flags = evaluateFlags(state);
 * if (flags.consentValidated) { // habilitar autodiagnóstico }
 */
export function evaluateFlags(
  state: Stage1ProgressState
): Record<StageFlagKey, boolean> {
  return {
    stage1AnimationViewed: state.stage1AnimationViewed,
    consentValidated: evaluateConsent(state),
    autodiagnosticStarted: state.autodiagnosticStarted,
    autodiagnosticCompleted: state.autodiagnosticCompleted,
    transitionAnimationViewed: state.transitionAnimationViewed,
  };
}

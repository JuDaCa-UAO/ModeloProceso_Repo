/**
 * DOMAIN — Rule
 *
 * LaiaContextRule: función pura que determina el estado de ánimo (mood)
 * de Laia a partir del progreso del docente.
 *
 * Esta regla centraliza la lógica de presentación del personaje.
 * Sin ella, la lógica estaría dispersa en múltiples componentes.
 *
 * Depende de: ChatbotContext, StageFlagKey, HierarchyLevel.
 */

import type { LaiaMood } from "../entities/ChatbotContext";
import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";
import type { StageResultId } from "@domain/stage/value-objects/HierarchyLevel";
import { RESULT_TO_HIERARCHY } from "@domain/stage/value-objects/HierarchyLevel";
import type { ChatbotContext } from "../entities/ChatbotContext";

type ContextInput = {
  currentStageId: string;
  resultId: StageResultId;
  completedFlags: StageFlagKey[];
  lastCompletedFlag?: StageFlagKey;
};

/**
 * Deriva el ChatbotContext completo incluyendo el mood apropiado.
 * Regla pura — determinista, testeable sin mocks.
 */
export function deriveLaiaContext(input: ContextInput): ChatbotContext {
  const mood = deriveMood(input.completedFlags, input.lastCompletedFlag);

  return {
    currentStageId: input.currentStageId,
    hierarchyLevel: RESULT_TO_HIERARCHY[input.resultId],
    resultId: input.resultId,
    completedFlags: input.completedFlags,
    mood,
    lastCompletedFlag: input.lastCompletedFlag,
  };
}

function deriveMood(
  completedFlags: StageFlagKey[],
  lastFlag?: StageFlagKey
): LaiaMood {
  if (lastFlag === "transitionAnimationViewed") return "triumphant";
  if (lastFlag === "autodiagnosticCompleted") return "holo";
  if (completedFlags.length === 0) return "neutral";
  if (!completedFlags.includes("consentValidated")) return "explain";
  return "neutral";
}

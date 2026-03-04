/**
 * APPLICATION — Use Case
 *
 * BuildLaiaContextUseCase: construye el ChatbotContext completo de Laia
 * a partir del estado de progreso actual del docente.
 *
 * Este use case conecta el dominio de "progreso de etapa" con el dominio
 * de "chatbot", manteniendo ambos dominios desacoplados entre sí.
 *
 * Depende de: deriveLaiaContext (domain rule), EvaluateFlagsUseCase,
 * Stage1ProgressState (domain entity).
 */

import { deriveLaiaContext } from "@domain/chatbot/rules/LaiaContextRule";
import { evaluateFlags } from "@application/stage/usecases/EvaluateFlagsUseCase";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";
import type { ChatbotContext } from "@domain/chatbot/entities/ChatbotContext";
import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";

export class BuildLaiaContextUseCase {
  /**
   * Construye el contexto completo de Laia desde el estado actual de progreso.
   * Determina el mood, el nivel jerárquico y los flags completados.
   */
  execute(stageId: string, progressState: Stage1ProgressState): ChatbotContext {
    const flags = evaluateFlags(progressState);

    const completedFlags = (Object.entries(flags) as [StageFlagKey, boolean][])
      .filter(([, active]) => active)
      .map(([key]) => key);

    const lastCompletedFlag = completedFlags.at(-1);

    return deriveLaiaContext({
      currentStageId: stageId,
      resultId: progressState.resultStateId,
      completedFlags,
      lastCompletedFlag,
    });
  }
}

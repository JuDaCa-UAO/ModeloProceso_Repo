/**
 * DOMAIN — Entity
 *
 * ChatbotContext: estado contextual de Laia en un momento dado.
 * Determina qué avatar mostrar y cómo personalizar los mensajes.
 *
 * Depende de: StageFlagKey, HierarchyLevel (value objects del dominio).
 */

import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";
import type { HierarchyLevel, StageResultId } from "@domain/stage/value-objects/HierarchyLevel";

/** Los estados de ánimo de Laia y su asset visual correspondiente. */
export type LaiaMood = "neutral" | "explain" | "holo" | "triumphant" | "confused";

export type ChatbotContext = {
  /** ID de la etapa activa en el momento de evaluar el contexto. */
  currentStageId: string;
  /** Nivel del docente determinado por el autodiagnóstico. */
  hierarchyLevel: HierarchyLevel;
  /** ID del resultado para acceder a datos específicos del nivel. */
  resultId: StageResultId;
  /** Flags completados hasta el momento actual. */
  completedFlags: StageFlagKey[];
  /** Estado de ánimo calculado para Laia según el contexto. */
  mood: LaiaMood;
  /** Última acción significativa del usuario (para personalizar siguiente mensaje). */
  lastCompletedFlag?: StageFlagKey;
};

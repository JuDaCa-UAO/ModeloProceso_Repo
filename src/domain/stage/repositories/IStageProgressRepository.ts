/**
 * DOMAIN — Repository Interface (Port)
 *
 * Define el CONTRATO para leer y escribir el progreso de una etapa.
 * No contiene ninguna implementación (eso es responsabilidad de Infrastructure).
 *
 * Por qué aquí: el Dominio dicta qué necesita, la Infraestructura lo provee.
 * Esto invierte la dependencia y permite testear con mocks sin tocar localStorage.
 *
 * Depende de: Stage1ProgressState (entity del mismo dominio).
 */

import type { Stage1ProgressState } from "../entities/StageProgress";

export interface IStageProgressRepository {
  /** Lee el estado de progreso actual. Retorna null si no existe. */
  read(stageId: string): Stage1ProgressState | null;

  /** Persiste el estado completo de progreso. */
  write(stageId: string, state: Stage1ProgressState): void;

  /** Elimina el progreso almacenado (reset). */
  clear(stageId: string): void;
}

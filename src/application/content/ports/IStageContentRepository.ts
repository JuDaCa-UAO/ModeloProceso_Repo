/**
 * APPLICATION — Port
 *
 * Fuente del contenido de la Cartilla. Intercambiable (estático hoy; API/CMS
 * más adelante, ver plan de rework §19) sin tocar la presentación.
 */
import type { Cartilla } from "@domain/content/Cartilla";
import type { Stage } from "@domain/content/Stage";
import type { NumberedStageId } from "@domain/content/value-objects/StageId";

export interface IStageContentRepository {
  getCartilla(): Cartilla;
  getStage(id: NumberedStageId): Stage | null;
  listStageIds(): NumberedStageId[];
}

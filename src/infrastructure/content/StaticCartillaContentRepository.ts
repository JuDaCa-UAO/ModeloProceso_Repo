/**
 * INFRASTRUCTURE — Adapter (implementa IStageContentRepository)
 *
 * Fuente estática de la Cartilla. Los datos viven junto al adaptador en
 * `infrastructure/content/data`.
 */
import type { IStageContentRepository } from "@application/content/ports/IStageContentRepository";
import type { Cartilla } from "@domain/content/Cartilla";
import type { Stage } from "@domain/content/Stage";
import type { NumberedStageId } from "@domain/content/value-objects/StageId";
import { INTRO_COVER, INTRO_LAIA_MESSAGES, INTRO_SECTIONS, INTRO_TRANSITION } from "./data/intro";
import { FACTORES_RECTORES } from "./data/factores";
import { FINAL_CLOSING } from "./data/closing";
import { STAGE_1 } from "./data/stage-1";
import { STAGE_2 } from "./data/stage-2";
import { STAGE_3 } from "./data/stage-3";
import { STAGE_4 } from "./data/stage-4";
import { STAGE_5 } from "./data/stage-5";
import { STAGE_6 } from "./data/stage-6";

const STAGES: Stage[] = [STAGE_1, STAGE_2, STAGE_3, STAGE_4, STAGE_5, STAGE_6];

export class StaticCartillaContentRepository implements IStageContentRepository {
  getCartilla(): Cartilla {
    return {
      introCover: INTRO_COVER,
      introLaia: INTRO_LAIA_MESSAGES,
      introSections: INTRO_SECTIONS,
      introTransition: INTRO_TRANSITION,
      stages: STAGES,
      factoresRectores: FACTORES_RECTORES,
      finalClosing: FINAL_CLOSING,
    };
  }

  getStage(id: NumberedStageId): Stage | null {
    return STAGES.find((stage) => stage.id === id) ?? null;
  }

  listStageIds(): NumberedStageId[] {
    return STAGES.map((stage) => stage.id);
  }
}

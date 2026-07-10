/**
 * INFRASTRUCTURE — Adapter (implementa IStageContentRepository)
 *
 * Fuente estática (archivos TS en `content/cartilla/`) de la Cartilla. Las
 * seis etapas están migradas (Fase 8); ver `contexto/context.md`.
 */
import type { IStageContentRepository } from "@application/content/ports/IStageContentRepository";
import type { Cartilla } from "@domain/content/Cartilla";
import type { Stage } from "@domain/content/Stage";
import type { NumberedStageId } from "@domain/content/value-objects/StageId";
import { INTRO_COVER, INTRO_LAIA_MESSAGES, INTRO_SECTIONS, INTRO_TRANSITION } from "@/content/cartilla/intro";
import { FACTORES_RECTORES } from "@/content/cartilla/factores";
import { FINAL_CLOSING } from "@/content/cartilla/closing";
import { STAGE_1 } from "@/content/cartilla/stage-1";
import { STAGE_2 } from "@/content/cartilla/stage-2";
import { STAGE_3 } from "@/content/cartilla/stage-3";
import { STAGE_4 } from "@/content/cartilla/stage-4";
import { STAGE_5 } from "@/content/cartilla/stage-5";
import { STAGE_6 } from "@/content/cartilla/stage-6";

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

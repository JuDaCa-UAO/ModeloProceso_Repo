"use client";

/**
 * PRESENTATION — Etapa 2 (Descubre nuevas posibilidades)
 *
 * Vista delgada: delega todo el render en el motor dirigido por datos
 * (`StageRenderer`) consumiendo la definición `STAGE2_DISCOVER_TREE`.
 * No contiene JSX específico de la etapa ni una rama gigante por `stageId`.
 */

import StageRenderer from "../engine/StageRenderer";
import { STAGE2_DISCOVER_TREE } from "@/content/stages/stage-2.content";
import type { StageFramesProps } from "../shared/StageFramesProps";

export default function Stage2Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <StageRenderer
      stageId={stageId}
      tree={STAGE2_DISCOVER_TREE}
      completedFrames={completedFrames}
      completeFrame={completeFrame}
      pushToast={pushToast}
      notifiedFrames={notifiedFrames}
    />
  );
}

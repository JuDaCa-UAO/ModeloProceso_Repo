"use client";

/**
 * PRESENTATION — Etapa 4 (Prepara el terreno para el éxito)
 *
 * Vista delgada: delega todo el render en el motor dirigido por datos
 * (`StageRenderer`) consumiendo la definición `STAGE4_PREPARE_TREE`.
 * No contiene JSX específico de la etapa ni una rama gigante por `stageId`.
 */

import StageRenderer from "../engine/StageRenderer";
import { STAGE4_PREPARE_TREE } from "@/content/stages/stage-4.content";
import type { StageFramesProps } from "../shared/StageFramesProps";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";

export default function Stage4Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <>
      {completedFrames >= 1 && (
        <MiniSpiralViewer stageLabel="Etapa actual: Etapa 4" stageKey="etapa-4" />
      )}
      <StageRenderer
        stageId={stageId}
        tree={STAGE4_PREPARE_TREE}
        completedFrames={completedFrames}
        completeFrame={completeFrame}
        pushToast={pushToast}
        notifiedFrames={notifiedFrames}
      />
    </>
  );
}

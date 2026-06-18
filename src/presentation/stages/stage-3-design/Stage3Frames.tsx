"use client";

/**
 * PRESENTATION — Etapa 3 (Diseña con propósito)
 *
 * Vista delgada: delega todo el render en el motor dirigido por datos
 * (`StageRenderer`) consumiendo la definición `STAGE3_DESIGN_TREE`.
 * No contiene JSX específico de la etapa ni una rama gigante por `stageId`.
 */

import StageRenderer from "../engine/StageRenderer";
import { STAGE3_DESIGN_TREE } from "@/content/stages/stage-3.content";
import type { StageFramesProps } from "../shared/StageFramesProps";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";

export default function Stage3Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <>
      {completedFrames >= 1 && (
        <MiniSpiralViewer stageLabel="Etapa actual: Etapa 3" stageKey="etapa-3" />
      )}
      <StageRenderer
        stageId={stageId}
        tree={STAGE3_DESIGN_TREE}
        completedFrames={completedFrames}
        completeFrame={completeFrame}
        pushToast={pushToast}
        notifiedFrames={notifiedFrames}
      />
    </>
  );
}

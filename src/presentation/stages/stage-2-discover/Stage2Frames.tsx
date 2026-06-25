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
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";

export default function Stage2Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <>
      {completedFrames >= 1 && (
        <MiniSpiralViewer stageLabel="Etapa actual: Etapa 2" stageKey="etapa-2" />
      )}
      <StageRenderer
        stageId={stageId}
        tree={STAGE2_DISCOVER_TREE}
        completedFrames={completedFrames}
        completeFrame={completeFrame}
        pushToast={pushToast}
        notifiedFrames={notifiedFrames}
      />
    </>
  );
}

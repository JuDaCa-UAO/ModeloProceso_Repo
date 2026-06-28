"use client";

import StageRenderer from "../engine/StageRenderer";
import { STAGE6_REFLECT_TREE } from "@/content/stages/stage-6.content";
import type { StageFramesProps } from "../shared/StageFramesProps";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";

export default function Stage6Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <>
      {completedFrames >= 1 && (
        <MiniSpiralViewer stageLabel="Etapa actual: Etapa 6" stageKey="etapa-6" />
      )}
      <StageRenderer
        stageId={stageId}
        tree={STAGE6_REFLECT_TREE}
        completedFrames={completedFrames}
        completeFrame={completeFrame}
        pushToast={pushToast}
        notifiedFrames={notifiedFrames}
      />
    </>
  );
}

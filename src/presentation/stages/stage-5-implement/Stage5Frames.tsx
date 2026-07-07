"use client";

import StageRenderer from "../engine/StageRenderer";
import { STAGE5_IMPLEMENT_TREE } from "@/content/stages/stage-5.content";
import type { StageFramesProps } from "../shared/StageFramesProps";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";

export default function Stage5Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <>
      {completedFrames >= 1 && (
        <MiniSpiralViewer stageLabel="Etapa actual: Etapa 5" stageKey="etapa-5" />
      )}
      <StageRenderer
        stageId={stageId}
        tree={STAGE5_IMPLEMENT_TREE}
        completedFrames={completedFrames}
        completeFrame={completeFrame}
        pushToast={pushToast}
        notifiedFrames={notifiedFrames}
      />
    </>
  );
}

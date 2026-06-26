"use client";

import StageRenderer from "../engine/StageRenderer";
import { STAGE5_IMPLEMENT_TREE } from "@/content/stages/stage-5.content";
import type { StageFramesProps } from "../shared/StageFramesProps";

export default function Stage5Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  return (
    <StageRenderer
      stageId={stageId}
      tree={STAGE5_IMPLEMENT_TREE}
      completedFrames={completedFrames}
      completeFrame={completeFrame}
      pushToast={pushToast}
      notifiedFrames={notifiedFrames}
    />
  );
}

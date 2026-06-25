import type { MutableRefObject } from "react";

export type StageFramesProps = {
  stageId: string;
  completedFrames: number;
  completeFrame: (frameIndex: number) => void;
  pushToast: (text: string) => void;
  notifiedFrames: MutableRefObject<Set<number>>;
};

export type StageKey = "etapa-0" | "etapa-1";

export interface SequenceConfig {
  basePath: string;
  totalFrames: number;
  fps: number;
  posterFrame: number;
}

export const sequenceRegistry: Record<StageKey, SequenceConfig> = {
  "etapa-0": {
    basePath: "/spiral-seq/etapa-0",
    totalFrames: 120,
    fps: 30,
    posterFrame: 1,
  },
  "etapa-1": {
    basePath: "/spiral-seq/etapa-1",
    totalFrames: 120,
    fps: 30,
    posterFrame: 1,
  },
};

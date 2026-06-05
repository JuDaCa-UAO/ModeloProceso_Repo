export type StageKey = "introduccion" | "etapa-1";

export interface SequenceConfig {
  basePath: string;
  totalFrames: number;
  fps: number;
  posterFrame: number;
}

export const sequenceRegistry: Record<StageKey, SequenceConfig> = {
  "introduccion": {
    basePath: "/spiral-seq/introduccion",
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

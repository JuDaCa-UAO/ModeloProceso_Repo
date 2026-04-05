"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getSnapshot,
  getServerSnapshot,
  subscribe,
  patchStore,
  resetStore,
} from "@/lib/state/StageProgressStore";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";

/**
 * Hook que expone el progreso de una etapa desde el StageProgressStore.
 * Fuente de verdad única para completedFrames, consentimiento y autodiagnóstico.
 */
export function useStageProgress(stageId: string) {
  const state = useSyncExternalStore(
    (listener) => subscribe(stageId, listener),
    () => getSnapshot(stageId),
    getServerSnapshot,
  );

  const patch = useCallback(
    (partial: Partial<Stage1ProgressState>) => {
      patchStore(stageId, partial);
    },
    [stageId],
  );

  const reset = useCallback(() => {
    resetStore(stageId);
  }, [stageId]);

  return { state, patch, reset };
}

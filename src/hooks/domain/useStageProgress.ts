/**
 * PRESENTATION — Domain Hook
 *
 * useStageProgress: adaptador entre React y la capa de Application.
 * Conecta el StageProgressStore (estado reactivo) con EvaluateFlagsUseCase
 * (lógica de negocio) para exponer una interfaz limpia a los componentes.
 *
 * Este hook REEMPLAZA:
 *   - hooks/useStageProgress.ts (acoplado a etapa 1, con lógica de negocio inline)
 *   - lib/useProgress.ts (progreso global desacoplado)
 *
 * Al parametrizarse por stageId, el mismo hook funciona para todas las etapas.
 * La lógica de flags (que antes vivía en el hook) ahora vive en EvaluateFlagsUseCase.
 *
 * Depende de: StageProgressStore (estado), EvaluateFlagsUseCase (Application).
 */

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getSnapshot,
  getServerSnapshot,
  subscribe,
  patchStore,
  resetStore,
} from "@/lib/state/StageProgressStore";
import { evaluateFlags } from "@application/stage/usecases/EvaluateFlagsUseCase";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";
import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";

export function useStageProgress(stageId: string) {
  // useSyncExternalStore garantiza consistencia entre el server y el cliente
  const state = useSyncExternalStore<Stage1ProgressState>(
    useCallback((listener) => subscribe(stageId, listener), [stageId]),
    useCallback(() => getSnapshot(stageId), [stageId]),
    getServerSnapshot
  );

  /**
   * Flags derivados: calculados por EvaluateFlagsUseCase (capa Application),
   * no por lógica inline en este hook.
   */
  const flags = useMemo<Record<StageFlagKey, boolean>>(
    () => evaluateFlags(state),
    [state]
  );

  /**
   * Actualiza el estado del store con un patch parcial.
   * No contiene lógica de negocio — solo persiste vía el store.
   */
  const update = useCallback(
    (patch: Partial<Stage1ProgressState>) => {
      patchStore(stageId, patch);
    },
    [stageId]
  );

  /**
   * Resetea completamente el progreso de la etapa.
   */
  const reset = useCallback(() => {
    resetStore(stageId);
  }, [stageId]);

  return { state, flags, update, reset };
}

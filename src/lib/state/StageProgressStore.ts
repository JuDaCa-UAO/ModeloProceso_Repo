/**
 * PRESENTATION — State Store
 *
 * StageProgressStore: ÚNICA fuente de verdad para el progreso de todas las etapas.
 * Reemplaza dos implementaciones paralelas anteriores:
 *   - lib/progress.ts + lib/useProgress.ts (progreso global)
 *   - hooks/useStageProgress.ts (progreso específico de etapa 1)
 *
 * Implementa el patrón useSyncExternalStore con:
 *   - Caché en memoria para evitar deserialización en cada render
 *   - Event bus para notificaciones cross-tab y same-tab
 *   - Server snapshot seguro para SSR
 *
 * NO contiene lógica de negocio. Toda la lógica vive en Application/Domain.
 *
 * Depende de: LocalStorageProgressRepository, LocalStorageEventBus (Infrastructure).
 */

import {
  progressRepository,
  SERVER_SNAPSHOT,
} from "@infra/persistence/LocalStorageProgressRepository";
import { LocalStorageEventBus } from "@infra/persistence/LocalStorageEventBus";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";

// ─── Singleton del event bus ───────────────────────────────────────────────────
const eventBus = new LocalStorageEventBus();

// ─── Caché en memoria por stageId ─────────────────────────────────────────────
const snapshotCache = new Map<string, Stage1ProgressState>();

/**
 * Lee el snapshot actual de un stageId, usando caché para evitar
 * deserialización redundante en cada ciclo de render.
 */
export function getSnapshot(stageId: string): Stage1ProgressState {
  const cached = snapshotCache.get(stageId);
  const fromRepo = progressRepository.read(stageId);

  if (!fromRepo) {
    snapshotCache.set(stageId, SERVER_SNAPSHOT);
    return SERVER_SNAPSHOT;
  }

  // Comparación por referencia del JSON serializado para detectar cambios reales
  if (cached && JSON.stringify(cached) === JSON.stringify(fromRepo)) {
    return cached;
  }

  snapshotCache.set(stageId, fromRepo);
  return fromRepo;
}

/** Snapshot seguro para SSR — sin window, sin localStorage. */
export function getServerSnapshot(): Stage1ProgressState {
  return SERVER_SNAPSHOT;
}

/**
 * Suscripción al store para useSyncExternalStore.
 * Retorna la función de unsubscribe.
 */
export function subscribe(stageId: string, listener: () => void): () => void {
  return eventBus.subscribe(stageId, listener);
}

/**
 * Escribe un patch en el store y notifica a todos los suscriptores.
 * El patch es mezclado (shallow merge) con el estado actual.
 */
export function patchStore(
  stageId: string,
  patch: Partial<Stage1ProgressState>
): void {
  if (typeof window === "undefined") return;

  const current = progressRepository.read(stageId) ?? { ...SERVER_SNAPSHOT };
  const next: Stage1ProgressState = { ...current, ...patch };

  snapshotCache.set(stageId, next);
  progressRepository.write(stageId, next);
  eventBus.emit(stageId);
}

/**
 * Resetea completamente el estado de una etapa y notifica suscriptores.
 */
export function resetStore(stageId: string): void {
  if (typeof window === "undefined") return;

  snapshotCache.delete(stageId);
  progressRepository.clear(stageId);
  eventBus.emit(stageId);
}

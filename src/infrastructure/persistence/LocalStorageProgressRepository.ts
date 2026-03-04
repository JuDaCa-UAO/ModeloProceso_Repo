/**
 * INFRASTRUCTURE — Persistence
 *
 * LocalStorageProgressRepository: implementación concreta de IStageProgressRepository.
 * Persiste el progreso de cada etapa en localStorage bajo claves aisladas.
 *
 * Patrón de clave: "stage-progress-{stageId}-v1"
 * - El sufijo de versión permite migraciones sin colisiones (incrementar a -v2 etc.)
 * - Cada etapa tiene su propia clave → fácil de limpiar individualmente.
 *
 * Nota de seguridad: el campo `email` es PII. En producción, considerar
 * cifrado con Web Crypto API antes de persistir en localStorage.
 *
 * Depende de: IStageProgressRepository (dominio), Stage1ProgressState (dominio).
 */

import type { IStageProgressRepository } from "@domain/stage/repositories/IStageProgressRepository";
import {
  coerceStage1Progress,
  STAGE1_PROGRESS_DEFAULT,
} from "@domain/stage/entities/StageProgress";
import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";

const STORAGE_VERSION = "v1";

function storageKey(stageId: string): string {
  return `stage-progress-${stageId}-${STORAGE_VERSION}`;
}

export class LocalStorageProgressRepository implements IStageProgressRepository {
  read(stageId: string): Stage1ProgressState | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem(storageKey(stageId));
      if (!raw) return null;
      return coerceStage1Progress(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  write(stageId: string, state: Stage1ProgressState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey(stageId), JSON.stringify(state));
    } catch {
      // localStorage puede estar lleno o deshabilitado — falla silenciosamente
      console.warn(`[LocalStorageProgressRepository] No se pudo escribir progreso para ${stageId}`);
    }
  }

  clear(stageId: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storageKey(stageId));
  }
}

/** Singleton pre-instanciado para uso dentro de los hooks de presentación. */
export const progressRepository = new LocalStorageProgressRepository();

/** Estado default seguro para SSR (sin acceso a window). */
export const SERVER_SNAPSHOT: Stage1ProgressState = { ...STAGE1_PROGRESS_DEFAULT };

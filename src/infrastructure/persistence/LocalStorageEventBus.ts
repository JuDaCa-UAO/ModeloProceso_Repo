/**
 * INFRASTRUCTURE — Persistence
 *
 * LocalStorageEventBus: implementación concreta de IProgressEventBus.
 * Usa CustomEvent del DOM para notificar cambios cross-tab y en la misma pestaña.
 *
 * Por qué separar esto del repositorio: el repositorio maneja datos, el event bus
 * maneja notificaciones. Son responsabilidades distintas (SRP).
 *
 * Depende de: IProgressEventBus (Application).
 */

import type { IProgressEventBus } from "@application/stage/ports/IProgressEventBus";

function eventKey(stageId: string): string {
  return `ai-tech-ed-progress-${stageId}`;
}

export class LocalStorageEventBus implements IProgressEventBus {
  emit(stageId: string): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(eventKey(stageId)));
  }

  subscribe(stageId: string, listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const key = eventKey(stageId);

    // Escucha tanto Custom Events del mismo tab como StorageEvent de otros tabs
    const onCustom = () => listener();
    const onStorage = (event: StorageEvent) => {
      // La storage key tiene el formato: stage-progress-{stageId}
      if (event.key && !event.key.includes(stageId)) return;
      listener();
    };

    window.addEventListener(key, onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(key, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }
}

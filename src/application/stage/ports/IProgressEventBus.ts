/**
 * APPLICATION — Port (Interface de salida)
 *
 * IProgressEventBus: contrato para emitir y suscribirse a cambios de progreso.
 * Desacopla el store de React (useSyncExternalStore) del mecanismo concreto
 * de notificación (CustomEvent de DOM, en la implementación de Infrastructure).
 */

export interface IProgressEventBus {
  /** Emite un evento de cambio para el stageId dado. */
  emit(stageId: string): void;

  /**
   * Suscribe un listener a cambios de progreso.
   * Retorna una función de unsubscribe.
   */
  subscribe(stageId: string, listener: () => void): () => void;
}

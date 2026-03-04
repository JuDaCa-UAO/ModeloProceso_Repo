/**
 * APPLICATION — Port (Interface de salida)
 *
 * IAutodiagnosticPort: contrato para interactuar con el servicio de autodiagnóstico.
 * La implementación concreta (N8NAutodiagnosticAdapter) vive en Infrastructure.
 *
 * Al definir el contrato aquí (en Application) y no en Infrastructure,
 * se invierte la dependencia: el núcleo de la app no conoce N8N.
 */

import type { StageResultId } from "@domain/stage/value-objects/HierarchyLevel";

export interface AutodiagnosticCompletionPayload {
  stageId: string;
  email: string;
  /** Timestamp del momento de completion (para trazabilidad). */
  completedAt: number;
}

export interface AutodiagnosticResult {
  /** ID del nivel jerárquico derivado por el servicio de diagnóstico. */
  resultId: StageResultId;
  /** Indica si el resultado viene del servicio o es una estimación local. */
  source: "service" | "local-fallback";
}

export interface IAutodiagnosticPort {
  /**
   * Retorna la URL completa del formulario de autodiagnóstico para el docente.
   * Puede incluir parámetros de personalización.
   */
  getFormUrl(stageId: string, email: string): string;

  /**
   * Notifica al servicio externo que el autodiagnóstico fue completado.
   * Retorna el resultado calculado por el servicio.
   * Si el servicio no responde, retorna un fallback local.
   */
  notifyCompletion(payload: AutodiagnosticCompletionPayload): Promise<AutodiagnosticResult>;
}

/**
 * INFRASTRUCTURE — Adapter
 *
 * N8NAutodiagnosticAdapter: implementación concreta de IAutodiagnosticPort.
 * Maneja toda la comunicación con la instancia de N8N.
 *
 * Al ser una implementación de un Port (interfaz), puede ser sustituida
 * por un mock en tests o por otro servicio (ej: Typeform, LimeSurvey) sin
 * tocar ningún código de Application o Presentation.
 *
 * Depende de: IAutodiagnosticPort (Application), N8N_CONFIG (Infrastructure).
 */

import type {
  IAutodiagnosticPort,
  AutodiagnosticCompletionPayload,
  AutodiagnosticResult,
} from "@application/stage/ports/IAutodiagnosticPort";
import { N8N_CONFIG } from "./n8n.config";
import { isValidResultId } from "@domain/stage/value-objects/HierarchyLevel";

export class N8NAutodiagnosticAdapter implements IAutodiagnosticPort {
  /**
   * Retorna la URL del formulario de autodiagnóstico.
   * En el futuro puede agregar query params de personalización (email, stageId).
   */
  getFormUrl(stageId: string, _email: string): string {
    // Actualmente el formulario es el mismo para todos.
    // Futuro: pasar parámetros para pre-rellenar el formulario.
    void stageId;
    return N8N_CONFIG.forms.autodiagnostic;
  }

  /**
   * Notifica al webhook de N8N que el docente completó el autodiagnóstico.
   * Si el servicio no responde en 8 segundos, retorna fallback local.
   */
  async notifyCompletion(
    payload: AutodiagnosticCompletionPayload
  ): Promise<AutodiagnosticResult> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(N8N_CONFIG.webhooks.completionNotification, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`N8N webhook responded with status ${response.status}`);
      }

      const data = (await response.json()) as { resultId?: string };
      const resultId = data.resultId;

      if (resultId && isValidResultId(resultId)) {
        return { resultId, source: "service" };
      }

      // Respuesta inesperada del servicio → fallback
      return { resultId: "intermedio", source: "local-fallback" };
    } catch {
      // Red caída, timeout o N8N no configurado → fallback silencioso
      return { resultId: "intermedio", source: "local-fallback" };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

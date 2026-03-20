import type {
  IAutodiagnosticPort,
  AutodiagnosticCompletionPayload,
  AutodiagnosticResult,
} from "@application/stage/ports/IAutodiagnosticPort";
import { isValidResultId } from "@domain/stage/value-objects/HierarchyLevel";
import { N8N_CONFIG } from "./n8n.config";

export class N8NAutodiagnosticAdapter implements IAutodiagnosticPort {
  getFormUrl(stageId: string, email: string): string {
    void stageId;
    void email;
    return N8N_CONFIG.forms.autodiagnostic;
  }

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

      return { resultId: "intermedio", source: "local-fallback" };
    } catch {
      return { resultId: "intermedio", source: "local-fallback" };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

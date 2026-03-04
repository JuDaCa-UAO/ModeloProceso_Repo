/**
 * APPLICATION — Use Case
 *
 * CompleteAutodiagnosticUseCase: orquesta el proceso completo de completion
 * del autodiagnóstico.
 *
 * Responsabilidades:
 *  1. Notifica al servicio externo (N8N via IAutodiagnosticPort).
 *  2. Obtiene el resultId del servicio (o usa fallback local).
 *  3. Actualiza el estado de progreso vía repositorio.
 *
 * Depende de: IAutodiagnosticPort, IStageProgressRepository (contratos).
 */

import type { IAutodiagnosticPort } from "../ports/IAutodiagnosticPort";
import type { IStageProgressRepository } from "@domain/stage/repositories/IStageProgressRepository";
import { STAGE1_PROGRESS_DEFAULT } from "@domain/stage/entities/StageProgress";

export class CompleteAutodiagnosticUseCase {
  constructor(
    private readonly repo: IStageProgressRepository,
    private readonly autodiagnosticPort: IAutodiagnosticPort
  ) {}

  async execute(stageId: string): Promise<void> {
    const current = this.repo.read(stageId) ?? { ...STAGE1_PROGRESS_DEFAULT };

    // Intenta notificar al servicio y obtener el resultado real.
    // Si falla (red, N8N caído), usa el resultId local ya almacenado como fallback.
    try {
      const result = await this.autodiagnosticPort.notifyCompletion({
        stageId,
        email: current.email,
        completedAt: Date.now(),
      });

      this.repo.write(stageId, {
        ...current,
        autodiagnosticCompleted: true,
        resultStateId: result.resultId,
      });
    } catch {
      // Fallback: marca como completado con el resultId ya guardado
      this.repo.write(stageId, {
        ...current,
        autodiagnosticCompleted: true,
      });
    }
  }
}

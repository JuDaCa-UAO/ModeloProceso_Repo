/**
 * APPLICATION — Use Case
 *
 * StartStageUseCase: registra el inicio de una etapa.
 * Se ejecuta al cargar la página de una etapa por primera vez.
 *
 * Responsabilidades:
 *  1. Marca el progreso global como "iniciado".
 *  2. Actualiza la última ruta visitada (para el botón "Continuar").
 *  3. Persiste vía el repositorio (sin conocer localStorage directamente).
 *
 * Depende de: IStageProgressRepository (contrato de dominio).
 */

import type { IStageProgressRepository } from "@domain/stage/repositories/IStageProgressRepository";
import { STAGE1_PROGRESS_DEFAULT } from "@domain/stage/entities/StageProgress";

export class StartStageUseCase {
  constructor(private readonly repo: IStageProgressRepository) {}

  execute(stageId: string): void {
    const current = this.repo.read(stageId) ?? { ...STAGE1_PROGRESS_DEFAULT };
    // No resetea el estado existente — solo asegura que el registro existe
    this.repo.write(stageId, current);
  }
}

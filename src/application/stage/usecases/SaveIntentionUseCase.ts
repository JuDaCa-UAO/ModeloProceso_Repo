/**
 * APPLICATION — Use Case
 *
 * SaveIntentionUseCase: guarda la intención personal del docente.
 * Valida que el texto no esté vacío antes de persistir.
 *
 * Depende de: RequiredValidator (dominio), IStageProgressRepository (contrato).
 */

import { isRequired } from "@domain/shared/validation/RequiredValidator";
import type { IStageProgressRepository } from "@domain/stage/repositories/IStageProgressRepository";
import { STAGE1_PROGRESS_DEFAULT } from "@domain/stage/entities/StageProgress";

export class SaveIntentionUseCase {
  constructor(private readonly repo: IStageProgressRepository) {}

  /**
   * Guarda la intención y la emoción del docente.
   * @throws {Error} si `intentionText` está vacío.
   */
  execute(stageId: string, intentionText: string, emotion: string): void {
    if (!isRequired(intentionText)) {
      throw new Error("[SaveIntentionUseCase] El texto de intención no puede estar vacío.");
    }

    const current = this.repo.read(stageId) ?? { ...STAGE1_PROGRESS_DEFAULT };
    this.repo.write(stageId, {
      ...current,
      intentionText: intentionText.trim(),
      emotion,
      intentionSaved: true,
    });
  }
}

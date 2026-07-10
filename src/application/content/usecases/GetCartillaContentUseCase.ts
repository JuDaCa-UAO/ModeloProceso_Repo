/**
 * APPLICATION — Use Case
 *
 * Obtiene la Cartilla completa (Introducción + etapas + factores + cierre)
 * a través del puerto `IStageContentRepository`, sin conocer la fuente real.
 */
import type { Cartilla } from "@domain/content/Cartilla";
import type { IStageContentRepository } from "../ports/IStageContentRepository";

export class GetCartillaContentUseCase {
  constructor(private readonly repository: IStageContentRepository) {}

  execute(): Cartilla {
    return this.repository.getCartilla();
  }
}

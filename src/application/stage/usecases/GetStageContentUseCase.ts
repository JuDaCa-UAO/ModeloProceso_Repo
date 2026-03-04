/**
 * APPLICATION — Use Case
 *
 * GetStageContentUseCase: obtiene el árbol de nodos de contenido para una etapa.
 * Encapsula la consulta al repositorio de contenido y valida que la etapa exista.
 *
 * Depende de: IStageContentRepository (contrato de dominio).
 */

import type { IStageContentRepository } from "@domain/stage/repositories/IStageContentRepository";
import type { SectionNode } from "@/types/stage";

export class GetStageContentUseCase {
  constructor(private readonly repo: IStageContentRepository) {}

  /**
   * Retorna el árbol de contenido para `stageId`.
   * @throws {Error} si la etapa no existe en el sistema.
   */
  execute(stageId: string): SectionNode[] {
    const tree = this.repo.getTree(stageId);
    if (!tree) {
      throw new Error(
        `[GetStageContentUseCase] No existe contenido para la etapa "${stageId}". ` +
          `Etapas disponibles: ${this.repo.listStageIds().join(", ")}`
      );
    }
    return tree;
  }
}

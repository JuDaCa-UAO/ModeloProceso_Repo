/**
 * INFRASTRUCTURE — Persistence (Static Content)
 *
 * StaticStageContentRepository: implementación concreta de IStageContentRepository.
 * Lee el árbol de contenido de archivos TypeScript estáticos en content/stages/.
 *
 * Por qué aquí y no en content/: los archivos de content son datos puros
 * (sin lógica), pero el ACCESO a ellos es infraestructura. Esta clase es
 * el único punto de la aplicación que "sabe" qué stageId → qué archivo.
 *
 * Para agregar una nueva etapa: importarla aquí y registrarla en STAGE_REGISTRY.
 *
 * Depende de: IStageContentRepository (dominio), archivos de content (data).
 */

import type { IStageContentRepository } from "@domain/stage/repositories/IStageContentRepository";
import type { SectionNode } from "@/types/stage";
import { STAGE1_TREE } from "@/content/stages/stage-1.content";

/** Registro canónico de stageId → árbol de contenido. */
const STAGE_REGISTRY: Record<string, SectionNode[]> = {
  "etapa-1": STAGE1_TREE,
  // "etapa-2": STAGE2_TREE,  ← agregar aquí al crear contenido de Etapa 2
  // "etapa-3": STAGE3_TREE,
};

export class StaticStageContentRepository implements IStageContentRepository {
  getTree(stageId: string): SectionNode[] | null {
    return STAGE_REGISTRY[stageId] ?? null;
  }

  listStageIds(): string[] {
    return Object.keys(STAGE_REGISTRY);
  }
}

/**
 * DOMAIN — Repository Interface (Port)
 *
 * Contrato para obtener el árbol de contenido de cualquier etapa.
 * La implementación concreta (StaticStageContentRepository en Infrastructure)
 * lee los archivos de contenido estático.
 * Futuras implementaciones podrían leer de una API o CMS.
 *
 * Depende de: SectionNode (importado desde types/stage para mantener
 * compatibilidad durante la migración incremental).
 */

import type { SectionNode } from "@/types/stage";

export interface IStageContentRepository {
  /** Retorna el árbol de nodos para la etapa dada, o null si no existe. */
  getTree(stageId: string): SectionNode[] | null;

  /** Lista todos los stageIds disponibles en el sistema. */
  listStageIds(): string[];
}

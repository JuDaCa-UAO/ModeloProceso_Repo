/**
 * PRESENTATION — Stage Component Types
 *
 * Tipos específicos de la capa de presentación del sistema de etapas.
 * Aquí pueden vivir tipos que dependen de React (ReactNode, etc.) porque
 * esta capa SÍ puede depender del framework.
 *
 * Los tipos de dominio (SectionNode, StageFlagKey, etc.) viven en types/stage.ts.
 */

import type { ReactNode } from "react";
import type { SectionNode } from "@/types/stage";

/**
 * Contexto de renderizado customizable para el BlockRenderer.
 * Permite inyectar renders personalizados sin modificar la lógica del renderer.
 */
export type RenderContext = {
  renderCustomBlock?: (key: string, section: SectionNode) => ReactNode;
};

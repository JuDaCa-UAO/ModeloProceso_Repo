/**
 * CONTENT — Introducción
 *
 * Metadatos y árbol de contenido mínimo para la etapa de introducción.
 * El contenido real de esta etapa está hardcodeado en StageClient
 * (frames 1-5), por lo que el árbol aquí es un stub que solo permite
 * que GetStageContentUseCase valide correctamente la ruta.
 */

import type { SectionNode } from "@/types/stage";

export const INTRODUCCION_ID = "introduccion";
export const INTRODUCCION_NAME = "Introducción";

export const INTRODUCCION_TREE: SectionNode[] = [
  {
    id: "introduccion-intro",
    title: "Bienvenido a esta iteración",
    content: [],
    children: [],
  },
];

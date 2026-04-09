/**
 * CONTENT — Etapa 0
 *
 * Metadatos y árbol de contenido mínimo para la etapa de introducción.
 * El contenido real de esta etapa está hardcodeado en StageClient
 * (frames 1-5), por lo que el árbol aquí es un stub que solo permite
 * que GetStageContentUseCase valide correctamente la ruta.
 */

import type { SectionNode } from "@/types/stage";

export const STAGE0_ID = "etapa-0";
export const STAGE0_NAME = "Introducción";

export const STAGE0_TREE: SectionNode[] = [
  {
    id: "etapa-0-intro",
    kind: "section",
    label: "Introducción",
    title: "Bienvenido a esta iteración",
    lines: [
      "Este recorrido introductorio te prepara para comenzar el modelo de proceso GenAI.",
    ],
    children: [],
  },
];

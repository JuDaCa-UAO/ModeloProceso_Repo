/**
 * CONTENT — Etapa 2 (Descubre nuevas posibilidades)
 *
 * `STAGE2_TREE` se conserva para el repositorio estático de existencia de rutas
 * (`StaticStageContentRepository`), que tipa todas las etapas como `SectionNode[]`.
 *
 * `STAGE2_DISCOVER_TREE` es la definición DIRIGIDA POR DATOS que consume el motor
 * (`presentation/stages/engine/StageRenderer`). Es la fuente única del contenido
 * de la Etapa 2: secciones, bloques, diálogos (literales de EMI), recursos
 * lógicos y pasos de guía. Para crear una etapa nueva con bloques existentes,
 * basta con declarar un árbol equivalente (ver `contexto/planes/guia-crear-nueva-etapa.md`).
 */

import type { SectionNode } from "@/types/stage";
import type { StageNode } from "@/presentation/stages/engine/types";
import {
  STAGE2_S1_STEPS,
  STAGE2_S2_STEPS,
  STAGE2_S3_STEPS,
  STAGE2_S4_STEPS,
  STAGE2_S5_STEPS,
  STAGE2_TRANSITION_STEPS,
} from "@/content/dialogs/stage-2-discover.dialogs";

/** Compatibilidad con el repositorio estático (validación de ruta). */
export const STAGE2_TREE: SectionNode[] = [];

const BG = "/ui/uao-hero-img_1.webp";
const OVERLAY = "rgba(4, 2, 3, 0.45)";
const SPIRAL_INSTRUCTIONS =
  "Puedes interactuar con el modelo usando el scroll para acercarte y arrastrando con el click presionado para girarlo.";

export const STAGE2_DISCOVER_TREE: StageNode[] = [
  // ── Frame 1 · Sección 1: Tu lugar en la iteración ──────────────────────────
  {
    id: "etapa2-seccion-1",
    stageTitle: "Etapa 2: Descubre nuevas posibilidades",
    sectionTitle: "Sección 1: Tu lugar en la iteración",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "¡Avancemos!",
    blocks: [
      { type: "spiral-viewer", activeStage: 2, instructions: SPIRAL_INSTRUCTIONS, variant: "compact" },
      { type: "dialogue", steps: STAGE2_S1_STEPS },
    ],
  },

  // ── Frame 2 · Sección 2: No se elige por moda, se explora con propósito ─────
  {
    id: "etapa2-seccion-2",
    sectionTitle: "Sección 2: No se elige por moda, se explora con propósito",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "narrative-video",
        mediaKey: "stage2.section2Video",
        caption:
          "Animación de íconos de herramientas dispersas que se organizan alrededor de propósitos educativos.",
      },
      { type: "dialogue", steps: STAGE2_S2_STEPS },
    ],
  },

  // ── Frame 3 · Sección 3: Cómo se miran las posibilidades ────────────────────
  {
    id: "etapa2-seccion-3",
    sectionTitle: "Sección 3: Cómo se miran las posibilidades",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE2_S3_STEPS },
      { type: "criteria-infographic", openLabel: "Observar criterios", mediaKey: "stage2.criteriaInfographic" },
    ],
  },

  // ── Frame 4 · Sección 4: Ejemplo demostrativo de comparación ────────────────
  {
    id: "etapa2-seccion-4",
    sectionTitle: "Sección 4: Ejemplo demostrativo de comparación",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE2_S4_STEPS },
      { type: "comparison-example", openLabel: "Observar ejemplo", mediaKey: "stage2.comparisonExample" },
    ],
  },

  // ── Frame 5 · Sección 5: Material de apoyo y cierre ─────────────────────────
  {
    id: "etapa2-seccion-5",
    sectionTitle: "Sección 5: Material de apoyo y cierre",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Avancemos",
    blocks: [
      { type: "dialogue", steps: STAGE2_S5_STEPS },
      { type: "download-resource", mediaKey: "stage2.pughMatrix", label: "Descargar matriz" },
    ],
  },

  // ── Frame 6 · Transición hacia la Etapa 3 ───────────────────────────────────
  {
    id: "etapa2-transicion",
    sectionTitle: "Sección 5: Transición",
    backgroundImage: BG,
    overlay: OVERLAY,
    blocks: [
      {
        type: "transition",
        mediaKey: "stage2.transitionVideo",
        steps: STAGE2_TRANSITION_STEPS,
        nextHref: "/etapas/etapa-3",
        nextLabel: "Ir a la siguiente etapa",
        nextAvailable: true,
      },
    ],
  },
];

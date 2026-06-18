import type { SectionNode } from "@/types/stage";
import type { StageNode } from "@/presentation/stages/engine/types";
import {
  STAGE3_S1_STEPS,
  STAGE3_S2_STEPS,
  STAGE3_S3_STEPS,
  STAGE3_S4_STEPS,
  STAGE3_S5_STEPS,
  STAGE3_TRANSITION_STEPS,
} from "@/content/dialogs/stage-3-design.dialogs";

/** Compatibilidad con el repositorio estático (validación de ruta). */
export const STAGE3_TREE: SectionNode[] = [];

const BG = "/ui/backgroundUAO.png";
const OVERLAY = "rgba(4, 2, 3, 0.45)";
const SPIRAL_INSTRUCTIONS =
  "Puedes interactuar con el modelo usando el scroll para acercarte y arrastrando con el click presionado para girarlo.";

export const STAGE3_DESIGN_TREE: StageNode[] = [
  // ── Frame 1 · Sección 1: De explorar a diseñar ──────────────────────────
  {
    id: "etapa3-seccion-1",
    stageTitle: "Etapa 3: Diseña con propósito",
    sectionTitle: "Sección 1: De explorar a diseñar",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "¡Avancemos!",
    blocks: [
      { type: "spiral-viewer", activeStage: 3, instructions: SPIRAL_INSTRUCTIONS, variant: "compact" },
      { type: "dialogue", steps: STAGE3_S1_STEPS },
    ],
  },

  // ── Frame 2 · Sección 2: La IA entra en una experiencia, no en el vacío ─────
  {
    id: "etapa3-seccion-2",
    sectionTitle: "Sección 2: La IA entra en una experiencia, no en el vacío",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "narrative-video",
        mediaKey: "stage3.section2Video",
        caption:
          "Animación que conecta una solución de IA con objetivo, actividad, estudiantes, mediación y evaluación.",
      },
      { type: "dialogue", steps: STAGE3_S2_STEPS },
    ],
  },

  // ── Frame 3 · Sección 3: El mapa del diseño ──────────────────────────────────
  {
    id: "etapa3-seccion-3",
    sectionTitle: "Sección 3: El mapa del diseño",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE3_S3_STEPS },
      {
        type: "design-canvas",
        openLabel: "Observar el mapa del diseño",
        mediaKey: "stage3.designMap",
        modalTitle: "Canvas de diseño de experiencia mediada por GenAI",
        modalBadge: "CANVAS",
        guideId: "etapa3-observar-canvas"
      },
    ],
  },

  // ── Frame 4 · Sección 4: Ejemplo demostrativo ────────────────────────────────
  {
    id: "etapa3-seccion-4",
    sectionTitle: "Sección 4: Ejemplo demostrativo",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE3_S4_STEPS },
      {
        type: "comparison-example",
        openLabel: "Observar ejemplo",
        mediaKey: "stage3.caseExample",
        modalTitle: "Ejemplo demostrativo: análisis de casos con apoyo de IA",
        modalBadge: "EJEMPLO",
        guideId: "etapa3-observar-ejemplo"
      },
    ],
  },

  // ── Frame 5 · Sección 5: Canvas y cierre iterativo ─────────────────────────
  {
    id: "etapa3-seccion-5",
    sectionTitle: "Sección 5: Canvas y cierre iterativo",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Avancemos",
    blocks: [
      { type: "dialogue", steps: STAGE3_S5_STEPS },
      {
        type: "download-resource",
        mediaKey: "stage3.designCanvas",
        label: "Descargar Canvas de diseño",
        guideId: "etapa3-descargar-canvas",
        confirmationTitle: "Descarga exitosa",
        confirmationText: "¡Canvas de diseño descargado exitosamente!",
        confirmationDescription: "Usa este Canvas para estructurar y plasmar tu diseño didáctico mediado por IA generativa."
      },
    ],
  },

  // ── Frame 6 · Transición hacia la Etapa 4 ───────────────────────────────────
  {
    id: "etapa3-transicion",
    sectionTitle: "Sección 5: Transición",
    backgroundImage: BG,
    overlay: OVERLAY,
    blocks: [
      {
        type: "transition",
        mediaKey: "transitions.stage3ToStage4",
        activeStage: 3,
        steps: STAGE3_TRANSITION_STEPS,
        nextHref: "/etapas/etapa-4",
        nextLabel: "Ir a la siguiente etapa",
        nextAvailable: true,
        guideId: "etapa3-ver-animacion",
        playLabel: "Ver animación →",
        repeatLabel: "↺ Repetir animación"
      },
    ],
  },
];

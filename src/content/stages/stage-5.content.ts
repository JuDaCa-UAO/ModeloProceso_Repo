import type { SectionNode } from "@/types/stage";
import type { StageNode } from "@/presentation/stages/engine/types";
import {
  STAGE5_S1_STEPS,
  STAGE5_S2_STEPS,
  STAGE5_S3_STEPS,
  STAGE5_S4_STEPS,
  STAGE5_S5_STEPS,
  STAGE5_TRANSITION_STEPS,
} from "@/content/dialogs/stage-5-implement.dialogs";

export const STAGE5_TREE: SectionNode[] = [];

const BG = "/ui/uao-hero-img_1.webp";
const OVERLAY = "rgba(4, 2, 3, 0.45)";
const SPIRAL_INSTRUCTIONS =
  "Puedes interactuar con el modelo usando el scroll para acercarte y arrastrando con el click presionado para girarlo.";

export const STAGE5_IMPLEMENT_TREE: StageNode[] = [
  // ── Frame 1 · Sección 1: Del alistamiento a la acción ─────────────────────
  {
    id: "etapa5-seccion-1",
    stageTitle: "Etapa 5: Hazlo realidad en el aula",
    sectionTitle: "Sección 1: Del alistamiento a la acción",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "¡Avancemos!",
    blocks: [
      { type: "spiral-viewer", activeStage: 5, instructions: SPIRAL_INSTRUCTIONS, variant: "compact" },
      { type: "dialogue", steps: STAGE5_S1_STEPS },
    ],
  },

  // ── Frame 2 · Sección 2: El aula como simulación guiada ───────────────────
  {
    id: "etapa5-seccion-2",
    sectionTitle: "Sección 2: El aula como simulación guiada",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "narrative-video",
        mediaKey: "stage5.classroomSimulation",
        caption: "Simulación de aula interactiva (próximamente).",
      },
      { type: "dialogue", steps: STAGE5_S2_STEPS },
    ],
  },

  // ── Frame 3 · Sección 3: El docente como mediador ─────────────────────────
  {
    id: "etapa5-seccion-3",
    sectionTitle: "Sección 3: El docente como mediador",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "narrative-video",
        mediaKey: "stage5.teacherAsMediator",
        caption: "Acciones del docente como mediador (próximamente).",
      },
      { type: "dialogue", steps: STAGE5_S3_STEPS },
    ],
  },

  // ── Frame 4 · Sección 4: Momentos críticos durante la experiencia ─────────
  {
    id: "etapa5-seccion-4",
    sectionTitle: "Sección 4: Momentos críticos durante la experiencia",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "criteria-infographic",
        openLabel: "Observar momentos críticos",
        modalTitle: "Momentos críticos durante la experiencia",
        modalBadge: "EVIDENCIAS",
        mediaKey: "stage5.criticalMoments",
      },
      { type: "dialogue", steps: STAGE5_S4_STEPS },
    ],
  },

  // ── Frame 5 · Sección 5: Evidencias para mejorar ──────────────────────────
  {
    id: "etapa5-seccion-5",
    sectionTitle: "Sección 5: Evidencias para mejorar",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Avancemos",
    blocks: [
      {
        type: "image-rail",
        panels: [
          { id: "ev1", mediaKey: "stage5.rail.1" },
          { id: "ev2", mediaKey: "stage5.rail.2" },
          { id: "ev3", mediaKey: "stage5.rail.3" },
          { id: "ev4", mediaKey: "stage5.rail.4" },
          { id: "ev5", mediaKey: "stage5.rail.5" },
        ]
      },
      { type: "dialogue", steps: STAGE5_S5_STEPS },
    ],
  },

  // ── Frame 6 · Transición hacia la Etapa 6 ─────────────────────────────────
  {
    id: "etapa5-transicion",
    sectionTitle: "Sección 5: Transición",
    backgroundImage: BG,
    overlay: OVERLAY,
    blocks: [
      {
        type: "transition",
        activeStage: 5,
        mediaKey: "transitions.stage5ToStage6",
        steps: STAGE5_TRANSITION_STEPS,
        nextHref: "/etapas/etapa-6",
        nextLabel: "Ir a la siguiente etapa",
        nextAvailable: true,
      },
    ],
  },
];

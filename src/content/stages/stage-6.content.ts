import type { SectionNode } from "@/types/stage";
import type { StageNode } from "@/presentation/stages/engine/types";
import {
  STAGE6_S1_STEPS,
  STAGE6_S2_STEPS,
  STAGE6_S3_STEPS,
  STAGE6_S4_STEPS,
  STAGE6_S5_STEPS,
  STAGE6_CLOSING_STEPS,
} from "@/content/dialogs/stage-6-reflect.dialogs";

export const STAGE6_TREE: SectionNode[] = [];

const BG = "/ui/uao-hero-img_1.webp";
const OVERLAY = "rgba(4, 2, 3, 0.45)";
const SPIRAL_INSTRUCTIONS =
  "Puedes interactuar con el modelo usando el scroll para acercarte y arrastrando con el click presionado para girarlo.";

export const STAGE6_REFLECT_TREE: StageNode[] = [
  // ── Frame 1 · Sección 1: Mira lo vivido en el aula ────────────────────────
  {
    id: "etapa6-seccion-1",
    stageTitle: "Etapa 6: Reflexiona, aprende y mejora",
    sectionTitle: "Sección 1: Mira lo vivido en el aula",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "¡Avancemos!",
    blocks: [
      { type: "spiral-viewer", activeStage: 6, instructions: SPIRAL_INSTRUCTIONS, variant: "compact" },
      { type: "dialogue", steps: STAGE6_S1_STEPS },
    ],
  },

  // ── Frame 2 · Sección 2: Evalúa más allá de la nota ───────────────────────
  {
    id: "etapa6-seccion-2",
    sectionTitle: "Sección 2: Evalúa más allá de la nota",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "criteria-infographic",
        openLabel: "Observar dimensiones",
        modalTitle: "Dimensiones de la experiencia",
        modalBadge: "EVALUACIÓN",
        mediaKey: "stage6.evaluationDimensions",
      },
      { type: "dialogue", steps: STAGE6_S2_STEPS },
    ],
  },

  // ── Frame 3 · Sección 3: Cruza dos miradas ────────────────────────────────
  {
    id: "etapa6-seccion-3",
    sectionTitle: "Sección 3: Cruza dos miradas",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "criteria-infographic",
        openLabel: "Observar perspectivas",
        modalTitle: "Dos miradas sobre la experiencia",
        modalBadge: "PERSPECTIVAS",
        mediaKey: "stage6.twoPerspectives",
      },
      { type: "dialogue", steps: STAGE6_S3_STEPS },
    ],
  },

  // ── Frame 4 · Sección 4: Convierte hallazgos en mejoras ───────────────────
  {
    id: "etapa6-seccion-4",
    sectionTitle: "Sección 4: Convierte hallazgos en mejoras",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "criteria-infographic",
        openLabel: "Observar secuencia de mejora",
        modalTitle: "De hallazgo a mejora",
        modalBadge: "MEJORA CONTINUA",
        mediaKey: "stage6.improvementSequence",
      },
      { type: "dialogue", steps: STAGE6_S4_STEPS },
    ],
  },

  // ── Frame 5 · Sección 5: Descarga tu canvas de evaluación ─────────────────
  {
    id: "etapa6-seccion-5",
    sectionTitle: "Sección 5: Descarga tu canvas de evaluación",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Avancemos",
    blocks: [
      {
        type: "download-resource",
        mediaKey: "stage6.evaluationCanvas",
        label: "Descargar Canvas de evaluación",
        confirmationTitle: "Descarga exitosa",
        confirmationText: "¡Canvas de evaluación descargado exitosamente!",
        confirmationDescription:
          "Usa este Canvas para evaluar una experiencia mediada por IA: ordena evidencias, percepciones, aprendizajes y decisiones de mejora.",
        previewEmbed: true,
        previewTitle: "Canvas de evaluación — Etapa 6",
        previewMaxHeight: "45dvh",
      },
      { type: "dialogue", steps: STAGE6_S5_STEPS },
    ],
  },

  // ── Frame 6 · Cierre: La espiral continúa ─────────────────────────────────
  {
    id: "etapa6-cierre",
    stageTitle: "Cierre. La espiral continúa",
    sectionTitle: "El proceso continúa",
    backgroundImage: BG,
    overlay: OVERLAY,
    blocks: [
      {
        type: "transition",
        activeStage: 6,
        mediaKey: "stage6.newLoopVideo",
        steps: STAGE6_CLOSING_STEPS,
        nextHref: "/inicio",
        nextLabel: "Volver al menú de inicio",
        nextAvailable: true,
      },
    ],
  },
];

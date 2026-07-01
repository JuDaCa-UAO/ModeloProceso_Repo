import type { SectionNode } from "@/types/stage";
import type { StageNode } from "@/presentation/stages/engine/types";
import {
  STAGE4_S1_STEPS,
  STAGE4_S2_STEPS,
  STAGE4_S3_STEPS,
  STAGE4_S4_STEPS,
  STAGE4_S5_STEPS,
  STAGE4_TRANSITION_STEPS,
} from "@/content/dialogs/stage-4-prepare.dialogs";

/** Compatibilidad con el repositorio estático (validación de ruta). */
export const STAGE4_TREE: SectionNode[] = [];

const BG = "/ui/uao-hero-img_1.webp";
const OVERLAY = "rgba(251, 245, 236, 0.65)"; // Light cream mask (UAO visual identity overlay)

export const STAGE4_PREPARE_TREE: StageNode[] = [
  // ── Frame 1 · Sección 1: Del diseño al alistamiento ──────────────────────────
  {
    id: "etapa4-seccion-1",
    stageTitle: "Etapa 4: Prepara el terreno para el éxito",
    sectionTitle: "Sección 1: Del diseño al alistamiento",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "¡Avancemos!",
    blocks: [
      { type: "spiral-viewer", activeStage: 4, variant: "compact" },
      { type: "dialogue", steps: STAGE4_S1_STEPS },
    ],
  },

  // ── Frame 2 · Sección 2: Preparar no es repetir el diseño ──────────────────
  {
    id: "etapa4-seccion-2",
    sectionTitle: "Sección 2: Preparar no es repetir el diseño",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      {
        type: "criteria-infographic",
        openLabel: "Observar checklist",
        modalTitle: "Checklist de preparación",
        modalBadge: "PREPARACIÓN",
        mediaKey: "stage4.section2Media",
      },
      { type: "dialogue", steps: STAGE4_S2_STEPS },
    ],
  },

  // ── Frame 3 · Sección 3: Tablero de preparación ─────────────────────────────
  {
    id: "etapa4-seccion-3",
    sectionTitle: "Sección 3: Tablero de preparación",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE4_S3_STEPS },
      {
        type: "checklist-board",
        openLabel: "Observar tablero de preparación",
        modalTitle: "Tablero de preparación de la experiencia",
        modalBadge: "PREPARACIÓN",
        guideId: "etapa4-observar-tablero",
        items: [
          {
            category: "Herramienta",
            title: "Funcionamiento de la herramienta GenAI",
            status: "ready",
            statusLabel: "Listo",
            description: "Acceso verificado y versión disponible para todos los estudiantes.",
          },
          {
            category: "Instrucciones",
            title: "Instrucciones de la actividad",
            status: "ready",
            statusLabel: "Listo",
            description: "Consignas claras sobre cómo, cuándo y para qué se usará la IA en la tarea.",
          },
          {
            category: "Reglas de uso",
            title: "Límites éticos y escala Perkins",
            status: "ready",
            statusLabel: "Listo",
            description: "Acuerdos explícitos sobre citación, datos permitidos y nivel de autonomía.",
          },
          {
            category: "Plan B",
            title: "Alternativa sin Inteligencia Artificial",
            status: "review",
            statusLabel: "Revisar",
            description: "Ruta de aprendizaje paralela diseñada para estudiantes sin conectividad o que deciden no usar GenAI.",
          },
          {
            category: "Acompañamiento",
            title: "Monitoreo y retroalimentación",
            status: "pending",
            statusLabel: "Pendiente",
            description: "Estrategias de seguimiento en tiempo real de las interacciones estudiantiles con la IA.",
          },
        ],
      },
    ],
  },

  // ── Frame 4 · Sección 4: Ejemplo demostrativo de riesgo ──────────────────────
  {
    id: "etapa4-seccion-4",
    sectionTitle: "Sección 4: Ejemplo demostrativo de riesgo",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Continuar",
    blocks: [
      { type: "dialogue", steps: STAGE4_S4_STEPS },
      {
        type: "guided-scenario",
        openLabel: "Observar escenario de riesgo",
        modalTitle: "Ejemplo de alistamiento ante imprevistos",
        modalBadge: "MICROCASO",
        guideId: "etapa4-observar-microcaso",
        scenario: {
          title: "Caída de la plataforma en pleno taller",
          situation: "Los estudiantes están utilizando una herramienta de generación de imágenes para conceptualizar un proyecto arquitectónico cuando el servidor de la IA experimenta una caída global y deja de responder.",
          risk: "Pérdida de foco de la actividad, frustración en el grupo y parálisis del trabajo por dependencia exclusiva de la tecnología.",
          recommendation: "Activar de inmediato la ruta alternativa (Plan B): continuar el bocetado utilizando dibujo libre sobre papel o herramientas locales offline, manteniendo el propósito conceptual intacto.",
          teacherRole: "Actuar como mediador de la calma, recordar que la IA es un recurso de apoyo y reorientar el esfuerzo hacia la destreza cognitiva y reflexiva de los estudiantes.",
        },
      },
    ],
  },

  // ── Frame 5 · Sección 5: Canvas de alistamiento y cierre ────────────────────
  {
    id: "etapa4-seccion-5",
    sectionTitle: "Sección 5: Canvas de alistamiento y cierre",
    backgroundImage: BG,
    overlay: OVERLAY,
    scrollHintLabel: "Avancemos",
    blocks: [
      { type: "dialogue", steps: STAGE4_S5_STEPS },
      {
        type: "download-resource",
        mediaKey: "stage4.readinessCanvas",
        label: "Descargar Canvas de alistamiento",
        guideId: "etapa4-descargar-canvas",
        confirmationTitle: "Descarga exitosa",
        confirmationText: "¡Canvas de alistamiento descargado exitosamente!",
        confirmationDescription: "Usa este Canvas para verificar y asegurar las condiciones técnicas, pedagógicas y éticas de tu experiencia antes de ir al aula.",
      },
    ],
  },

  // ── Frame 6 · Transición hacia la Etapa 5 ───────────────────────────────────
  {
    id: "etapa4-transicion",
    sectionTitle: "Sección 5: Transición",
    backgroundImage: BG,
    overlay: OVERLAY,
    blocks: [
      {
        type: "transition",
        mediaKey: "transitions.stage4ToStage5",
        activeStage: 4,
        steps: STAGE4_TRANSITION_STEPS,
        nextHref: "/etapas/etapa-5",
        nextLabel: "Ir a la siguiente etapa",
        nextAvailable: true,
        guideId: "etapa4-ver-animacion",
        playLabel: "Ver animación",
        repeatLabel: "Repetir animación",
      },
    ],
  },
];

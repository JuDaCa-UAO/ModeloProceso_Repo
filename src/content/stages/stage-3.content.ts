import type { SectionNode } from "@/types/stage";
import type { StageNode, DesignCanvasData } from "@/presentation/stages/engine/types";
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

/** Contenido del canvas de diseño (modal del bloque `design-canvas`, Frame 3). */
const STAGE3_DESIGN_CANVAS: DesignCanvasData = {
  objective: {
    title: "Objetivo y propuesta de valor",
    questions: [
      {
        question: "¿Qué quiero lograr?",
        description:
          "Formula la gran meta pedagógica (competencias, aprendizajes significativos). El objetivo debe trascender lo instrumental y apuntar a transformar al estudiante en sus dimensiones cognitivas y éticas.",
      },
      {
        question: "¿Cuál es el valor agregado de usar GenAI en esta experiencia?",
        description:
          "Explica cómo la GenAI contribuye no solo a la eficiencia docente, sino también a enriquecer el proceso formativo del estudiante: más reflexión, creatividad, personalización, retroalimentación o apertura de perspectivas.",
      },
    ],
  },
  activities: {
    title: "Actividades académicas",
    questions: [
      {
        question: "¿Qué harán los estudiantes?",
        description:
          "Describe tareas retadoras (proyectos, estudios de caso, debates, simulaciones) que los sitúen en el centro del aprendizaje, con protagonismo activo.",
      },
      {
        question: "¿Qué estrategia didáctica usaré?",
        description:
          "Indica si será aprendizaje basado en problemas, proyectos, aula invertida, etc. Estas estrategias deben alinear contenidos, objetivos y evaluación.",
      },
      {
        question: "¿Cómo y cuándo interviene la GenAI?",
        description:
          "Explica los momentos y modos de participación de la IA: ideación, retroalimentación, edición, simulación, evaluación. Asegúrate de que complemente el esfuerzo cognitivo del estudiante, sin sustituirlo.",
      },
    ],
  },
  tools: {
    title: "Soluciones de GenAI seleccionadas",
    questions: [
      {
        question: "¿Qué herramienta de GenAI usaré?",
        description: "Especifica la herramienta elegida y justifica su pertinencia en la experiencia.",
      },
      {
        question: "¿Para qué propósito específico?",
        description:
          "Indica el uso pedagógico (ej.: lluvia de ideas, edición, generación de escenarios). Evita la adopción por moda.",
      },
      {
        question: "¿Cuál es el nivel de uso esperado (escala Perkins 1-5)?",
        description:
          "Define el grado de integración permitido, desde 'No IA' hasta 'Full IA'. Esto da transparencia y evita el enfoque binario de prohibir/permitir.",
      },
    ],
  },
  criticalThinking: {
    title: "Razonamiento crítico y mediaciones",
    questions: [
      {
        question: "¿Qué preguntas o reflexiones plantearé?",
        description:
          "Integra retos de pensamiento crítico (sesgos, validez, alternativas). Estas preguntas convierten a la GenAI en detonador de reflexión y no en atajo cognitivo.",
      },
      {
        question: "¿Cómo promoveré que cuestionen y analicen lo generado por la IA?",
        description: "Diseña actividades metacognitivas: discusión, contraste con fuentes, evaluación de calidad.",
      },
      {
        question: "¿Cuál será mi rol como docente?",
        description:
          "Asume el papel de mediador y curador: enseña prompting, acompaña el análisis, modela el uso crítico y ético.",
      },
    ],
  },
  ethics: {
    title: "Consideraciones éticas y de diseño responsable",
    questions: [
      {
        question: "¿Qué reglas de uso comunicaré?",
        description: "Define políticas claras: citación de IA, límites de ayuda permitida, responsabilidad individual.",
      },
      {
        question: "¿Cómo asegurar inclusión, equidad, privacidad y transparencia?",
        description:
          "Integra principios éticos desde el diseño (UNESCO, Comisión Europea). Asegura acceso para todos y protección de datos.",
      },
      {
        question: "¿Qué haré si un estudiante no usa GenAI?",
        description: "Diseña rutas paralelas que aseguren aprendizaje equivalente, respetando convicciones personales.",
      },
    ],
  },
  evaluation: {
    title: "Mecanismos de evaluación y retroalimentación",
    questions: [
      {
        question: "¿Cómo evaluaré los aprendizajes?",
        description: "La evaluación debe medir no solo el producto, sino el proceso y las decisiones críticas tomadas.",
      },
      {
        question: "¿Qué criterios usaré (pensamiento crítico, creatividad, metacognición)?",
        description:
          "Diseña instrumentos como rúbricas u otros que privilegien la reflexión, la originalidad y la justificación del uso de GenAI.",
      },
      {
        question: "¿Cómo integraré la escala Perkins o rúbricas adaptadas?",
        description: "Aplica escalas para evaluar el nivel de autonomía y reflexión en el uso de IA.",
      },
    ],
  },
  followUp: {
    title: "Mecanismos de seguimiento y mejora continua",
    questions: [
      {
        question: "¿Qué mecanismos de retroalimentación continua usaré?",
        description: "Combina retroalimentación inmediata (GenAI, quizzes) y formativa (docente, pares).",
      },
      {
        question: "¿Cómo verificaré el progreso y apoyaré a quienes lo necesiten?",
        description:
          "Usa analítica de aprendizaje o revisión continua para detectar dificultades. Garantiza equidad y validez en estos mecanismos.",
      },
    ],
  },
  citation:
    "Modelo de proceso para la apropiación de la inteligencia artificial generativa en la formación docente de la Universidad Autónoma de Occidente. Peláez, C., Solano, A., Castillo, P., López J. (2026)",
  citationBadge: "Creative Commons CC BY-NC-SA",
};

const BG = "/ui/uao-hero-img_1.webp";
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
        modalTitle: "Canvas de diseño de experiencia mediada por GenAI",
        modalBadge: "CANVAS",
        guideId: "etapa3-observar-canvas",
        canvas: STAGE3_DESIGN_CANVAS,
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
        playLabel: "Ver animación",
        repeatLabel: "Repetir animación"
      },
    ],
  },
];

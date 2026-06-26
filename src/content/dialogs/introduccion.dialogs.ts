/**
 * CONTENT — Diálogos y copy de la Introducción
 *
 * Textos de LaIA y datos de secciones extraídos de StageClient (frames 1-4).
 * Son DATOS PUROS: el texto, los assets y los audios son idénticos a los que
 * antes vivían hardcodeados dentro del componente. La presentación (JSX) no
 * cambió; solo se movió el contenido aquí para organizarlo por etapa.
 *
 * Para editar el copy de la introducción: editar solo este archivo.
 *
 * Depende de: tipo CharacterDialogStep (presentación) y RailPanel (types/stage),
 * ambos solo a nivel de tipos.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import type { RailPanel } from "@/types/stage";

// ─── Diálogo de LaIA — Frame 1 ───────────────────────────────────────────────

export const LAIA_INTRO_STEPS: CharacterDialogStep[] = [
  {
    text: "Bienvenido/a. Este recorrido te guiará por un modelo por etapas para integrar GenAI en experiencias de aprendizaje. Avanzaremos de forma estructurada: reconocer tu punto de partida, explorar posibilidades, diseñar con propósito, preparar el terreno, desplegar en el aula y evaluar para mejorar.",
    imgSrc: "/ui/laia.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion1-1.ogg",
  },
  {
    text: "Este modelo se recorre por etapas. Cada una cumple una función distinta dentro del proceso y te ayudará a avanzar con mayor claridad y sentido pedagógico.",
    imgSrc: "/ui/laia_explaining.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion1-2.ogg",
  },
];

// ─── Diálogo de LaIA — Frame 3 Fase A (modelo visible) ────────────────────────

export const F3_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Comenzamos en la primera etapa: Reconócete para avanzar. Aquí establecerás tu punto de partida para orientar el resto del recorrido.",
    imgSrc: "/ui/LaIA_explaining_holo.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion2-1.ogg",
  },
  {
    text: "A partir de ahora podrás ver siempre en qué etapa del modelo te encuentras. Cuando termines esta introducción, también podrás acceder al resto de etapas desde la pantalla principal.",
    imgSrc: "/ui/laia_explaining.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion2-2.ogg",
  },
];

// ─── Rail de etapas — Frame 4 ─────────────────────────────────────────────────

export const STAGE_RAIL_CARDS: RailPanel[] = [
  {
    id: "rail-etapa-1",
    label: "Etapa 1",
    title: "Reconócete para avanzar",
    lines: [
      "Identifica tu punto de partida con un autodiagnóstico individual y formativo.",
      "",
    ],
    kind: "stage",
    videoKey: "railEtapasIntro",
  },
  {
    id: "rail-etapa-2",
    label: "Etapa 2",
    title: "Descubre nuevas posibilidades",
    lines: [
      "Explora opciones de GenAI para apoyar una actividad real de tu docencia con criterio pedagógico y ético.",
      "",
    ],
    kind: "stage",
    videoKey: "railEtapa2Intro",
  },
  {
    id: "rail-etapa-3",
    label: "Etapa 3",
    title: "Diseña con propósito",
    lines: [
      "Transforma lo explorado en una experiencia de aprendizaje estructurada, coherente y mediada por GenAI.",
      "",
    ],
    kind: "stage",
    videoKey: "railEtapa3Intro",
  },
  {
    id: "rail-etapa-4",
    label: "Etapa 4",
    title: "Prepara el terreno para el éxito",
    lines: [
      "Convierte el diseño en condiciones operativas, logísticas y pedagógicas para un despliegue fluido y seguro.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-5",
    label: "Etapa 5",
    title: "Hazlo realidad en el aula",
    lines: [
      "Pon en práctica lo diseñado con criterio pedagógico y atención a la experiencia real de cada estudiante.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-6",
    label: "Etapa 6",
    title: "Reflexiona, aprende y mejora",
    lines: [
      "Analiza los resultados, recoge evidencias y ajusta tu práctica para fortalecer el aprendizaje mediado por GenAI.",
      "",
    ],
    kind: "stage",
  },
];

// ─── Diálogo de LaIA — Frame 4 ────────────────────────────────────────────────

export const F4_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Este recorrido no es lineal ni rígido. Cada etapa te ayudará a avanzar con mayor claridad, y podrás volver sobre ellas cuando lo necesites.",
    imgSrc: "/ui/laia.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion3.ogg",
  },
];

// ─── Diálogo de LaIA — Frame 5 (Asistencia guiada, no conversacional) ─────────
// Nota: la EMI conserva una referencia histórica a un chatbot que el proyecto
// eliminó. LaIA acompaña como guía visual no conversacional: orienta, señala
// controles y recuerda la ubicación dentro del modelo. (Ver contexto/context.md.)

export const F5_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "A lo largo del recorrido te acompañaré como guía: te indicaré qué hacer en cada momento, señalaré los controles importantes y te recordaré en qué etapa del modelo te encuentras.",
    imgSrc: "/ui/LaIA_explaining_holo.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion4-1.ogg",
  },
  {
    text: "¡Continuemos! Recuerda que puedes ubicarte en cualquier momento abriendo el mapa del modelo y volver a una etapa anterior cuando lo necesites.",
    imgSrc: "/ui/laia_explaining.png",
    audioSrc: "/audio/Audios_laia/introduccion/LaIAAudio-seccion4-2.ogg",
  },
];

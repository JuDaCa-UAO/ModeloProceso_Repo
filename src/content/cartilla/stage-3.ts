/**
 * CONTENT — Datos (Etapa 3 · Diseña con propósito)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e3`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_3: Stage = {
  id: "etapa-3",
  order: 3,
  officialName: OFFICIAL_STAGE_NAMES["etapa-3"],
  accent: { main: "var(--uao-stage-3-accent)", chip: "var(--uao-stage-3-chip)" },
  abrebocas: mediaKey("stage3.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 3",
    chapterLabel: "CAPÍTULO 3 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-3"],
    description:
      "Diseña una experiencia de aprendizaje concreta donde la IA cumpla un rol útil, ético y pedagógicamente justificado, evitando el uso acrítico.",
    tags: ["Objetivos claros", "Centrado en el estudiante"],
    laiaAvatar: mediaKey("laia.pose.neutral"),
  },
  laia: [
    {
      id: "e3-laia-1",
      text: "En esta etapa la IA deja de ser un accesorio: planificarás una experiencia donde su uso tenga una justificación pedagógica clara.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e3-laia-2",
      text: "La gran pregunta es: ¿cómo usar la IA para que tus estudiantes piensen más críticamente y no deleguen su trabajo en la herramienta?",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e3-laia-3",
      text: "Diseña objetivos, define las reglas éticas y determina el nivel de autonomía. ¡Sigue bajando para estructurarlo en el Canvas!",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa3-contenido",
      title: "Tu meta: una experiencia con sentido",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "Esta etapa es donde el docente convierte su idea en una experiencia de aprendizaje concreta. Ya no se trata solo de elegir una herramienta, sino de diseñar una actividad o conjunto de actividades donde la IA tenga un papel claro, útil y pedagógicamente justificado.",
            "La pregunta central que guía el diseño es: ¿cómo puedo usar la IA para que mis estudiantes aprendan mejor, piensen más críticamente y no simplemente deleguen su trabajo en una herramienta?",
          ],
        },
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Define los objetivos",
              description: "Resultados de aprendizaje esperados y cómo la GenAI aporta valor a lograrlos.",
            },
            {
              icon: "2",
              title: "Determina el nivel de uso",
              description: "Decide si la IA se restringe en partes, si se permite solo para lluvia de ideas, cocreación o uso total.",
            },
            {
              icon: "3",
              title: "Estructura la evaluación",
              description: "Criterios e indicadores que evalúan el proceso de aprendizaje del estudiante, no solo el producto de la IA.",
            },
          ],
        },

        {
          type: "bullets",
          title: "Qué organiza el Canvas de diseño",
          variant: "list",
          items: [
            "Objetivo y propuesta de valor — qué quieres lograr y qué aporta específicamente la IA a esa meta pedagógica.",
            "Actividades académicas — las tareas secuenciales que realizarán tus estudiantes y las didácticas activas implicadas.",
            "Soluciones de GenAI seleccionadas — qué herramienta utilizarán, por qué y con qué nivel de uso permitido.",
            "Niveles de uso permitido — restricciones en ciertas fases (fase libre de IA), uso para lluvia de ideas, uso para edición/mejora o integración completa con reflexión previa.",
            "Razonamiento crítico y mediaciones — qué preguntas plantearás y qué pausas harás para que analicen y validen las respuestas de la IA.",
            "Consideraciones éticas — las reglas éticas de aula, transparencia en coautoría y cuidado con los sesgos.",
            "Evaluación y retroalimentación — rúbricas orientadas a medir el proceso de pensamiento crítico y el seguimiento continuo.",
          ],
        },
        {
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "El alcance y la complejidad del diseño de tu experiencia de aula varían de acuerdo a tu nivel de apropiación:",
          items: [
            {
              hierarchy: "Inicial",
              title: "Inicial",
              description: "Diseñas una experiencia pequeña, puntual y controlada (una sola actividad sencilla con un objetivo concreto, límites claros y rúbrica básica). Buscas un diseño simple y seguro mediante un Canvas guiado, ejemplos resueltos, escala simple de uso y un banco básico de preguntas de aula.",
            },
            {
              hierarchy: "Intermedio",
              title: "Intermedio",
              description: "Diseñas una secuencia más estructurada y completa que integra varias fases en el mapa de experiencia (introducción, interacción guiada, análisis, socialización y retorno). Defines rúbricas detalladas para calificar tanto el proceso reflexivo como el producto final, aplicando la escala de uso con rigor.",
            },
            {
              hierarchy: "Avanzado",
              title: "Avanzado",
              description: "Diseñas experiencias robustas, complejas y potencialmente escalables, posiblemente articuladas a toda una trayectoria formativa o programa académico. Integras múltiples herramientas, configuras asistentes interactivos con prompts de sistema especializados y documentas tu diseño como un caso de estudio replicable.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Diseño",
              description: "Estrategias didácticas para diseñar actividades profundas que fortalezcan la intención formativa y el pensamiento reflexivo, evitando que la IA reemplace el esfuerzo cognitivo.",
            },
            {
              title: "Matriz de la experiencia",
              description: "Ordenador visual para secuenciar la actividad (inicio, exploración, interacción con IA, producción, cierre), definiendo los roles del docente, del estudiante y de la tecnología.",
            },
            {
              title: "Canvas de diseño",
              description: "El recurso central de la etapa. Plantilla visual en una sola página para integrar la propuesta de valor, nivel de uso permitido, dinámicas críticas, ética y evaluación.",
            },
            {
              title: "Escala de uso de IA",
              description: "Directrices para regular el nivel de autonomía y permisibilidad (escenario sin IA, IA solo para ideación, para coedición de textos o uso colaborativo total).",
            },
            {
              title: "Asistente de IA para diseño",
              description: "Tutor virtual que te ayuda a formular objetivos coherentes, estructurar las consignas de tu actividad escolar y planificar los indicadores de evaluación.",
            },
            {
              title: "Plantillas de apoyo",
              description: "Formatos descargables para estructurar las pautas éticas del aula, definir preguntas críticas de contrastación y estructurar la rúbrica de proceso.",
            },
          ],
        },

        {
          type: "download",
          mediaKey: mediaKey("stage3.designCanvas"),
          previewMediaKey: mediaKey("stage3.designCanvasPreview"),
          title: "Canvas de diseño",
          description: "Descarga la plantilla para diseñar tu propia experiencia de aprendizaje paso a paso.",
          information: "El Canvas etapa 3: Diseño de la experiencia de aprendizaje mediada por IA también corresponde a la Etapa 3: Diseño. Este recurso permite estructurar de manera integral la propuesta pedagógica de la experiencia. Incluye componentes como objetivo y propuesta de valor, actividades académicas, soluciones de GenAI seleccionadas, razonamiento crítico y mediaciones, consideraciones éticas y de diseño responsable, mecanismos de evaluación y retroalimentación, y mecanismos de seguimiento y mejora continua. Su utilidad está en convertir una intención inicial en una experiencia de aprendizaje coherente, donde la GenAI tenga un rol explícito y justificado. En la Cartilla Web, este canvas debe ayudar al docente a responder no solo qué herramienta usará, sino por qué la usará, en qué momento, con qué límites y con qué sentido pedagógico.",
          stageLabel: "Etapa 3 · Diseño",
          resourceType: "Canvas pedagógico",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage3.experienceMatrix"),
          previewMediaKey: mediaKey("stage3.experienceMatrixPreview"),
          title: "Matriz de la experiencia",
          description: "Mapea el antes, durante y después de la experiencia, cruzando acciones del estudiante, acciones docentes, recursos y tiempos.",
          information: "La Matriz de la experiencia, también presentada como Mapeo de la experiencia, corresponde principalmente a la Etapa 3: Diseño. Este recurso ayuda a organizar la experiencia de aprendizaje en tres momentos: antes, durante y después. En cada momento se identifican las acciones del estudiante, las acciones del docente, los recursos y herramientas necesarios, y los tiempos requeridos. Su función es permitir que el docente visualice la experiencia completa antes de implementarla, de modo que pueda anticipar qué debe preparar, cómo se desarrollará la actividad y qué apoyos serán necesarios. Aunque puede servir como insumo para el alistamiento y el despliegue, su ubicación principal debe ser la etapa de diseño, porque allí se define la estructura de la experiencia mediada por GenAI.",
          stageLabel: "Etapa 3 · Diseño",
          resourceType: "Mapa de experiencia",
        },
      ],
    },
  ],
  closing: {
    title: "Tu experiencia con propósito",
    message: "Este breve video resume lo clave del diseño con propósito. Míralo antes de seguir; te ayudará a afianzar la idea.",
    question: "¿Cómo aporta la IA al propósito pedagógico de la experiencia que quieres diseñar?",
    summaryVideo: mediaKey("stage3.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.neutral"),
    continueLabel: "Continuar a la Etapa 4 →",
    continueHref: "#etapa-4",
    accent: { main: "var(--uao-stage-3-closing-accent)", soft: "var(--uao-stage-3-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage3ToStage4"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-4"],
  },
};

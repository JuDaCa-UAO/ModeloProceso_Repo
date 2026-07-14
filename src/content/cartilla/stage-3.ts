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
              description: "Decide si la IA se restringe en partes, si se permite solo para lluvia de ideas, co-creación o uso total.",
            },
            {
              icon: "3",
              title: "Estructura la evaluación",
              description: "Criterios e indicadores que evalúan el proceso de aprendizaje del estudiante, no solo el producto de la IA.",
            },
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage3.designCanvasPreview"),
          caption: "Canvas de diseño: la guía para estructurar tu experiencia mediada por GenAI",
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
          type: "bullets",
          title: "Recursos que contiene esta etapa",
          variant: "list",
          items: [
            "Presentación: Diseño de experiencias de aprendizaje con GenAI — Explica cómo estructurar una experiencia de aprendizaje mediada por IA que sea activa, profunda y alineada con los resultados esperados del curso, evitando que el estudiante delegue ciegamente su esfuerzo cognitivo en el sistema.",
            "Plantilla de mapa de experiencia — Recurso visual para estructurar paso a paso el recorrido del estudiante en fases (inicio, exploración, interacción con IA, análisis crítico, producción propia, co-evaluación). Permite mapear qué hace el docente, qué hace el estudiante, qué hace la IA y qué evidencias se generan en cada momento.",
            "Modelo Canvas para el diseño de la experiencia — El recurso más importante de la etapa. Una estructura de una sola página que integra en bloques lógicos: la propuesta pedagógica, actividades, la solución de IA elegida, dinámicas de razonamiento crítico, reglas éticas de aula, rúbrica de evaluación y plan de seguimiento.",
            "Escala de uso de IA — Guía para regular la permisibilidad de uso de la IA en la actividad académica. Evita la dicotomía de 'permitir o prohibir' al delimitar escenarios: fases libres de IA (donde no se permite), uso limitado (lluvia de ideas/borradores) o uso guiado integrado (donde se permite evaluar y refinar con criterio).",
            "Asistente de IA para diseño — Tutor conversacional que ayuda al docente a afinar objetivos, estructurar consignas, formular preguntas que exijan análisis crítico y revisar la alineación pedagógica de la actividad.",
            "Plantillas de apoyo descargables — Formatos de trabajo listos para redactar las pautas de ética del aula, estructurar el rol y tareas de la IA, diseñar preguntas críticas y confeccionar la rúbrica inicial.",
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "El Canvas de diseño de la experiencia de aprendizaje mediada por IA: una planeación didáctica completa, coherente y detallada que especifica la actividad, el rol de la IA, el nivel de uso permitido, las pautas éticas y la rúbrica de evaluación.",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage3.designCanvas"),
          title: "Canvas de diseño",
          description: "Descarga la plantilla para diseñar tu propia experiencia de aprendizaje paso a paso.",
          label: "Descargar PDF ↓",
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

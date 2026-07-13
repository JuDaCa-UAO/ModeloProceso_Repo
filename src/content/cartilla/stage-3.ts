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
      "Planifica una experiencia de aprendizaje donde la IA no sea un accesorio, sino un recurso pedagógicamente justificado y centrado en el estudiante.",
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
      text: "Define objetivos, selecciona las tecnologías adecuadas y diseña actividades, recursos y evaluación centrados en tus estudiantes.",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa3-contenido",
      title: "Tu meta: una experiencia con sentido",
      blocks: [
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Define objetivos claros",
              description: "Qué quieres lograr y cómo se alinea con los resultados de aprendizaje de tu curso.",
            },
            {
              icon: "2",
              title: "Selecciona las tecnologías",
              description: "Las herramientas adecuadas para tu propósito — no las más novedosas, las más pertinentes.",
            },
            {
              icon: "3",
              title: "Diseña actividades y evaluación",
              description: "Recursos y mecanismos de evaluación que respondan a las necesidades reales de tus estudiantes.",
            },
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage3.designCanvasPreview"),
          caption: "Canvas de diseño: la guía para estructurar tu experiencia mediada por GenAI",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage3.designCanvas"),
          title: "Canvas de diseño",
          description: "Descarga la plantilla para diseñar tu propia experiencia paso a paso.",
          label: "Descargar PDF ↓",
        },
      ],
    },
  ],
  closing: {
    title: "Lo esencial de esta etapa",
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

/**
 * CONTENT — Datos (Etapa 6 · Reflexiona, aprende y mejora)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e6`). Cierre cíclico: `closing.final=true`,
 * `continueHref="#inicio"` (vuelve a la portada de la Introducción — mismo
 * id que usa `IntroPortada`). Sin `transition`: no hay "siguiente etapa".
 * Ver `contexto/context.md`, entrada de la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_6: Stage = {
  id: "etapa-6",
  order: 6,
  officialName: OFFICIAL_STAGE_NAMES["etapa-6"],
  accent: { main: "var(--uao-stage-6-accent)", chip: "var(--uao-stage-6-chip)" },
  cover: {
    badgeLabel: "ETAPA 6",
    chapterLabel: "CAPÍTULO 6 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-6"],
    description:
      "Evalúa la experiencia junto con tus estudiantes: logros, dificultades, percepciones y aprendizajes. Cada reflexión alimenta la próxima vuelta de la espiral.",
    tags: ["Evaluar", "Compartir", "Mejorar"],
    laiaAvatar: mediaKey("laia.pose.holo"),
  },
  laia: [
    {
      id: "e6-laia-1",
      text: "Última etapa de esta vuelta: detente a evaluar la experiencia junto con tus estudiantes.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e6-laia-2",
      text: "Revisen logros, dificultades, percepciones y aprendizajes. Esta reflexión mejora tus próximas implementaciones y puede orientar a otros colegas.",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e6-laia-3",
      text: "¡Y la espiral continúa! Cada nueva vuelta te encuentra con más experiencia, más confianza y más herramientas.",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa6-contenido",
      title: "Evaluar también es aprender",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "Esta reflexión crítica no solo mejora tus futuras implementaciones: genera conocimiento valioso que puede inspirar y orientar a otros colegas en la integración de la IA en la educación.",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage6.evaluationDimensions"),
          caption: "Evaluar no es solo calificar: dimensiones pedagógica, técnica, ética, emocional y cognitiva",
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage6.twoPerspectives"),
          caption: "Dos miradas sobre la experiencia: la del docente y la del estudiante",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage6.evaluationCanvas"),
          title: "Canvas de evaluación",
          description: "Plantilla para evaluar la experiencia con la mirada del docente y la del estudiante.",
          label: "Descargar PDF ↓",
        },
        { type: "narrative-video", mediaKey: mediaKey("stage6.newLoopVideo") },
      ],
    },
  ],
  closing: {
    title: "Lo esencial de esta etapa",
    message: "Cerramos con este resumen. Reúne lo esencial de la reflexión que transforma tu próxima vuelta en la espiral.",
    question: "Si repitieras esta experiencia, ¿qué cambiarías en el próximo ciclo?",
    summaryVideo: mediaKey("stage6.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.triumphant"),
    final: true,
    finalNote:
      "Volver al inicio no significa repetir el mismo recorrido. Regresas a «Reconócete para avanzar» con más experiencia, claridad y confianza: cada vuelta te lleva más lejos.",
    continueLabel: "Iniciar un nuevo ciclo ↻",
    continueHref: "#inicio",
    accent: { main: "var(--uao-stage-6-closing-accent)", soft: "var(--uao-stage-6-closing-soft)" },
  },
};

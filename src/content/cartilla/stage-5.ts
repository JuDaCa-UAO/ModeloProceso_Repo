/**
 * CONTENT — Datos (Etapa 5 · Hazlo realidad en el aula)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e5`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_5: Stage = {
  id: "etapa-5",
  order: 5,
  officialName: OFFICIAL_STAGE_NAMES["etapa-5"],
  accent: { main: "var(--uao-stage-5-accent)", chip: "var(--uao-stage-5-chip)" },
  abrebocas: mediaKey("stage5.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 5",
    chapterLabel: "CAPÍTULO 5 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-5"],
    description:
      "Pon en práctica tu diseño: acompaña a tus estudiantes, gestiona los recursos y articula la experiencia con el currículo.",
    tags: ["Guiar", "Motivar", "Documentar"],
    laiaAvatar: mediaKey("laia.pose.triumphant"),
  },
  laia: [
    {
      id: "e5-laia-1",
      text: "¡Llegó el momento de hacerlo realidad! Acompaña a tus estudiantes en el uso de la IA y gestiona los recursos digitales.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e5-laia-2",
      text: "Tu papel es guiar, motivar y documentar el proceso, articulando la experiencia con el currículo y otras actividades formativas.",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa5-contenido",
      title: "Tu papel durante la experiencia",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "¿Cómo acompañas a tus estudiantes para que usen la IA como apoyo para aprender, no como atajo para evitar pensar? Durante el despliegue, tu rol es de mediador: guías el uso de la IA, motivas la participación y documentas lo que ocurre para enriquecer tu práctica y generar aprendizajes compartidos con otros docentes.",
          ],
        },
        { type: "narrative-video", mediaKey: mediaKey("stage5.classroomSimulation") },
        { type: "narrative-video", mediaKey: mediaKey("stage5.teacherAsMediator") },
        {
          type: "infographic",
          mediaKey: mediaKey("stage5.teacherAsMediatorInfographic"),
          caption: "El docente como mediador: guía, observa, aclara, interviene y protege el propósito de la experiencia",
        },
        {
          type: "bullets",
          variant: "pills",
          items: ["Guía", "Observa", "Aclara", "Interviene", "Retroalimenta", "Documenta"],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage5.criticalMomentsInfographic"),
          caption: "Momentos críticos durante la experiencia: reconocerlos a tiempo te permite intervenir sin perder el propósito",
        },
        {
          type: "carousel",
          title: "Evidencias para mejorar",
          description:
            "Mientras la experiencia ocurre, documenta lo que pasa. Estas cinco evidencias serán el insumo de tu reflexión en la Etapa 6.",
          panels: [
            {
              id: "evidencia-1",
              label: "Dudas de estudiantes",
              description: "Qué preguntaron y en qué momentos se trabaron.",
              mediaKey: mediaKey("stage5.rail.1"),
            },
            {
              id: "evidencia-2",
              label: "Prompts usados",
              description: "Qué le pidieron a la IA y cómo formularon la instrucción.",
              mediaKey: mediaKey("stage5.rail.2"),
            },
            {
              id: "evidencia-3",
              label: "Productos generados",
              description: "Qué entregó la IA y qué hizo el estudiante con ese resultado.",
              mediaKey: mediaKey("stage5.rail.3"),
            },
            {
              id: "evidencia-4",
              label: "Comentarios y errores",
              description: "Qué falló, qué generó dudas o qué respuesta resultó poco confiable.",
              mediaKey: mediaKey("stage5.rail.4"),
            },
            {
              id: "evidencia-5",
              label: "Ajustes y decisiones",
              description: "Qué cambiaste sobre la marcha y por qué.",
              mediaKey: mediaKey("stage5.rail.5"),
            },
          ],
        },
      ],
    },
  ],
  closing: {
    title: "Tu acompañamiento en el aula",
    message: "Te dejo este resumen de tu rol durante la experiencia. Un repaso rápido antes de continuar.",
    question: "¿Qué observarás y documentarás mientras tus estudiantes usan la IA en el aula?",
    summaryVideo: mediaKey("stage5.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.triumphant"),
    continueLabel: "Continuar a la Etapa 6 →",
    continueHref: "#etapa-6",
    accent: { main: "var(--uao-stage-5-closing-accent)", soft: "var(--uao-stage-5-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage5ToStage6"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-6"],
  },
};

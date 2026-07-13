/**
 * CONTENT — Datos (Etapa 4 · Prepara el terreno para el éxito)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e4`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_4: Stage = {
  id: "etapa-4",
  order: 4,
  officialName: OFFICIAL_STAGE_NAMES["etapa-4"],
  accent: { main: "var(--uao-stage-4-accent)", chip: "var(--uao-stage-4-chip)" },
  abrebocas: mediaKey("stage4.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 4",
    chapterLabel: "CAPÍTULO 4 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-4"],
    description:
      "Alista cada detalle antes de poner en marcha la experiencia, para sentirte seguro/a y que la implementación fluya con solidez.",
    tags: ["Alistamiento", "Confianza"],
    laiaAvatar: mediaKey("laia.pose.explaining"),
  },
  laia: [
    {
      id: "e4-laia-1",
      text: "¡Casi listos para el aula! Antes de implementar, prepara cada detalle: herramientas, conectividad, retroalimentación y motivación.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e4-laia-2",
      text: "Este alistamiento te permitirá sentirte seguro/a y confiado/a para que la implementación fluya con solidez.",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa4-contenido",
      title: "Todo listo antes de empezar",
      blocks: [
        {
          type: "action-cards",
          cards: [
            { icon: "⚙", title: "Configura las herramientas", description: "Cuentas, accesos y pruebas previas de cada tecnología que usarás." },
            { icon: "⇅", title: "Garantiza la conectividad", description: "Condiciones técnicas del aula y alternativas si algo falla." },
            { icon: "✎", title: "Planifica la retroalimentación", description: "Cómo y cuándo darás retorno a tus estudiantes durante la experiencia." },
            { icon: "★", title: "Fortalece la motivación", description: "Prepara a tus estudiantes: qué harán, para qué y qué se espera de ellos." },
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage4.controlRoom"),
          caption: "La sala de control del alistamiento: verificación técnica, pedagógica y ético-emocional",
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage4.section2Media"),
          caption: "Checklist de preparación: verifica cada elemento antes de usar la IA en tu clase",
        },
        {
          type: "download",
          mediaKey: mediaKey("stage4.readinessCanvas"),
          title: "Canvas de alistamiento",
          description: "La lista de chequeo para verificar que todo está listo antes del aula.",
          label: "Descargar PDF ↓",
        },
      ],
    },
  ],
  closing: {
    title: "Lo esencial de esta etapa",
    message: "Antes de avanzar, revisa este resumen. Recoge lo esencial del alistamiento para llegar al aula con confianza.",
    question: "¿Qué necesitas preparar aún antes de llevar tu experiencia al aula?",
    summaryVideo: mediaKey("stage4.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.explaining"),
    continueLabel: "Continuar a la Etapa 5 →",
    continueHref: "#etapa-5",
    accent: { main: "var(--uao-stage-4-closing-accent)", soft: "var(--uao-stage-4-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage4ToStage5"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-5"],
  },
};

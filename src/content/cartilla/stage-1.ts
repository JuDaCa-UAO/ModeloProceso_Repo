/**
 * CONTENT — Datos (Etapa 1 · Reconócete para avanzar)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `e1Steps`). El diseño NO muestra formulario de
 * consentimiento ni checkboxes — solo 3 tarjetas explicativas, un aviso
 * "RECUERDA" y un botón "Comenzar →" (bloque `autodiagnostic`; la Fase 13
 * lo conecta al iframe n8n real tras `IAutodiagnosticGateway`). Ver
 * `contexto/context.md`, entrada de la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_1: Stage = {
  id: "etapa-1",
  order: 1,
  officialName: OFFICIAL_STAGE_NAMES["etapa-1"],
  accent: { main: "var(--uao-stage-1-accent)", chip: "var(--uao-stage-1-chip)" },
  abrebocas: mediaKey("stage1.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 1",
    chapterLabel: "CAPÍTULO 1 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-1"],
    description:
      "Detente a mirarte con honestidad: ¿qué tanto conoces y usas la IA en tu práctica docente? Aquí identificas tu punto de partida para elegir la ruta más adecuada para ti.",
    tags: ["Individual", "Confidencial", "No es un examen"],
    laiaAvatar: mediaKey("laia.pose.explaining"),
  },
  laia: [
    {
      id: "e1-laia-1",
      text: "¡Llegamos a la primera etapa! Antes de explorar herramientas, necesitamos saber desde dónde partes. Por eso empezamos por ti.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e1-laia-2",
      text: "Harás un autodiagnóstico individual y confidencial. Tranquilo/a: no es una evaluación ni te pone una nota. Es tu punto de referencia.",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e1-laia-3",
      text: "Con tu estado identificado, la espiral se adapta a tu ritmo. ¡Sigue bajando para ver cómo funciona!",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa1-contenido",
      title: "Mírate con honestidad",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "Esta etapa es una pausa para reconocer tu relación actual con la IA. A través de un autodiagnóstico individual y confidencial identificas tu estado de partida. No hay respuestas buenas ni malas: solo un mapa honesto de dónde estás hoy.",
          ],
        },
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Responde el autodiagnóstico",
              description: "Un ejercicio breve sobre qué tanto conoces y usas la IA en tu docencia. Tus respuestas son solo tuyas.",
            },
            {
              icon: "2",
              title: "Descubre tu estado",
              description:
                "El resultado te ubica en uno de los tres estados: aprendiendo sin miedo, explorando con propósito o innovando e inspirando.",
            },
            {
              icon: "3",
              title: "Elige tu ruta",
              description: "Con tu punto de partida claro, la espiral te propone un recorrido a tu ritmo, con tus propias necesidades.",
            },
          ],
        },
        {
          type: "bullets",
          title: "Qué explora tu autodiagnóstico",
          variant: "list",
          items: [
            "Conocimiento de IA — qué tanto conoces sus posibilidades y sus límites.",
            "Uso pedagógico — si ya la has llevado a tu práctica de aula.",
            "Criterio ético — qué tan atento estás a sus riesgos y responsabilidades.",
            "Pensamiento crítico — si verificas y cuestionas lo que la IA produce.",
            "Disposición al cambio — qué tan dispuesto estás a experimentar.",
          ],
        },
        {
          type: "state-cards",
          items: [
            {
              hierarchy: "Inicial",
              title: "Aprendiendo sin miedo",
              description:
                "Estás dando tus primeros pasos con la GenAI y es natural sentir incertidumbre. El objetivo no es saberlo todo, sino familiarizarte, perder el miedo y ganar confianza con acompañamiento y formación básica.",
            },
            {
              hierarchy: "Intermedio",
              title: "Explorando con propósito",
              description:
                "Ya integras herramientas de GenAI en tu día a día: creas materiales, actividades o retroalimentación. El reto es seguir explorando con intención hacia un uso más estratégico y creativo.",
            },
            {
              hierarchy: "Avanzado",
              title: "Innovando e inspirando",
              description:
                "Usas la GenAI de forma crítica, creativa y estratégica; la adaptas, la personalizas y piensas en su ética. Eres referente: puedes inspirar y acompañar a otros colegas.",
            },
          ],
        },
        {
          type: "callout",
          title: "RECUERDA",
          body: "No es un examen ni una etiqueta fija: es un punto de referencia que puede cambiar con cada vuelta de la espiral.",
        },
        {
          type: "autodiagnostic",
          title: "Haz tu autodiagnóstico",
          description:
            "El cuestionario se realiza dentro del aplicativo. Al terminar, recibirás tu estado inicial y podrás continuar con la Etapa 2.",
          ctaLabel: "Comenzar →",
        },
      ],
    },
  ],
  closing: {
    title: "Tu punto de partida",
    message: "Antes de continuar, un resumen breve: te ayuda a reconocer tu punto de partida y a saber qué fortalecer antes de avanzar.",
    question: "¿Qué reconociste sobre tu relación actual con la IA en tu práctica docente?",
    summaryVideo: mediaKey("stage1.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.explaining"),
    continueLabel: "Continuar a la Etapa 2 →",
    continueHref: "#etapa-2",
    accent: { main: "var(--uao-stage-1-closing-accent)", soft: "var(--uao-stage-1-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage1ToStage2"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-2"],
  },
};

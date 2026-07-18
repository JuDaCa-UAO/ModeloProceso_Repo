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
import { N8N_AUTODIAGNOSTIC_FORM_URL } from "@/infrastructure/n8n/n8n.config";

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
      "Esta etapa es el punto de partida. Aquí te miras a ti mismo y reconoces qué tanto sabes, usas y comprendes la GenAI en tu práctica educativa.",
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
      text: "Harás un autodiagnóstico individual y confidencial. No se trata de calificarte ni juzgarte, sino de ayudarte a identificar tu nivel inicial, intermedio o avanzado.",
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
            "Esta etapa es el punto de partida. Aquí el docente se mira a sí mismo y reconoce qué tanto sabe, usa y comprende la GenAI en su práctica educativa. No se trata de calificarlo ni de juzgarlo. Se trata de ayudarle a identificar desde dónde empieza: si está en un nivel inicial, intermedio o avanzado.",
            "Para esto, el docente realiza un autodiagnóstico individual y confidencial sobre su relación actual con la IA. Responderá preguntas clave tipo escala Likert para evaluar su conocimiento de la IA, su uso pedagógico en el aula, su criterio ético frente a riesgos, su capacidad para analizar críticamente las respuestas de la IA y su disposición emocional frente al cambio tecnológico.",
          ],
        },
        {
          type: "action-cards",
          cards: [
            {
              icon: "1",
              title: "Responde el autodiagnóstico",
              description: "Preguntas tipo escala Likert sobre conocimiento de la IA, uso pedagógico, criterios éticos, análisis crítico y disposición emocional frente al cambio.",
            },
            {
              icon: "2",
              title: "Descubre tu nivel de madurez",
              description:
                "Identifica si te encuentras en un nivel inicial, intermedio o avanzado. Este nivel no es una etiqueta fija, sino una orientación sobre el acompañamiento que necesitas.",
            },
            {
              icon: "3",
              title: "Elige tu ruta",
              description: "Con tu punto de partida claro, la espiral te propone un recorrido a tu ritmo para saber qué aspectos fortalecer antes de avanzar.",
            },
          ],
        },
        {
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "Tu nivel de apropiación define el enfoque del diagnóstico y la ruta recomendada:",
          items: [
            {
              hierarchy: "Inicial",
              title: "Inicial",
              description: "El diagnóstico te ayuda a reconocer que necesitas empezar por lo básico: comprender qué es la IA generativa, qué puede y no puede hacer, y cuáles son sus riesgos sin sentirte abrumado. Te orienta hacia la comprensión elemental.",
            },
            {
              hierarchy: "Intermedio",
              title: "Intermedio",
              description: "Te ayuda a identificar vacíos específicos (criterios éticos, evaluación de procesos o promoción de pensamiento crítico) para estructurar y dar un uso más intencional a lo que ya vienes haciendo.",
            },
            {
              hierarchy: "Avanzado",
              title: "Avanzado",
              description: "Sirve para consolidar tus fortalezas y detectar áreas de mejora estratégica, orientándote hacia retos más complejos, como la personalización de asistentes, el coliderazgo con pares y la innovación pedagógica.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Fundamentos",
              description: "Explica detalladamente la estructura progresiva en espiral, los niveles (inicial, intermedio, avanzado) y la IA como práctica pedagógica, ética y crítica, no solo técnica.",
            },
            {
              title: "Formulario de autodiagnóstico",
              description: "Instrumento interactivo con preguntas Likert sobre conocimiento técnico, aplicaciones en aula, criterios éticos, razonamiento crítico y actitud al cambio.",
            },
            {
              title: "Agente de IA de apoyo",
              description: "Tutor virtual que te acompaña conversacionalmente durante el formulario para resolver dudas y interpretar enunciados de forma guiada.",
            },
            {
              title: "Resultado de nivel docente",
              description: "Determina si tu perfil es: Inicial (requiere bases), Intermedio (fortalecer diseño y evaluación) o Avanzado (autonomía y guía a colegas).",
            },
            {
              title: "Recomendaciones personalizadas",
              description: "Pautas de acción a medida: comenzar simple con una herramienta para el nivel Inicial, comparar opciones para el nivel Intermedio, o socializar prácticas y coliderar para el nivel Avanzado.",
            },
          ],
        },
        {
          type: "callout",
          title: "Producto que deja esta etapa",
          body: "El estado inicial del docente: un diagnóstico interactivo de tu nivel de madurez de partida (inicial, intermedio o avanzado) que integra tus fortalezas pedagógicas actuales, los aspectos específicos a mejorar y recomendaciones personalizadas para continuar el recorrido.",
        },
        {
          type: "callout",
          title: "Recuerda",
          body: "El nivel obtenido no es una etiqueta fija: es una orientación inicial que se actualiza con cada nueva vuelta en la espiral de aprendizaje.",
        },
        {
          type: "autodiagnostic",
          title: "Haz tu autodiagnóstico",
          description:
            "El cuestionario se realiza de manera integrada. Al terminar, recibirás resultados detallados por dimensiones y podrás continuar con la Etapa 2.",
          ctaLabel: "Comenzar →",
          formUrl: N8N_AUTODIAGNOSTIC_FORM_URL,
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

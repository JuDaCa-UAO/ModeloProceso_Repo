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
      "Esta etapa es el punto de partida. Aquí te miras a ti mismo y reconoces qué tanto sabes, usas y comprendes la inteligencia artificial generativa en tu práctica educativa.",
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
      text: "Harás un autodiagnóstico individual y confidencial. No se trata de calificarte ni juzgarte, sino de ayudarte a identificar tu nivel inicial (M1), intermedio (M2) o avanzado (M3).",
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
            "Esta etapa es el punto de partida. Aquí el docente se mira a sí mismo y reconoce qué tanto sabe, usa y comprende la inteligencia artificial generativa en su práctica educativa. No se trata de calificarlo ni de juzgarlo. Se trata de ayudarle a identificar desde dónde empieza: si está en un nivel inicial, intermedio o avanzado.",
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
                "Identifica si te encuentras en un nivel M1 inicial, M2 intermedio o M3 avanzado. Este nivel no es una etiqueta fija, sino una orientación sobre el acompañamiento que necesitas.",
            },
            {
              icon: "3",
              title: "Elige tu ruta",
              description: "Con tu punto de partida claro, la espiral te propone un recorrido a tu ritmo para saber qué aspectos fortalecer antes de avanzar.",
            },
          ],
        },
        {
          type: "bullets",
          title: "Recursos que contiene esta etapa",
          variant: "list",
          items: [
            "Presentación: Fundamentos del modelo de proceso — Explica detalladamente qué es el modelo, por qué se estructura en forma de espiral y aclara tres ideas clave: que el avance es progresivo (no hay que dominar la IA al inicio), que existen niveles de apropiación (M1, M2, M3) y que el uso de IA exige reflexión pedagógica, ética y crítica, no solo habilidades técnicas.",
            "Formulario de autodiagnóstico — Instrumento interactivo estructurado con preguntas tipo escala Likert para evaluar tu relación real con la IA en base a conocimiento técnico-conceptual, uso pedagógico en aula, criterio ético, pensamiento crítico y actitud emocional ante el cambio.",
            "Agente de IA para el autodiagnóstico — Asistente conversacional que acompaña la resolución del formulario para aclarar preguntas, dar pautas personalizadas y ayudar a interpretar los enunciados de manera comprensible.",
            "Resultado del nivel docente — Calificación resultante que te sitúa en: M1 Inicial (conoce poco y requiere conceptos básicos, ejemplos sencillos y apoyo), M2 Intermedio (ya usa herramientas con intención pedagógica pero busca fortalecer criterios de diseño y evaluación) o M3 Avanzado (diseña experiencias complejas con autonomía y puede guiar a otros docentes).",
            "Recomendaciones personalizadas — Pautas de acción específicas según tu nivel de madurez: iniciar con actividades simples y una sola herramienta para M1, comparar con la Matriz de Pugh para M2, o experimentar con diseños avanzados y socializar prácticas para M3.",
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "El Perfil Inicial del Docente: un diagnóstico completo de tu nivel de madurez de partida (M1, M2 o M3), detallando tus fortalezas pedagógicas actuales, aspectos específicos por mejorar y recomendaciones personalizadas para arrancar tu proceso.",
        },
        {
          type: "callout",
          title: "RECUERDA",
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

/**
 * CONTENT — Datos (Introducción)
 *
 * Autoría de la Introducción real (Fase 7). Única fuente de contenido: el
 * diseño importado `Cartilla.dc.html` (proyecto Claude Design), leído
 * verbatim vía MCP DesignSync. Por directiva explícita del usuario
 * (2026-07-10): `contexto/fuentes/EMI_escrita.md`, `content/dialogs/*` y el
 * resto de contenido/etapas viejas NO se toman en cuenta como fuente de
 * texto — se descartan y se reemplazan por completo con el diseño.
 *
 * - **Diálogo de LaIA** (`INTRO_LAIA_MESSAGES`): las líneas aprobadas para la
 *   introducción, sin instrucciones de interacción con el modelo 3D superior.
 *   `audioKey` se omite a propósito: los audios nuevos de LaIA son la Fase 9.
 * - **Secciones de contenido** (`INTRO_SECTIONS`): texto estático del cuerpo
 *   del `.dc.html` (fuera de cualquier `{{ }}`/`DCLogic`), transcrito sin
 *   parafrasear.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { LaiaMessage } from "@domain/content/LaiaMessage";
import type { Section } from "@domain/content/Section";
import type { IntroCover } from "@domain/content/Cartilla";
import type { StageTransition } from "@domain/content/Stage";

export const INTRO_COVER: IntroCover = {
  title: "Modelo en espiral para integrar la IA generativa en tu docencia",
  quote: "No tengo ningún talento especial. Solo soy apasionadamente curioso.",
  quoteAuthor: "Albert Einstein",
  description:
    "Un recorrido de descubrimiento, reflexión y transformación para llevar la GenAI (Inteligencia artificial generativa) al aula de forma crítica, creativa y responsable.",
};

// ─── Diálogo de LaIA ─────────────────────────────────────────────────────────

export const INTRO_LAIA_MESSAGES: LaiaMessage[] = [
  {
    id: "intro-laia-1",
    text: "¡Hola! Soy LaIA, tu asistente en esta aventura de aprendizaje. Esta cartilla informativa presenta el modelo de proceso en espiral para integrar la IA generativa en tu docencia, y te acompañaré paso a paso para llevar la GenAI a tu práctica docente.",
    avatarKey: mediaKey("laia.pose.neutral"),
  },
  {
    id: "intro-laia-2",
    text: "En este primer capítulo conocerás la metodología: qué es el modelo en espiral, por qué tiene esa forma y los tres estados en los que puedes encontrarte como docente.",
    avatarKey: mediaKey("laia.pose.explaining"),
  },
  {
    id: "intro-laia-3",
    text: "¡Perfecto! Sigue desplazándote hacia abajo y descubre por qué hablamos de una espiral. Nos vemos en las siguientes secciones.",
    avatarKey: mediaKey("laia.pose.triumphant"),
  },
];

// ─── Secciones de contenido (texto verbatim del diseño, ver cabecera) ────────

export const INTRO_SECTIONS: Section[] = [
  {
    id: "intro-curiosidad",
    title: "¿Por qué integrar la IA en tu práctica docente?",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "¿Qué tareas de tu labor podrían ser más ágiles, creativas o significativas con el apoyo de la inteligencia artificial? Más que incorporar una herramienta por tendencia, se trata de descubrir cómo puede ayudarte a planear actividades, generar materiales, explorar nuevas formas de explicar un tema y ofrecer respuestas más ajustadas a las necesidades de tus estudiantes.",
          "La IA no reemplaza tu experiencia ni tu criterio pedagógico. Puede convertirse en una aliada para ahorrar tiempo, ampliar tus posibilidades y concentrarte en lo que realmente aporta valor: acompañar, orientar y diseñar mejores experiencias de aprendizaje. La pregunta no es solo qué puede hacer la IA, sino qué podrías lograr tú con ella al utilizarla de manera crítica, creativa y responsable.",
        ],
      },
      {
        type: "bullets",
        variant: "pills",
        items: ["Descubrimiento", "Reflexión", "Transformación", "Comunidad"],
      },
    ],
  },
  {
    id: "intro-por-que-espiral",
    title: "¿Por qué hablamos de una espiral?",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "A diferencia de los modelos lineales —que empiezan en un punto y terminan en otro—, la espiral simboliza un recorrido dinámico y flexible: cada vuelta no te devuelve al mismo lugar, sino que te hace avanzar con más experiencia, confianza y herramientas.",
        ],
      },
      {
        type: "action-cards",
        cards: [
          {
            icon: "↻",
            title: "Cada vuelta suma",
            description:
              "Empiezas desde tu nivel actual: en cada ciclo fortaleces lo que sabes, pruebas ideas nuevas y ajustas lo necesario.",
          },
          {
            icon: "⇄",
            title: "No caminas solo",
            description:
              "Cada ciclo integra la mirada de estudiantes, colegas y expertos: la retroalimentación es parte natural del proceso.",
          },
          {
            icon: "◎",
            title: "Humana y ética",
            description:
              "Apropiarse de la GenAI no es solo técnica: cada vuelta invita a reflexionar sobre cómo la usas y cómo impacta a tus estudiantes.",
          },
          {
            icon: "⤳",
            title: "Ruta abierta",
            description:
              "No es un camino rígido: es una ruta adaptable para crecer paso a paso y transformar tu docencia con confianza.",
          },
        ],
      },
    ],
  },
  {
    id: "intro-tres-estados",
    title: "¿Dónde estás hoy? Los tres estados",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "En cada etapa del modelo puedes encontrarte en distintos estados según tu uso actual de la IA. No son etiquetas ni juicios de valor: son puntos de referencia para reconocer dónde estás y avanzar a tu propio ritmo.",
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
    ],
  },
];

export const INTRO_TRANSITION: StageTransition = {
  mediaKey: mediaKey("transitions.introToStage1"),
  nextStageName: OFFICIAL_STAGE_NAMES["etapa-1"],
};

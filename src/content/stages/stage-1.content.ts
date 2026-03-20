import type { RailPanel, SectionNode, StateCardItem } from "@/types/stage";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

export const STAGE1_ID = "etapa-1";
export const STAGE1_NAME = "Reconocete para avanzar";

export const STATE_CARDS: StateCardItem[] = [
  {
    hierarchy: "Inicial",
    title: "Aprendiendo sin miedo",
    description: "Primeras aproximaciones con curiosidad y necesidad de guia clara.",
    supportHint:
      "Recibiras apoyo mas guiado, ejemplos listos para adaptar y recomendaciones paso a paso.",
  },
  {
    hierarchy: "Intermedio",
    title: "Explorando con proposito",
    description:
      "Ya experimentas con intencion educativa y buscas mayor coherencia pedagogica.",
    supportHint:
      "Recibiras recomendaciones para fortalecer decisiones didacticas, criticas y eticas.",
  },
  {
    hierarchy: "Avanzado",
    title: "Innovando e inspirando",
    description:
      "Integras GenAI de forma critica, creativa y estrategica en distintos contextos.",
    supportHint:
      "Recibiras retos de mayor profundidad y oportunidades para compartir aprendizajes.",
  },
];

export const FACTORS = [
  'F1 Proposito - "¿Que actividad transformar con sentido pedagogico?"',
  'F2 Razonamiento critico - "¿Que proceso cognitivo debe hacer el estudiante?"',
  'F3 Etica - "¿Que consideraciones eticas y de responsabilidad hay?"',
  'F4 Herramientas - "¿Que herramientas se incorporan?"',
  'F5 Reflexion - "¿Que se aprende y mejora del proceso?"',
];

export const RAIL_PANELS: RailPanel[] = [
  {
    id: "intro",
    kind: "intro",
    label: "Introduccion",
    title: "Recorrido del modelo",
    lines: [
      "Desliza hacia abajo para recorrer las 6 etapas del modelo.",
      "No es un camino rigido: puedes avanzar a tu ritmo y volver cuando lo necesites.",
    ],
  },
  {
    id: "etapa-1",
    label: "Etapa 1",
    title: "Reconocete para avanzar",
    lines: [
      "Identifica tu punto de partida con un ejercicio individual y confidencial.",
      "No es un examen: orienta tu ruta.",
    ],
  },
  {
    id: "etapa-2",
    label: "Etapa 2",
    title: "Descubre nuevas posibilidades",
    lines: [
      "Explora herramientas y usos educativos de GenAI.",
      "Reconoce beneficios, limites e implicaciones eticas.",
    ],
  },
  {
    id: "etapa-3",
    label: "Etapa 3",
    title: "Disena con proposito",
    lines: [
      "Planifica una experiencia con IA justificada pedagogicamente.",
      "Define objetivos, actividades y evaluacion.",
    ],
  },
  {
    id: "etapa-4",
    label: "Etapa 4",
    title: "Prepara el terreno para el exito",
    lines: [
      "Alista herramientas, condiciones y acompanamiento.",
      "Busca una implementacion solida y segura.",
    ],
  },
  {
    id: "etapa-5",
    label: "Etapa 5",
    title: "Hazlo realidad en el aula",
    lines: [
      "Implementa la experiencia y guia a tus estudiantes.",
      "Gestiona recursos y documenta el proceso.",
    ],
  },
  {
    id: "etapa-6",
    label: "Etapa 6",
    title: "Reflexiona, aprende y mejora",
    lines: [
      "Evalua logros y dificultades para ajustar el siguiente ciclo.",
      "Mejora de forma continua.",
    ],
  },
];

export const STAGE1_TREE: SectionNode[] = [
  {
    id: "reconocete-para-avanzar",
    title: "Reconocete para avanzar",
    subtitle:
      "Base oficial de preparacion para la siguiente implementacion de la Etapa 1.",
    surface: "plain",
    dialogue: [
      {
        text: "Esta etapa te ubica dentro del modelo y prepara el autodiagnostico que orientara el resto del recorrido.",
        imgSrc: LAIA_ASSETS.neutral,
        imgAlt: "Laia presenta la etapa 1",
      },
    ],
    content: [],
    children: [
      {
        id: "presentacion-modelo",
        title: "Presentacion amplia del modelo",
        subtitle:
          "La presentacion inicial debe verse completa antes de habilitar el resto del recorrido.",
        surface: "plain",
        content: [{ type: "stage1-animation" }],
        gate: { completionFlag: "stage1AnimationViewed" },
        children: [
          {
            id: "ubicacion-modelo",
            title: "Donde estas dentro del modelo",
            subtitle:
              "Primero se aclara la posicion actual del docente dentro de la espiral.",
            surface: "plain",
            gate: { requires: ["stage1AnimationViewed"] },
            dialogue: [
              {
                text: "Antes de recorrer todas las etapas, conviene entender que papel cumple esta primera parada dentro de la espiral.",
                imgSrc: LAIA_ASSETS.explain,
                imgAlt: "Laia explica la ubicacion actual en el modelo",
              },
            ],
            content: [
              {
                type: "paragraphs",
                paragraphs: [
                  "Etapa 1 abre el recorrido con una lectura de punto de partida, no con una evaluacion.",
                  "La ubicacion inicial ayuda a interpretar con calma el resto de la espiral y a entender que acompanamiento necesitara el docente.",
                ],
              },
            ],
            children: [
              {
                id: "rail-etapas",
                title: "Recorrido general de las 6 etapas",
                subtitle:
                  "Resumen breve del modelo, ahora ubicado despues de la explicacion de contexto.",
                surface: "plain",
                gate: { requires: ["stage1AnimationViewed"] },
                content: [{ type: "horizontal-rail", panels: RAIL_PANELS }],
                children: [
                  {
                    id: "estados-recorrido",
                    title: "Estados del recorrido",
                    subtitle:
                      "Los estados orientan el acompanamiento y no funcionan como etiquetas ni juicios.",
                    surface: "plain",
                    gate: { requires: ["stage1AnimationViewed"] },
                    dialogue: [
                      {
                        text: "Los estados ayudan a modular apoyos y recomendaciones. No bloquean contenido ni clasifican a nadie de forma definitiva.",
                        imgSrc: LAIA_ASSETS.explain,
                        imgAlt: "Laia explica los estados del recorrido",
                      },
                    ],
                    content: [
                      {
                        type: "paragraphs",
                        paragraphs: [
                          "El autodiagnostico busca ubicar tu punto de partida con claridad y sin convertirlo en un examen.",
                          "Los factores del modelo ayudan a interpretar ese punto de partida con criterio pedagogico, critico y etico.",
                        ],
                      },
                      { type: "state-cards", items: STATE_CARDS },
                      { type: "bullets", title: "Factores del modelo", items: FACTORS },
                    ],
                    children: [
                      {
                        id: "consentimiento",
                        title: "Confianza y consentimiento",
                        subtitle:
                          "Validacion minima antes de habilitar el autodiagnostico embebido.",
                        surface: "plain",
                        dialogue: [
                          {
                            text: "Este ejercicio es individual, objetivo y confidencial. No tiene efectos administrativos. Su unico proposito es orientar el camino formativo.",
                            imgSrc: LAIA_ASSETS.explain,
                            imgAlt: "Laia explica confidencialidad",
                          },
                        ],
                        content: [{ type: "consent-form" }],
                        children: [
                          {
                            id: "autodiagnostico",
                            title: "Autodiagnostico",
                            subtitle:
                              "Completa el modulo para identificar tu punto de partida.",
                            surface: "plain",
                            gate: {
                              requires: ["consentValidated", "autodiagnosticStarted"],
                            },
                            content: [{ type: "autodiagnostic-module" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

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
      "Recibiras apoyo guiado, ejemplos listos para adaptar y acompanamiento paso a paso.",
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

export const MODEL_FACTORS = [
  'F1 Proposito - "Que actividad transformar con sentido pedagogico?"',
  'F2 Razonamiento critico - "Que proceso cognitivo debe activar el estudiante?"',
  'F3 Etica - "Que consideraciones eticas y de responsabilidad deben cuidarse?"',
  'F4 Herramientas - "Que herramientas se incorporan y para que?"',
  'F5 Reflexion - "Que se aprende y mejora del proceso?"',
];

export const RAIL_PANELS: RailPanel[] = [
  {
    id: "intro",
    kind: "intro",
    label: "Introduccion",
    title: "Recorrido del modelo",
    lines: [
      "Desliza hacia abajo para recorrer las 6 etapas del modelo.",
      "El recorrido es progresivo, acumulativo y flexible para continuar donde lo necesites.",
    ],
  },
  {
    id: "etapa-1",
    label: "Etapa 1",
    title: "Reconocete para avanzar",
    lines: [
      "Identifica tu punto de partida con un ejercicio individual y confidencial.",
      "La lectura inicial orienta el acompanamiento y prepara el resto del recorrido.",
    ],
  },
  {
    id: "etapa-2",
    label: "Etapa 2",
    title: "Descubre nuevas posibilidades",
    lines: [
      "Explora herramientas y usos educativos de GenAI.",
      "Reconoce beneficios, limites e implicaciones eticas antes de disenar.",
    ],
  },
  {
    id: "etapa-3",
    label: "Etapa 3",
    title: "Disena con proposito",
    lines: [
      "Planifica una experiencia con IA justificada pedagogicamente.",
      "Define objetivos, actividades y criterios de evaluacion.",
    ],
  },
  {
    id: "etapa-4",
    label: "Etapa 4",
    title: "Prepara el terreno para el exito",
    lines: [
      "Alista herramientas, condiciones y acompanamiento.",
      "Busca una implementacion solida, segura y contextualizada.",
    ],
  },
  {
    id: "etapa-5",
    label: "Etapa 5",
    title: "Hazlo realidad en el aula",
    lines: [
      "Implementa la experiencia y guia a tus estudiantes.",
      "Gestiona recursos, observaciones y evidencias del proceso.",
    ],
  },
  {
    id: "etapa-6",
    label: "Etapa 6",
    title: "Reflexiona, aprende y mejora",
    lines: [
      "Evalua logros y dificultades para ajustar el siguiente ciclo.",
      "Convierte la experiencia en mejora continua e intercambio con colegas.",
    ],
  },
];

export const STAGE1_TREE: SectionNode[] = [
  {
    id: "entrada-etapa-1",
    title: STAGE1_NAME,
    subtitle:
      "Pantalla inicial de la Etapa 1 con Laia y CTA principal de inicio.",
    surface: "plain",
    content: [
      {
        type: "stage-entry",
        eyebrow: "Etapa 1",
        copy: [
          "Bienvenida al punto de entrada del recorrido. Aqui empezamos por reconocer en que lugar de la espiral te encuentras antes de abrir el resto del modelo.",
          "Laia presenta esta etapa y el CTA principal te lleva a la animacion amplia que activa el acceso global a etapas.",
        ],
        ctaLabel: "Iniciar recorrido",
        targetId: "presentacion-inicial-modelo",
        characterSrc: LAIA_ASSETS.neutral,
        characterAlt: "Laia da la bienvenida a la etapa 1",
      },
    ],
    children: [
      {
        id: "presentacion-inicial-modelo",
        title: "Presentacion inicial del modelo",
        subtitle:
          "Segmento amplio de apertura. El resto del stage se revela despues de esta presentacion.",
        surface: "plain",
        content: [{ type: "stage1-animation" }],
        gate: { completionFlag: "stage1AnimationViewed" },
        children: [
          {
            id: "progresion-modelo",
            title: "Progresion dentro del modelo",
            subtitle:
              "Explica la posicion actual dentro de la espiral y activa el viewer 3D persistente como referencia.",
            surface: "plain",
            gate: { requires: ["stage1AnimationViewed"] },
            content: [
              {
                type: "paragraphs",
                paragraphs: [
                  "Etapa 1 abre el recorrido con una lectura de punto de partida, no con una evaluacion administrativa.",
                  "Desde este momento el viewer 3D queda visible como orientacion persistente de la etapa actual, sin sustituir el sistema de continuidad.",
                ],
              },
              {
                type: "scaffold-panel",
                label: "Progresion",
                body:
                  "Este bloque deja preparado el espacio para explicar en que parte de la espiral esta el docente y como se mantendra la referencia visual en el viewer reducido.",
                items: [
                  "Viewer 3D persistente en la esquina superior derecha.",
                  "Etapa actual destacada de forma clara.",
                  "Separacion entre orientacion visual y continuidad del recorrido.",
                ],
                tone: "accent",
              },
            ],
            children: [
              {
                id: "laia-orientacion",
                title: "Laia como guia del recorrido",
                subtitle:
                  "Slot estructural para la narracion, la guia de interfaz y el futuro soporte de audio.",
                surface: "plain",
                gate: { requires: ["stage1AnimationViewed"] },
                dialogue: [
                  {
                    text: "Seguire acompaniandote por texto y mas adelante tambien por audio, pero sin competir con los momentos donde el foco debe quedar en el embebido.",
                    imgSrc: LAIA_ASSETS.holo,
                    imgAlt: "Laia explica su rol de guia",
                  },
                ],
                content: [
                  {
                    type: "scaffold-panel",
                    label: "Laia",
                    body:
                      "La estructura ya reserva el espacio para texto, audio, momentos de silencio y ayudas contextuales de Laia sin mezclar esa responsabilidad con el embebido.",
                    actions: [
                      {
                        label: "Texto guiado",
                        detail: "Activo como base del recorrido.",
                        state: "ready",
                      },
                      {
                        label: "Audio por bloque",
                        detail: "Reservado para integrarse sin cambiar la estructura de la etapa.",
                        state: "future",
                      },
                      {
                        label: "Minimizacion contextual",
                        detail: "Prevista para el tramo del autodiagnostico.",
                        state: "future",
                      },
                    ],
                  },
                ],
                children: [
                  {
                    id: "scroll-recorrido",
                    title: "Scroll vertical y reveal acumulativo",
                    subtitle:
                      "Marco estructural del desplazamiento principal del stage.",
                    surface: "plain",
                    gate: { requires: ["stage1AnimationViewed"] },
                    content: [
                      {
                        type: "scaffold-panel",
                        label: "Scroll",
                        body:
                          "El recorrido conserva el scroll vertical como mecanismo principal. La estructura queda lista para feedback de avance, revelacion acumulativa y bloqueos temporales puntuales.",
                        items: [
                          "El contenido se descubre por secciones verticales.",
                          "Lo ya revelado permanece como parte del recorrido.",
                          "Los bloqueos temporales se reservan para hitos concretos, como la presentacion inicial o el video final.",
                        ],
                      },
                    ],
                    children: [
                      {
                        id: "botones-orquestacion",
                        title: "Botones de continuidad y navegacion",
                        subtitle:
                          "Espacio reservado para las acciones principales de la etapa.",
                        surface: "plain",
                        gate: { requires: ["stage1AnimationViewed"] },
                        content: [
                          {
                            type: "scaffold-panel",
                            label: "Botones",
                            body:
                              "Aqui viviran el boton de continuar, el acceso global a etapas y los CTA internos de la etapa sin convertir el recorrido en un wizard.",
                            actions: [
                              {
                                label: "Continuar",
                                detail: "Seguira llevando al ultimo hito real del usuario.",
                                state: "future",
                              },
                              {
                                label: "Ir a etapas",
                                detail: "Este slot ya representa el acceso global que se desbloquea despues de la presentacion amplia del modelo.",
                                state: "ready",
                              },
                              {
                                label: "Seguir recorriendo",
                                detail: "Puede apoyarse en scroll suave entre bloques visibles.",
                                state: "ready",
                              },
                            ],
                          },
                        ],
                        children: [
                          {
                            id: "explicacion-modelo",
                            title: "Explicacion del modelo",
                            subtitle:
                              "Antes del rail, el usuario entiende su posicion y el sentido de esta etapa dentro de la espiral.",
                            surface: "plain",
                            gate: { requires: ["stage1AnimationViewed"] },
                            content: [
                              {
                                type: "paragraphs",
                                paragraphs: [
                                  "La etapa actual se presenta como una puerta de entrada al resto del modelo: reconoce el punto de partida y prepara la lectura de lo que viene despues.",
                                  "Esta explicacion se mantiene separada del rail para evitar que el resumen de etapas aparezca antes del contexto necesario.",
                                ],
                              },
                              {
                                type: "scaffold-panel",
                                label: "Modelo",
                                body:
                                  "El bloque queda listo para integrar una lectura mas rica sobre la espiral, el momento actual del docente y el papel del viewer persistente.",
                              },
                            ],
                            children: [
                              {
                                id: "rail-etapas",
                                title: "Rail de etapas",
                                subtitle:
                                  "Resumen visual del modelo completo, ubicado despues de la explicacion de contexto.",
                                surface: "plain",
                                gate: { requires: ["stage1AnimationViewed"] },
                                content: [{ type: "horizontal-rail", panels: RAIL_PANELS }],
                                children: [
                                  {
                                    id: "estados-docente",
                                    title: "Estados del docente",
                                    subtitle:
                                      "Marco base para explicar los estados como apoyos de acompanamiento y no como juicios.",
                                    surface: "plain",
                                    gate: { requires: ["stage1AnimationViewed"] },
                                    dialogue: [
                                      {
                                        text: "Los estados no clasifican a nadie: ayudan a modular la manera en que la experiencia acompania el recorrido.",
                                        imgSrc: LAIA_ASSETS.explain,
                                        imgAlt: "Laia explica los estados del docente",
                                      },
                                    ],
                                    content: [
                                      {
                                        type: "paragraphs",
                                        paragraphs: [
                                          "Los estados se explican antes del consentimiento y del embebido para que el autodiagnostico tenga un marco claro y tranquilo.",
                                          "El objetivo es modular apoyos, ritmo y recomendaciones sin bloquear el acceso al recorrido.",
                                        ],
                                      },
                                      { type: "state-cards", items: STATE_CARDS },
                                      {
                                        type: "bullets",
                                        title: "Factores del modelo",
                                        items: MODEL_FACTORS,
                                      },
                                    ],
                                    children: [
                                      {
                                        id: "consentimiento",
                                        title: "Consentimiento",
                                        subtitle:
                                          "Bloque obligatorio antes del embebido, planteado con un tono sereno y funcional.",
                                        surface: "plain",
                                        gate: { requires: ["stage1AnimationViewed"] },
                                        dialogue: [
                                          {
                                            text: "Este ejercicio es individual, objetivo y confidencial. No tiene efectos administrativos y solo orienta tu recorrido formativo.",
                                            imgSrc: LAIA_ASSETS.explain,
                                            imgAlt: "Laia explica el consentimiento",
                                          },
                                        ],
                                        content: [{ type: "consent-form" }],
                                        children: [
                                          {
                                            id: "chatbot-contextual",
                                            title: "Chatbot contextual",
                                            subtitle:
                                              "Apoyo no bloqueante para consultas o acompanamiento puntual.",
                                            surface: "plain",
                                            gate: { requires: ["stage1AnimationViewed"] },
                                            content: [
                                              {
                                                type: "scaffold-panel",
                                                label: "Chatbot",
                                                body:
                                                  "Este bloque deja reservado el espacio del chatbot como apoyo contextual. Su presencia no bloquea el flujo principal ni sustituye la narracion de Laia.",
                                                actions: [
                                                  {
                                                    label: "Ayuda contextual",
                                                    detail: "Aparecera como apoyo lateral o puntual.",
                                                    state: "future",
                                                  },
                                                  {
                                                    label: "Flujo principal",
                                                    detail: "Se mantiene independiente del chatbot.",
                                                    state: "ready",
                                                  },
                                                ],
                                              },
                                            ],
                                            children: [
                                              {
                                                id: "autodiagnostico-embebido",
                                                title: "Autodiagnostico embebido",
                                                subtitle:
                                                  "Nucleo operativo de la Etapa 1 dentro del nuevo esqueleto.",
                                                surface: "plain",
                                                gate: {
                                                  requires: [
                                                    "consentValidated",
                                                    "autodiagnosticStarted",
                                                  ],
                                                },
                                                content: [{ type: "autodiagnostic-module" }],
                                                children: [
                                                  {
                                                    id: "cierre-etapa",
                                                    title: "Cierre de la etapa",
                                                    subtitle:
                                                      "Retorno al marco principal de la etapa despues del embebido.",
                                                    surface: "plain",
                                                    gate: {
                                                      requires: [
                                                        "autodiagnosticCompleted",
                                                      ],
                                                    },
                                                    content: [
                                                      {
                                                        type: "scaffold-panel",
                                                        label: "Salida",
                                                        body:
                                                          "Este bloque prepara el cierre narrativo y funcional de la Etapa 1 antes del video final.",
                                                        items: [
                                                          "La etapa queda marcada como completada.",
                                                          "Se recupera el marco general del recorrido.",
                                                          "La salida prepara el cambio de ambiente hacia la Etapa 2.",
                                                        ],
                                                        tone: "accent",
                                                      },
                                                    ],
                                                    children: [
                                                      {
                                                        id: "video-final",
                                                        title: "Video final",
                                                        subtitle:
                                                          "Animacion obligatoria antes de habilitar la transicion a la Etapa 2.",
                                                        surface: "plain",
                                                        gate: {
                                                          requires: [
                                                            "autodiagnosticCompleted",
                                                          ],
                                                        },
                                                        content: [
                                                          {
                                                            type: "transition-animation",
                                                          },
                                                        ],
                                                        children: [
                                                          {
                                                            id: "transicion-etapa-2",
                                                            title: "Transicion a la Etapa 2",
                                                            subtitle:
                                                              "Bloque final del esqueleto, reservado para el cambio de fondo y el CTA definitivo.",
                                                            surface: "plain",
                                                            gate: {
                                                              requires: [
                                                                "transitionAnimationViewed",
                                                              ],
                                                            },
                                                            content: [
                                                              {
                                                                type: "scaffold-panel",
                                                                label: "Transicion",
                                                                body:
                                                                  "La estructura ya deja el lugar del CTA final, el cambio de ambiente y la salida hacia la Etapa 2 sin acoplar esta fase a una pagina concreta todavia.",
                                                                actions: [
                                                                  {
                                                                    label: "Cambio de fondo",
                                                                    detail: "Reservado para reflejar el paso a la siguiente etapa.",
                                                                    state: "future",
                                                                  },
                                                                  {
                                                                    label: "CTA a Etapa 2",
                                                                    detail: "Se habilitara solo despues del video final.",
                                                                    state: "locked",
                                                                  },
                                                                ],
                                                                tone: "accent",
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
            ],
          },
        ],
      },
    ],
  },
];

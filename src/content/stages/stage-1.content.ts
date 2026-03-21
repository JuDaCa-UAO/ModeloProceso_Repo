import type { SectionNode } from "@/types/stage";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

export const STAGE1_ID = "etapa-1";
export const STAGE1_NAME = "Reconocete para avanzar";

const RAIL_PANELS = [
  {
    id: "rail-etapa-1",
    label: "Etapa 1",
    title: "Reconocete para avanzar",
    lines: [
      "Aqui comienza la espiral: primero identificas tu punto de partida.",
      "Esta es la etapa actual y orienta el resto del recorrido.",
    ] as [string, string],
    kind: "stage" as const,
    status: "current" as const,
  },
  {
    id: "rail-etapa-2",
    label: "Etapa 2",
    title: "Descubre nuevas posibilidades",
    lines: [
      "Exploras usos, herramientas y oportunidades de GenAI en contexto educativo.",
      "La etapa amplia el panorama despues de reconocer tu punto de partida.",
    ] as [string, string],
    kind: "stage" as const,
    status: "upcoming" as const,
  },
  {
    id: "rail-etapa-3",
    label: "Etapa 3",
    title: "Disena con proposito",
    lines: [
      "Transformas el descubrimiento en decisiones pedagogicas concretas.",
      "Aqui el foco pasa del panorama general al diseno intencional.",
    ] as [string, string],
    kind: "stage" as const,
    status: "upcoming" as const,
  },
  {
    id: "rail-etapa-4",
    label: "Etapa 4",
    title: "Prepara el terreno para el exito",
    lines: [
      "Ajustas condiciones, recursos y criterios antes de implementar.",
      "La etapa prepara una integracion mas solida y contextualizada.",
    ] as [string, string],
    kind: "stage" as const,
    status: "upcoming" as const,
  },
  {
    id: "rail-etapa-5",
    label: "Etapa 5",
    title: "Hazlo realidad en el aula",
    lines: [
      "Llevas la experiencia al aula con acompanamiento y observacion.",
      "El modelo pasa de la planeacion a la practica educativa.",
    ] as [string, string],
    kind: "stage" as const,
    status: "upcoming" as const,
  },
  {
    id: "rail-etapa-6",
    label: "Etapa 6",
    title: "Reflexiona, aprende y mejora",
    lines: [
      "Cierras el ciclo con lectura critica de resultados y ajustes.",
      "La espiral vuelve a abrir una mejora continua para la siguiente iteracion.",
    ] as [string, string],
    kind: "stage" as const,
    status: "upcoming" as const,
  },
];

const STATE_CARDS = [
  {
    contextLabel: "Punto de entrada posible",
    title: "Aprendiendo sin miedo",
    description:
      "Representa un momento de inicio o reencuentro con GenAI, donde la curiosidad necesita seguridad, ejemplos claros y espacio para probar sin presion.",
    supportHint:
      "La cartilla acompana con orientaciones guiadas, lenguaje simple, ayudas visibles y pasos concretos para avanzar con confianza.",
  },
  {
    contextLabel: "Exploracion con intencion",
    title: "Explorando con proposito",
    description:
      "Describe a quien ya experimenta con GenAI y quiere conectar mejor sus decisiones con objetivos pedagogicos, criterios eticos y sentido didactico.",
    supportHint:
      "La cartilla responde con preguntas de profundidad media, comparaciones utiles y apoyos para tomar decisiones con mayor criterio.",
  },
  {
    contextLabel: "Integracion que inspira",
    title: "Innovando e inspirando",
    description:
      "Nombra un momento de apropiacion mas madura, donde GenAI ya se integra de forma creativa, critica y transferible a distintos contextos educativos.",
    supportHint:
      "La cartilla acompana con retos mas abiertos, conexiones entre etapas y oportunidades para reflexionar y compartir practicas valiosas.",
  },
];

export const STAGE1_TREE: SectionNode[] = [
  {
    id: "entrada-etapa-1",
    title: STAGE1_NAME,
    subtitle: "Pantalla inicial de la Etapa 1 con Laia y CTA principal de inicio.",
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
            id: "encabezado-stage",
            title: "Encabezado del stage",
            subtitle:
              "Titulo funcional del stage y separacion visible entre viewer y continuidad.",
            surface: "plain",
            gate: { requires: ["stage1AnimationViewed"] },
            content: [
              {
                type: "stage-header",
                title: "Etapa 1: Recon\u00F3cete para avanzar",
                subtitle:
                  "El viewer indica la etapa actual. La continuidad conserva el punto exacto del recorrido por seccion.",
                stageChip: "Stage activo",
                continuityLabel: "Continuidad por seccion",
                currentStageLabel: "Etapa 1 activa",
              },
            ],
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
                    label: "Viewer",
                    body:
                      "El viewer reducido queda fijo en la esquina superior derecha despues de la animacion inicial. Su funcion es indicar la etapa actual y no recordar el punto exacto del recorrido.",
                    items: [
                      "El viewer solo indica la etapa actual.",
                      "Etapa 1 queda mostrada como activa.",
                      "La continuidad se conserva por seccion y vive fuera del viewer.",
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
                        subtitle: "Marco estructural del desplazamiento principal del stage.",
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
                                  "Aqui viven el boton de continuar exacto y el acceso global a etapas sin convertir el recorrido en un wizard.",
                                actions: [
                                  {
                                    label: "Continuar",
                                    detail: "Ya retoma la ultima seccion guardada del recorrido.",
                                    state: "ready",
                                  },
                                  {
                                    label: "Ir a etapas",
                                    detail: "Se desbloquea al completarse la presentacion amplia del modelo.",
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
                                      "Estas iniciando en la Etapa 1 porque la espiral comienza por reconocer primero tu punto de partida antes de abrir decisiones, herramientas o retos posteriores.",
                                      "Esta ubicacion inicial te da contexto para leer el modelo completo: primero entiendes donde estas y por que comienzas aqui; despues aparece el resumen de las seis etapas.",
                                    ],
                                  },
                                  {
                                    type: "callout",
                                    title: "Por que empiezas en Etapa 1",
                                    body:
                                      "Etapa 1 no busca juzgarte ni clasificarte. Funciona como puerta de entrada al modelo y orienta el acompanamiento posterior a partir de una lectura inicial del recorrido.",
                                  },
                                  {
                                    type: "bullets",
                                    title: "Lo que este bloque deja claro",
                                    items: [
                                      "La espiral arranca por ubicacion, no por exigencia tecnica.",
                                      "El viewer reducido acompana la etapa actual, pero no reemplaza la continuidad.",
                                      "El rail aparece despues para resumir el mapa completo sin adelantarte el contexto.",
                                    ],
                                  },
                                ],
                                children: [
                                  {
                                    id: "rail-etapas",
                                    title: "Rail de etapas",
                                    subtitle:
                                      "Resumen digerible de las seis etapas del modelo despues de entender la ubicacion actual.",
                                    surface: "plain",
                                    gate: { requires: ["stage1AnimationViewed"] },
                                    content: [{ type: "horizontal-rail", panels: RAIL_PANELS }],
                                    children: [
                                      {
                                        id: "estados-docente",
                                        title: "Estados del docente",
                                        subtitle:
                                          "Lectura orientadora del acompaniamiento, presentada antes del consentimiento.",
                                        surface: "plain",
                                        gate: { requires: ["stage1AnimationViewed"] },
                                        dialogue: [
                                          {
                                            text: "Estos estados no te clasifican ni te juzgan. Solo nos ayudan a modular el acompanamiento para que el recorrido se sienta mas pertinente y util.",
                                            imgSrc: LAIA_ASSETS.explain,
                                            imgAlt: "Laia contextualiza los estados del docente",
                                          },
                                        ],
                                        content: [
                                          {
                                            type: "state-cards",
                                            items: STATE_CARDS,
                                            title: "Tres estados para orientar el recorrido",
                                            intro:
                                              "Los estados muestran formas posibles de relacionarte hoy con GenAI dentro de la cartilla. No son etiquetas fijas ni juicios sobre tu capacidad docente.",
                                            note:
                                              "Su funcion es orientar el tono del acompanamiento y la profundidad de las ayudas a lo largo del recorrido. Puedes reconocerte mas en uno, mezclar rasgos de varios o cambiar con el tiempo.",
                                            continueHint:
                                              "Continua bajando: despues de entender estos estados, el flujo pasa al consentimiento obligatorio antes del autodiagnostico.",
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
                                                text: "Antes de seguir, quiero dejarte algo claro: este ejercicio es confidencial, no busca sancionarte y solo existe para orientar mejor tu recorrido formativo.",
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
                                                gate: { requires: ["consentValidated"] },
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
                                                          requires: ["autodiagnosticCompleted"],
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
                                                              requires: ["autodiagnosticCompleted"],
                                                            },
                                                            content: [{ type: "transition-animation" }],
                                                            children: [
                                                              {
                                                                id: "transicion-etapa-2",
                                                                title: "Transicion a la Etapa 2",
                                                                subtitle:
                                                                  "Bloque final del esqueleto, reservado para el cambio de fondo y el CTA definitivo.",
                                                                surface: "plain",
                                                                gate: {
                                                                  requires: ["transitionAnimationViewed"],
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
                                                                        detail:
                                                                          "Reservado para reflejar el paso a la siguiente etapa.",
                                                                        state: "future",
                                                                      },
                                                                      {
                                                                        label: "CTA a Etapa 2",
                                                                        detail:
                                                                          "Se habilitara solo despues del video final.",
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
    ],
  },
];

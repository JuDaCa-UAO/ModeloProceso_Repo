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
  abrebocas: mediaKey("stage6.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 6",
    chapterLabel: "CAPÍTULO 6 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-6"],
    description:
      "Evalúa multidimensionalmente la experiencia junto a tus estudiantes, sistematiza lecciones aprendidas y prepara tu próxima iteración.",
    tags: ["Evaluar", "Sistematizar", "Iterar"],
    laiaAvatar: mediaKey("laia.pose.holo"),
  },
  laia: [
    {
      id: "e6-laia-1",
      text: "¡Llegamos a la última etapa de esta vuelta! Es hora de detenerse a evaluar lo vivido en el aula junto con tus estudiantes.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e6-laia-2",
      text: "La pregunta central es: ¿qué aprendimos de esta experiencia y cómo podemos mejorarla en el siguiente ciclo?",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e6-laia-3",
      text: "La evaluación no es calificar; es reflexionar de forma crítica sobre lo pedagógico, técnico, ético y emocional. ¡Sigue bajando!",
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
            "Esta etapa es el cierre del ciclo, pero también el inicio de una nueva mejora. Aquí el docente y los estudiantes evalúan la experiencia de manera conjunta. No se trata únicamente de mirar si la actividad salió «bien» o «mal», sino de entender qué se aprendió, qué valor aportó la IA, qué dificultades pedagógicas o técnicas aparecieron, qué riesgos éticos surgieron y qué ajustes de diseño se deben programar.",
            "Esta evaluación crítica y reflexiva es multidimensional: considera aspectos pedagógicos, técnicos, éticos, cognitivos y afectivos (emocionales) de toda la experiencia vivida en clase.",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage6.evaluationDimensions"),
          caption: "Evaluar no es solo calificar: dimensiones pedagógica, técnica, ética, emocional y cognitiva",
        },
        {
          type: "bullets",
          title: "Las cinco dimensiones de la evaluación",
          variant: "list",
          items: [
            "Pedagógica — si la actividad permitió cumplir los resultados de aprendizaje de forma efectiva.",
            "Técnica — si las herramientas de IA funcionaron correctamente, y si fueron accesibles para los estudiantes.",
            "Ética — si las reglas y consideraciones éticas de aula se comprendieron, respetaron y protegieron la privacidad.",
            "Cognitiva — si la IA promovió el razonamiento y pensamiento crítico, o si se cayó en delegación y uso acrítico.",
            "Afectiva (Emocional) — cómo se sintieron el docente y los estudiantes (seguridad, frustración, motivación) durante el proceso.",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage6.twoPerspectives"),
          caption: "Dos miradas sobre la experiencia: la del docente y la del estudiante",
        },
        {
          type: "bullets",
          title: "Actividades principales de la etapa",
          variant: "list",
          items: [
            "Analizar objetivos — verificar si la mediación de IA aportó valor real al aprendizaje.",
            "Recoger la voz del estudiante — evaluar sus percepciones, dificultades de uso y motivación mediante encuestas o diálogos.",
            "Revisar decisiones docentes — determinar qué decisiones de planeación mantendrías, cuáles cambiarías y qué instrucciones debes mejorar.",
            "Sistematizar lecciones aprendidas — documentar los aprendizajes pedagógicos y compartirlos con la comunidad docente.",
          ],
        },
        {
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "La profundidad y el alcance de tu reflexión final y sistematización se adaptan según tu nivel de partida:",
          items: [
            {
              hierarchy: "Inicial",
              title: "Inicial",
              description: "Llevas a cabo una autoevaluación sencilla y focalizada en responder preguntas básicas: ¿funcionó la actividad?, ¿los estudiantes comprendieron el rol de la IA?, ¿qué falló y qué cambiaría en el próximo ciclo? Utilizas formularios breves, diarios reflexivos simples y plantillas básicas de lecciones.",
            },
            {
              hierarchy: "Intermedio",
              title: "Intermedio",
              description: "Realizas una evaluación más profunda analizando la bitácora de prompts y productos generados por los estudiantes. Identificas dilemas éticos reales, mides el desarrollo del pensamiento crítico y refinas la rúbrica de evaluación didáctica con base en el Canvas de evaluación.",
            },
            {
              hierarchy: "Avanzado",
              title: "Avanzado",
              description: "Evalúas con fines de escalabilidad, innovación y transferencia de conocimiento. Analizas datos cualitativos y cuantitativos, comparas resultados con cohortes anteriores, sistematizas la experiencia en formato de caso de estudio para coliderar con pares y propones mejoras al propio modelo de proceso.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Evaluación",
              description: "Directrices para conducir la autoevaluación formal considerando cinco dimensiones: pedagógica, técnica, ética, cognitiva y afectiva (emocional).",
            },
            {
              title: "Canvas de evaluación",
              description: "Recurso estructurado en consistencia con el diseño y alistamiento, permitiendo contrastar de forma visual lo planeado frente al despliegue real.",
            },
            {
              title: "Lista de acciones",
              description: "Checklist de autoevaluación: acciones esenciales (verificar objetivos vs. evidencias) y recomendadas (analizar usabilidad y la experiencia emocional).",
            },
            {
              title: "Retroalimentación estudiantil",
              description: "Cuestionario o conversatorio diseñado para recoger la percepción del estudiante sobre la claridad, la motivación y la autonomía frente a la IA.",
            },
            {
              title: "Registro reflexivo docente",
              description: "Bitácora con preguntas guiadas para la autocrítica profesional del docente sobre las consignas dadas, tiempos y calidad de mediación didáctica.",
            },
            {
              title: "Revisión de evidencias",
              description: "Metodología cualitativa para valorar los prompts, entregables finales y bitácoras reunidas en clase, identificando debilidades cognitivas.",
            },
            {
              title: "Lecciones aprendidas",
              description: "Formato de sistematización enfocado a generar conocimiento transferible sobre qué mantener, qué evitar y qué compartir con otros colegas.",
            },
            {
              title: "Plan de ajustes",
              description: "Cronograma de rediseño (reajustar consignas, cambiar de herramienta, afinar rúbrica) para retroalimentar la siguiente vuelta de la espiral.",
            },
            {
              title: "Evaluación del modelo",
              description: "Instrumento para valorar la utilidad, viabilidad y pertinencia metodológica del propio modelo de espiral en tu práctica real.",
            },
          ],
        },

        {
          type: "narrative-video",
          mediaKey: mediaKey("stage6.newLoopVideo"),
          caption: "El ciclo continúa: cada nueva iteración en la espiral de aprendizaje potencia tu práctica docente",
        },

      ],
    },
  ],
  closing: {
    title: "Lo que aprendiste esta vuelta",
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

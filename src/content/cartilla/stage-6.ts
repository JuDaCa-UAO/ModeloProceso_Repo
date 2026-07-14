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
          type: "bullets",
          title: "Recursos que contiene esta etapa",
          variant: "list",
          items: [
            "Presentación: Evaluación docente-estudiante de la experiencia — Explica detalladamente cómo conducir una autoevaluación formal y rigurosa. Guía la recolección de dos miradas cruzadas (la del docente y la de los estudiantes) considerando cinco dimensiones: pedagógica, técnica, ética, cognitiva y afectiva (emocional).",
            "Modelo Canvas para la evaluación — El recurso de síntesis de la etapa. Diseñado en total correspondencia con los Canvas de diseño y alistamiento, permite contrastar de forma visual lo que habías planeado, lo que preparaste en el kit, lo que ocurrió realmente en el aula y qué aprendizajes surgen.",
            "Lista de acciones esenciales y recomendadas — Checklist evaluativo para el docente. Detalla las acciones esenciales (contrastar objetivos con resultados de evidencias, documentar lecciones obvias) y recomendadas (analizar la respuesta emocional del docente, comparar indicadores con implementaciones previas).",
            "Instrumento de retroalimentación estudiantil — Cuestionario estructurado (encuesta/conversatorio) diseñado para recoger de los estudiantes su nivel de agrado, los problemas de acceso, su percepción de autonomía frente a la IA y los aprendizajes sobre el uso ético y de autoría.",
            "Diario o registro reflexivo docente — Cuaderno de bitácora guiado con preguntas específicas para la autocrítica profesional sobre la pertinencia de las consignas dadas, el tiempo programado y la calidad del rol de mediación.",
            "Revisión de evidencias recopiladas — Metodología de análisis cualitativo para interpretar los prompts, entregables finales y bitácoras reunidas en clase, evaluando el grado de rigor argumentativo y originalidad del estudiante.",
            "Documento de lecciones aprendidas — Formato de sistematización docente enfocado a generar conocimiento pedagógico transferible: qué repetir en la próxima versión, qué prácticas evitar, qué herramientas recomendar y sugerencias útiles para otros colegas.",
            "Plan de ajustes — Cronograma específico de rediseño técnico y pedagógico de la experiencia (modificar la herramienta de IA, reformular pautas éticas, ajustar la rúbrica) para retroalimentar la espiral.",
            "Instrumento de evaluación del modelo de proceso — Formulario para que el docente evalúe el propio modelo de espiral en el taller, valorando su claridad metodológica, viabilidad de aplicación y pertinencia en su desarrollo profesional.",
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "La Evaluación y Sistematización Documentada de la Experiencia: la recopilación de lecciones aprendidas transferibles y el Plan de Ajustes de diseño listo y optimizado para una nueva iteración o ciclo en la espiral de acompañamiento.",
        },
        {
          type: "narrative-video",
          mediaKey: mediaKey("stage6.newLoopVideo"),
          caption: "El ciclo continúa: cada nueva iteración en la espiral de aprendizaje potencia tu práctica docente",
        },
        {
          type: "callout",
          title: "DE HALLAZGO A MEJORA",
          body: "Un hallazgo solo se vuelve útil cuando produce una decisión: si hubo uso acrítico de la IA, puede faltar una pausa de verificación; si falló el acceso a la herramienta, quizá haya que mejorar el alistamiento.",
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

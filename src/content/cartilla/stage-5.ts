/**
 * CONTENT — Datos (Etapa 5 · Hazlo realidad en el aula)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e5`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_5: Stage = {
  id: "etapa-5",
  order: 5,
  officialName: OFFICIAL_STAGE_NAMES["etapa-5"],
  accent: { main: "var(--uao-stage-5-accent)", chip: "var(--uao-stage-5-chip)" },
  abrebocas: mediaKey("stage5.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 5",
    chapterLabel: "CAPÍTULO 5 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-5"],
    description:
      "Lleva la experiencia al aula y realiza un acompañamiento activo: la IA no te reemplaza, potencia tu rol como mediador.",
    tags: ["Guiar", "Acompañar", "Documentar"],
    laiaAvatar: mediaKey("laia.pose.triumphant"),
  },
  laia: [
    {
      id: "e5-laia-1",
      text: "¡Llegó el momento de hacerlo realidad! Acompaña a tus estudiantes en el uso de la IA y gestiona los recursos digitales.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e5-laia-2",
      text: "Tu rol es clave: guías el uso, formulas preguntas críticas, recuerdas los límites éticos y observas si los estudiantes realmente aprenden.",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e5-laia-3",
      text: "Registra en tu bitácora las 5 evidencias del proceso para que las analicemos en la Etapa 6. ¡Sigue bajando!",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa5-contenido",
      title: "Tu papel durante la experiencia",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "Esta etapa es la puesta en práctica del diseño. El docente lleva la experiencia al aula y acompaña a los estudiantes mientras interactúan con la IA. Aquí la tecnología no reemplaza al docente; al contrario, el docente se vuelve más importante porque guía, observa, pregunta, aclara, interviene y ayuda a que los estudiantes usen la IA con criterio.",
            "La pregunta central del despliegue pedagógico es: ¿cómo acompaño a mis estudiantes para que usen la IA como apoyo para aprender, y no como un atajo fácil para evitar el pensamiento reflexivo?",
          ],
        },
        { type: "narrative-video", mediaKey: mediaKey("stage5.classroomSimulation") },
        { type: "narrative-video", mediaKey: mediaKey("stage5.teacherAsMediator") },
        {
          type: "infographic",
          mediaKey: mediaKey("stage5.teacherAsMediatorInfographic"),
          caption: "El docente como mediador: guía, observa, aclara, interviene y protege el propósito de la experiencia",
        },
        {
          type: "bullets",
          title: "Acciones clave de mediación docente",
          variant: "pills",
          items: [
            "Explicar propósito",
            "Entregar guía",
            "Aclarar límites de la IA",
            "Verificar acceso técnico",
            "Formular preguntas críticas",
            "Promover ética de aula",
            "Retroalimentar en tiempo real",
            "Registrar evidencias",
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage5.criticalMomentsInfographic"),
          caption: "Momentos críticos durante la experiencia: reconocerlos a tiempo te permite intervenir sin perder el propósito",
        },
        {
          type: "carousel",
          title: "Evidencias para documentar",
          description:
            "Mientras la experiencia pedagógica ocurre en el aula, documenta lo que pasa. Estas cinco evidencias constituirán el insumo clave para la autoevaluación en la Etapa 6:",
          panels: [
            {
              id: "evidencia-1",
              label: "Dudas de estudiantes",
              description: "Qué dudas expresaron los estudiantes y en qué momentos o conceptos de la actividad se trabaron.",
              mediaKey: mediaKey("stage5.rail.1"),
            },
            {
              id: "evidencia-2",
              label: "Prompts formulados",
              description: "Qué indicaciones y prompts le escribieron a la IA, y si fueron refinando su instrucción.",
              mediaKey: mediaKey("stage5.rail.2"),
            },
            {
              id: "evidencia-3",
              label: "Productos generados",
              description: "Qué resultados o textos arrojó la IA y qué modificaciones o aportes propios les hizo el estudiante.",
              mediaKey: mediaKey("stage5.rail.3"),
            },
            {
              id: "evidencia-4",
              label: "Errores y alucinaciones",
              description: "Qué fallas del sistema ocurrieron, qué sesgos se detectaron o qué respuestas falsas (alucinaciones) dio la IA.",
              mediaKey: mediaKey("stage5.rail.4"),
            },
            {
              id: "evidencia-5",
              label: "Ajustes del docente",
              description: "Qué decisiones y cambios de planes (Plan B) tomaste sobre la marcha de la clase y por qué razones.",
              mediaKey: mediaKey("stage5.rail.5"),
            },
          ],
        },
        {
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "La autonomía pedagógica y la complejidad didáctica durante la clase varían según tu nivel de madurez:",
          items: [
            {
              hierarchy: "Inicial",
              title: "M1 Inicial",
              description: "Implementas una actividad breve, muy guiada y en un entorno controlado para ganar confianza. Acompañas paso a paso, explicas el propósito, recuerdas pautas éticas básicas y recopilas un único tipo de evidencia sencilla de la clase.",
            },
            {
              hierarchy: "Intermedio",
              title: "M2 Intermedio",
              description: "Gestionas una sesión estructurada por fases (introducción, uso regulado, análisis de información y plenaria). Eres capaz de brindar soporte técnico ágil, resolver dudas específicas sobre las respuestas de la IA y guiar a los estudiantes a contrastar los datos.",
            },
            {
              hierarchy: "Avanzado",
              title: "M3 Avanzado",
              description: "Facilitas experiencias complejas, altamente reflexivas y flexibles que incorporan co-creación avanzada o dilemas éticos reales surgidos en clase. Realizas adaptaciones al diseño en tiempo real y sistematizas el desarrollo de la sesión como una buena práctica compartible.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Despliegue",
              description: "Pautas metodológicas para orientar la mediación pedagógica en aula: resolviendo bloqueos, guíando el análisis de datos y previniendo la copia irreflexiva.",
            },
            {
              title: "Guía de la actividad",
              description: "Consignas didácticas que los estudiantes siguen para la interacción, especificando reglas éticas de uso y entregables parciales.",
            },
            {
              title: "Acceso a herramientas",
              description: "Enlaces, tutoriales cortos, instructivos de configuración técnica de las herramientas de GenAI y cuentas para los estudiantes.",
            },
            {
              title: "Banco de preguntas críticas",
              description: "Preguntas didácticas diseñadas para activar el análisis crítico del estudiante (ej. ¿cuál es la fuente?, ¿dónde está tu razonamiento original?, ¿qué errores tiene?).",
            },
            {
              title: "Reglas éticas visibles",
              description: "Recordatorios gráficos visibles en el aula sobre transparencia de coautoría, declaración del prompt y restricciones de datos sensibles.",
            },
            {
              title: "Documentación de aula",
              description: "Formatos rápidos para registrar capturas de pantalla, bitácoras de prompts y borradores parciales del proceso.",
            },
            {
              title: "Acompañamiento y soporte",
              description: "Canales rápidos de dudas en clase, foros y la aplicación del Plan B (contingencia pedagógica sin IA) si la tecnología falla.",
            },
            {
              title: "Rúbrica y retorno",
              description: "Evaluación formativa del docente en tiempo real para guiar al estudiante sobre cómo mejorar antes de la entrega final.",
            },
            {
              title: "Observaciones del docente",
              description: "Bitácora ágil para que el docente registre la usabilidad de las herramientas, atascos pedagógicos y adaptaciones realizadas.",
            },
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "La Experiencia de Aula Implementada y Documentada: el desarrollo de la actividad con estudiantes reales enriquecido con el banco empírico de evidencias (dudas, prompts, productos de IA, incidencias y bitácora del docente) para su posterior autoevaluación.",
        },
      ],
    },
  ],
  closing: {
    title: "Tu acompañamiento en el aula",
    message: "Te dejo este resumen de tu rol durante la experiencia. Un repaso rápido antes de continuar.",
    question: "¿Qué observarás y documentarás mientras tus estudiantes usan la IA en el aula?",
    summaryVideo: mediaKey("stage5.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.triumphant"),
    continueLabel: "Continuar a la Etapa 6 →",
    continueHref: "#etapa-6",
    accent: { main: "var(--uao-stage-5-closing-accent)", soft: "var(--uao-stage-5-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage5ToStage6"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-6"],
  },
};

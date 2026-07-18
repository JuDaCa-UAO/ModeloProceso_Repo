/**
 * CONTENT — Datos (Etapa 4 · Prepara el terreno para el éxito)
 *
 * Fuente única: `Cartilla.dc.html` (texto estático del cuerpo + diálogo de
 * LaIA verbatim de `chapterSteps.e4`). Ver `contexto/context.md`, entrada de
 * la Fase 8.
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import { OFFICIAL_STAGE_NAMES } from "@domain/content/value-objects/StageId";
import type { Stage } from "@domain/content/Stage";

export const STAGE_4: Stage = {
  id: "etapa-4",
  order: 4,
  officialName: OFFICIAL_STAGE_NAMES["etapa-4"],
  accent: { main: "var(--uao-stage-4-accent)", chip: "var(--uao-stage-4-chip)" },
  abrebocas: mediaKey("stage4.abrebocas"),
  cover: {
    badgeLabel: "ETAPA 4",
    chapterLabel: "CAPÍTULO 4 DE 6",
    title: OFFICIAL_STAGE_NAMES["etapa-4"],
    description:
      "Asegura la viabilidad técnica, pedagógica y ético-emocional de tu experiencia en el aula antes del despliegue real.",
    tags: ["Alistamiento", "Confianza", "Plan B"],
    laiaAvatar: mediaKey("laia.pose.explaining"),
  },
  laia: [
    {
      id: "e4-laia-1",
      text: "¡Casi listos para el aula! Antes de implementar, prepara cada detalle: herramientas, guías de actividades y el importantísimo Plan B.",
      avatarKey: mediaKey("laia.pose.neutral"),
    },
    {
      id: "e4-laia-2",
      text: "Responderemos a la pregunta clave: ¿qué necesitas dejar listo para que la experiencia funcione bien y no se vuelva confusa o improvisada?",
      avatarKey: mediaKey("laia.pose.explaining"),
    },
    {
      id: "e4-laia-3",
      text: "Pruébalo tú mismo/a en rol de estudiante para anticipar dudas y fallos. ¡Sigue bajando para revisar la lista de chequeo!",
      avatarKey: mediaKey("laia.pose.triumphant"),
    },
  ],
  sections: [
    {
      id: "etapa4-contenido",
      title: "Todo listo antes de empezar",
      blocks: [
        {
          type: "paragraphs",
          paragraphs: [
            "Esta etapa es la preparación indispensable antes de llevar la experiencia al aula. Aquí el docente revisa que todo lo diseñado sea viable: que las herramientas funcionen, que los estudiantes puedan acceder a ellas, que las instrucciones de la guía sean claras, que existan reglas éticas definidas, que haya una rúbrica lista y que se cuente con un plan alternativo ante imprevistos.",
            "Es decir, esta etapa responde a la pregunta crucial: ¿qué necesito dejar listo para que la experiencia funcione bien y no se convierta en algo confuso o improvisado?",
          ],
        },
        {
          type: "action-cards",
          cards: [
            { icon: "⚙", title: "Prueba la tecnología", description: "Verifica accesos, prueba la herramienta en rol de estudiante y prepara ejemplos y contraejemplos de IA." },
            { icon: "⇅", title: "Crea guías claras", description: "Diseña instrucciones pedagógicas paso a paso, con reglas éticas transparentes y rúbricas de evaluación listas." },
            { icon: "✎", title: "Define el Plan B", description: "Anticipa planes alternativos por si falla la red, la herramienta de IA está caída o estudiantes prefieren no usarla." },
            { icon: "★", title: "Alista la mediación", description: "Establece cómo acompañarás a los estudiantes, qué preguntas críticas les harás y cómo registrarás la bitácora." },
          ],
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage4.controlRoom"),
          caption: "La sala de control del alistamiento: verificación técnica, pedagógica y ético-emocional",
        },
        {
          type: "infographic",
          mediaKey: mediaKey("stage4.section2Media"),
          caption: "Checklist de preparación: verifica cada elemento antes de usar la IA en tu clase",
        },
        {
          type: "bullets",
          title: "Qué revisa el Canvas de alistamiento",
          variant: "list",
          items: [
            "Herramienta — que la tecnología de IA elegida sea accesible, estable y con cuentas listas.",
            "Instrucciones — consignas claras en la guía sobre qué, para qué y cómo interactuar con el asistente.",
            "Reglas de uso — límites éticos explícitos (cuidado de datos personales, citación del contenido generado, coautoría).",
            "Plan B estructurado — alternativas pedagógicas si la herramienta se desconecta, el servidor falla o hay problemas de red.",
            "Acompañamiento y soporte — cómo darás retroalimentación, apoyo en tiempo real y cómo recogerás las observaciones de aula.",
          ],
        },
        {
          type: "state-cards",
          layout: "rows",
          title: "Cómo influye tu estado inicial en esta etapa",
          description: "La profundidad y el tipo de preparación técnica y operativa se modifican según tu nivel de partida:",
          items: [
            {
              hierarchy: "Inicial",
              title: "Inicial",
              description: "Tu prioridad absoluta es asegurar que las condiciones mínimas funcionen para evitar la improvisación. Te enfocas en verificar accesos básicos de herramientas, redactar instrucciones sencillas para la guía, establecer reglas éticas elementales y estructurar un Plan B de contingencia sumamente simple.",
            },
            {
              hierarchy: "Intermedio",
              title: "Intermedio",
              description: "Llevas a cabo un alistamiento más exhaustivo. Simulas la actividad en rol de estudiante, preparas tutoriales de apoyo, elaboras una rúbrica detallada que distinga el proceso del producto final y diseñas bitácoras de prompts o plantillas para que tus estudiantes registren sus interacciones.",
            },
            {
              hierarchy: "Avanzado",
              title: "Avanzado",
              description: "Tu alistamiento contempla configuraciones tecnológicas avanzadas y protocolos de control robustos. Configuras asistentes de IA personalizados con instrucciones de comportamiento específicas, gestionas las políticas de privacidad y datos institucionales, diseñas indicadores avanzados de seguimiento y creas alternativas equivalentes sin IA.",
            },
          ],
        },
        {
          type: "action-cards",
          title: "Recursos que contiene esta etapa",
          cards: [
            {
              title: "Presentación: Alistamiento",
              description: "Pautas para estructurar las condiciones operativas (técnicas, pedagógicas, éticas y emocionales) antes del día de clase.",
            },
            {
              title: "Canvas de alistamiento",
              description: "Herramienta que operativiza el diseño respondiendo a '¿qué debo dejar listo para que funcione?', estructurando accesos, simulación y contingencias.",
            },
            {
              title: "Lista de acciones",
              description: "Checklist de control que separa las acciones esenciales (mínimo técnico y de seguridad de aula) de las recomendadas (optimizaciones progresivas).",
            },
            {
              title: "Guía de la actividad",
              description: "Instrucciones directas para el estudiante que detallan tiempos, entregables, rúbrica de evaluación, comportamiento de la IA y límites de coautoría.",
            },
            {
              title: "Ejemplos y contraejemplos",
              description: "Muestras de prompts estructurados vs. vagos y contrastación de alucinaciones para educar en el uso correcto de las herramientas.",
            },
            {
              title: "Reglas éticas de aula",
              description: "Pautas de comportamiento sobre privacidad de datos (qué no subir a la IA), transparencia en citación y sesgos de la información.",
            },
            {
              title: "Rúbrica de evaluación",
              description: "Valora el proceso del estudiante (pensamiento crítico, originalidad, contrastación de datos, ética) y no solo el producto del software.",
            },
            {
              title: "Configuración del asistente",
              description: "Instrucciones (prompts de sistema) para programar un asistente como un tutor pedagógico interactivo que cuestiona en lugar de dar la respuesta.",
            },
            {
              title: "Asistente de alistamiento",
              description: "Tutor virtual que audita tus guías, rúbricas, Plan B y reglas de uso ético, asegurando que todo esté listo antes de entrar al aula.",
            },
          ],
        },

        {
          type: "download",
          mediaKey: mediaKey("stage4.readinessCanvas"),
          title: "Canvas de alistamiento",
          description: "La lista de chequeo indispensable para verificar la viabilidad integral de tu actividad mediada por IA.",
          label: "Descargar PDF ↓",
        },
      ],
    },
  ],
  closing: {
    title: "Todo listo para el aula",
    message: "Antes de avanzar, revisa este resumen. Recoge lo esencial del alistamiento para llegar al aula con confianza.",
    question: "¿Qué necesitas preparar aún antes de llevar tu experiencia al aula?",
    summaryVideo: mediaKey("stage4.summaryVideo"),
    laiaAvatar: mediaKey("laia.pose.explaining"),
    continueLabel: "Continuar a la Etapa 5 →",
    continueHref: "#etapa-5",
    accent: { main: "var(--uao-stage-4-closing-accent)", soft: "var(--uao-stage-4-closing-soft)" },
  },
  transition: {
    mediaKey: mediaKey("transitions.stage4ToStage5"),
    nextStageName: OFFICIAL_STAGE_NAMES["etapa-5"],
  },
};

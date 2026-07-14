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
          type: "bullets",
          title: "Recursos que contiene esta etapa",
          variant: "list",
          items: [
            "Presentación: Alistamiento de la experiencia de aprendizaje con GenAI — Explica cómo garantizar las condiciones técnicas, pedagógicas, éticas y emocionales para el éxito de la actividad, guiando al docente sobre el acceso a cuentas, el acompañamiento en tiempo real y la recolección de evidencias de aula.",
            "Modelo Canvas para el alistamiento — Herramienta que convierte el diseño pedagógico en un plan operativo para el aula, respondiendo a la pregunta: ¿qué debo dejar listo para que la experiencia funcione? Estructura la verificación de guías, accesos a herramientas, simulación previa de interacción y el Plan B de contingencia.",
            "Lista de acciones esenciales y recomendadas — Checklist operativo y de control. Define las acciones esenciales (mínimo obligatorio para garantizar seguridad, accesibilidad y claridad) y las acciones recomendadas (mejoras didácticas avanzadas que enriquecen progresivamente la actividad según la madurez del docente).",
            "Guía de actividad para estudiantes — Formato estructurado paso a paso que se entrega al estudiante para reducir su ansiedad y orientar su trabajo en clase, indicando claramente la herramienta autorizada, los tiempos, los entregables esperados, la forma de evaluar y los límites de la IA.",
            "Ejemplos y contraejemplos — Banco didáctico de buenas y malas prácticas (ej. prompts estructurados vs. vagos, co-creación responsable vs. copia directa y no declarada, verificación crítica de alucinaciones vs. aceptación ciega) para educar en el uso constructivo de la tecnología.",
            "Reglas éticas de uso de IA — Pautas claras de comportamiento: qué está autorizado hacer y qué no en la actividad, cómo citar los aportes de la IA, qué información sensible está prohibido subir por privacidad y las consecuencias de un uso inadecuado.",
            "Rúbrica de evaluación — Criterios e indicadores para valorar el proceso del estudiante y no solo el entregable final. Premia aspectos como la contrastación de datos, la originalidad de ideas propias frente al aporte de la IA, el pensamiento crítico y la ética de uso.",
            "Ejemplo de configuración de un asistente de IA — Demostración y guía práctica de cómo programar las instrucciones de sistema (prompts de sistema) de un tutor virtual para que actúe como un facilitador reflexivo (que formula preguntas y guía análisis) en lugar de un generador de respuestas rápidas.",
            "Asistente de IA para el alistamiento — Agente de soporte que revisa tus guías, rúbricas y reglas éticas de uso, sugiriendo mejoras de claridad pedagógica y comprobando la robustez de tu Plan B ante contingencias.",
          ],
        },
        {
          type: "callout",
          title: "PRODUCTO QUE DEJA ESTA ETAPA",
          body: "El Kit de Implementación listo para el aula: la articulación de la guía del estudiante, las pautas éticas visibles de uso, la rúbrica de proceso de aprendizaje, las cuentas técnicas verificadas y el Plan B estructurado ante imprevistos técnicos.",
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

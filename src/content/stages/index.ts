/**
 * CONTENT — Index
 *
 * Punto de entrada único para los metadatos de todas las etapas.
 * No exporta árboles de contenido completos (eso es responsabilidad de
 * StaticStageContentRepository). Solo expone metadatos ligeros para
 * navegación, breadcrumbs y el Stage Engine dinámico.
 *
 * Para agregar una etapa nueva:
 *  1. Crear content/stages/stage-N.content.ts
 *  2. Agregar una entrada en STAGE_META aquí
 *  3. Registrar en StaticStageContentRepository
 */

export type StageMeta = {
  id: string;
  name: string;
  order: number;
  /** URL de la página de la etapa */
  href: string;
  /** Indica si el contenido está implementado y publicado */
  available: boolean;
  shortDescription?: string;
};

export const STAGE_META: StageMeta[] = [
  {    id: "etapa-0",
    name: "Introducción",
    order: 0,
    href: "/etapa/etapa-0",
    available: true,
    shortDescription: "Conoce el modelo y a Laia, tu asistente.",
  },
  {    id: "etapa-1",
    name: "Reconócete para avanzar",
    order: 1,
    href: "/etapa/etapa-1",
    available: true,
    shortDescription: "Identifica tu punto de partida con un autodiagnóstico.",
  },
  {
    id: "etapa-2",
    name: "Descubre nuevas posibilidades",
    order: 2,
    href: "/etapa/etapa-2",
    available: false,
    shortDescription: "Explora opciones de GenAI para apoyar tu docencia.",
  },
  {
    id: "etapa-3",
    name: "Diseña con propósito",
    order: 3,
    href: "/etapa/etapa-3",
    available: false,
    shortDescription: "Transforma lo explorado en una experiencia estructurada.",
  },
  {
    id: "etapa-4",
    name: "Prepara el terreno para el éxito",
    order: 4,
    href: "/etapa/etapa-4",
    available: false,
    shortDescription: "Convierte el diseño en condiciones operativas y logísticas.",
  },
  {
    id: "etapa-5",
    name: "Hazlo realidad en el aula",
    order: 5,
    href: "/etapa/etapa-5",
    available: false,
    shortDescription: "Pon en práctica lo diseñado con atención a cada estudiante.",
  },
  {
    id: "etapa-6",
    name: "Reflexiona, aprende y mejora",
    order: 6,
    href: "/etapa/etapa-6",
    available: false,
    shortDescription: "Analiza resultados, recoge evidencias y ajusta tu práctica.",
  },
];

export type StageInfo = {
  id: string;
  title: string;
  shortTitle: string;
  extendedDescription: string;
  stagePurpose: string;
  currentFocus: string;
  completionGoal: string;
  nextStagePreview?: {
    title: string;
    context: string;
    userAction: string;
  };
};

export const STAGE_INFO: Record<string, StageInfo> = {
  "etapa-0": {
    id: "etapa-0",
    title: "Introducción",
    shortTitle: "Etapa 0",
    extendedDescription: "Este es tu punto de partida. Aquí conocerás a Laia, tu asistente virtual, y entenderás cómo navegar por el modelo de proceso estructurado para integrar GenAI en tus experiencias de aprendizaje.",
    stagePurpose: "Familiarizarte con el entorno y la metodología del modelo.",
    currentFocus: "Estás explorando la interfaz y aprendiendo la lógica de progreso.",
    completionGoal: "Completarás esta etapa al interactuar con el modelo y el chatbot de prueba.",
    nextStagePreview: {
      title: "Reconócete para avanzar",
      context: "Una vez comprendido el modelo, es crucial saber desde dónde partes.",
      userAction: "Realizarás un autodiagnóstico formativo."
    }
  },
  "etapa-1": {
    id: "etapa-1",
    title: "Reconócete para avanzar",
    shortTitle: "Etapa 1",
    extendedDescription: "Esta etapa está diseñada para que identifiques tu nivel actual de conocimiento y disposición frente al uso de la GenAI. No es una evaluación, sino un punto de referencia.",
    stagePurpose: "Establecer tu punto de partida para recibir orientaciones más pertinentes.",
    currentFocus: "Estás respondiendo el autodiagnóstico confidencial.",
    completionGoal: "Completarás esta etapa al enviar tus respuestas y recibir tu estado inicial.",
    nextStagePreview: {
      title: "Descubre nuevas posibilidades",
      context: "Con tu punto de partida claro, comenzaremos a explorar herramientas.",
      userAction: "Explorarás opciones de GenAI para apoyar tu docencia real."
    }
  },
  "etapa-2": {
    id: "etapa-2",
    title: "Descubre nuevas posibilidades",
    shortTitle: "Etapa 2",
    extendedDescription: "Aquí explorarás opciones prácticas de GenAI para integrarlas en tus actividades docentes con criterio pedagógico y ético.",
    stagePurpose: "Identificar herramientas útiles para tu contexto específico.",
    currentFocus: "Investigando y evaluando distintas alternativas de GenAI.",
    completionGoal: "Seleccionar la herramienta que mejor se adapte a tu objetivo pedagógico.",
    nextStagePreview: {
      title: "Diseña con propósito",
      context: "Toda herramienta necesita un marco didáctico para funcionar.",
      userAction: "Estructurarás una experiencia de aprendizaje integrando GenAI."
    }
  },
  "etapa-3": {
    id: "etapa-3",
    title: "Diseña con propósito",
    shortTitle: "Etapa 3",
    extendedDescription: "Transformarás lo que has explorado en una experiencia de aprendizaje estructurada, coherente y mediada por Inteligencia Artificial.",
    stagePurpose: "Diseñar la intervención pedagógica con GenAI.",
    currentFocus: "Alineando objetivos de aprendizaje con las capacidades de la GenAI.",
    completionGoal: "Tener un diseño didáctico completo y fundamentado.",
    nextStagePreview: {
      title: "Prepara el terreno para el éxito",
      context: "El diseño debe traducirse en condiciones reales.",
      userAction: "Prepararás los aspectos logísticos y operativos."
    }
  },
  "etapa-4": {
    id: "etapa-4",
    title: "Prepara el terreno para el éxito",
    shortTitle: "Etapa 4",
    extendedDescription: "Convertirás tu diseño en condiciones operativas, logísticas y pedagógicas para garantizar un despliegue fluido y seguro en el aula.",
    stagePurpose: "Asegurar que todo esté listo antes del encuentro con los estudiantes.",
    currentFocus: "Validando accesos, prompts y recursos necesarios.",
    completionGoal: "Confirmar la viabilidad técnica y pedagógica del ejercicio.",
    nextStagePreview: {
      title: "Hazlo realidad en el aula",
      context: "Llegó el momento de interactuar con los estudiantes.",
      userAction: "Implementarás la experiencia diseñada en tu clase."
    }
  },
  "etapa-5": {
    id: "etapa-5",
    title: "Hazlo realidad en el aula",
    shortTitle: "Etapa 5",
    extendedDescription: "Pondrás en práctica lo diseñado con un fuerte criterio pedagógico, prestando atención a la experiencia real de cada estudiante.",
    stagePurpose: "Ejecutar la integración de GenAI en vivo.",
    currentFocus: "Guiando a los estudiantes y facilitando la experiencia.",
    completionGoal: "Concluir la actividad con evidencias de aprendizaje.",
    nextStagePreview: {
      title: "Reflexiona, aprende y mejora",
      context: "Toda práctica docente requiere evaluación.",
      userAction: "Analizarás los resultados para iterar tu diseño."
    }
  },
  "etapa-6": {
    id: "etapa-6",
    title: "Reflexiona, aprende y mejora",
    shortTitle: "Etapa 6",
    extendedDescription: "Analizarás los resultados de tu experiencia, recogerás evidencias y ajustarás tu práctica para fortalecer futuros aprendizajes mediados por GenAI.",
    stagePurpose: "Evaluar el impacto y aprender de la implementación.",
    currentFocus: "Analizando qué funcionó y qué se puede mejorar.",
    completionGoal: "Completar el ciclo iterativo de apropiación pedagógica."
  }
};

/** Obtiene el StageMeta para un stageId dado, o undefined si no existe. */
export function getStageMeta(stageId: string): StageMeta | undefined {
  return STAGE_META.find((s) => s.id === stageId);
}

export function getStageInfo(stageId: string): StageInfo | undefined {
  return STAGE_INFO[stageId];
}

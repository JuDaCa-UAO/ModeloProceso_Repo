/**
 * DOMAIN — Rule
 *
 * ResultRule: lógica pura para derivar recomendaciones pedagógicas
 * a partir del nivel de resultado del autodiagnóstico.
 *
 * Depende de: HierarchyLevel (value object del mismo dominio).
 */

import type { StageResultId } from "../value-objects/HierarchyLevel";

/**
 * Retorna las 3 recomendaciones iniciales apropiadas para el nivel del docente.
 * Función pura: sin efectos secundarios, sin dependencias de framework.
 */
export function deriveResultRecommendations(resultId: StageResultId): string[] {
  if (resultId === "inicial") {
    return [
      "Prioriza una actividad concreta y pequeña para iniciar con claridad.",
      "Usa ejemplos guiados antes de diseñar variaciones propias.",
      "Revisa siempre el propósito pedagógico antes de elegir herramientas.",
    ];
  }

  if (resultId === "avanzado") {
    return [
      "Diseña experiencias con mayor autonomía estudiantil y criterios explícitos.",
      "Profundiza en evaluación, trazabilidad y consideraciones éticas del uso de GenAI.",
      "Documenta aprendizajes para compartir prácticas con colegas.",
    ];
  }

  // intermediio (default)
  return [
    "Consolida usos educativos con intención pedagógica y criterios claros.",
    "Fortalece el razonamiento crítico y la ética dentro de actividades concretas.",
    "Avanza con iteraciones breves y registra lo que funciona para mejorar el siguiente ciclo.",
  ];
}

/**
 * DOMAIN — Value Object
 *
 * Nivel jerárquico del docente dentro del modelo de madurez GenAI.
 * Determina el ritmo de acompañamiento, el tipo de recomendaciones y
 * el avatar/mood de Laia (sin acoplarse a ningún componente de UI).
 *
 * Depende de: nada.
 */

export type HierarchyLevel = "Inicial" | "Intermedio" | "Avanzado";

export type StageResultId = "inicial" | "intermedio" | "avanzado";

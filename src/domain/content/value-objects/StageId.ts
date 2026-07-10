/**
 * DOMAIN — Value Object
 *
 * Identificador de las seis etapas y de la Introducción. Puro TypeScript,
 * sin dependencias de React/Next/content/proveedores.
 */
export type NumberedStageId =
  | "etapa-1"
  | "etapa-2"
  | "etapa-3"
  | "etapa-4"
  | "etapa-5"
  | "etapa-6";

export type StageId = "introduccion" | NumberedStageId;

/**
 * Nombres oficiales de las seis etapas — EXACTOS, no se traducen, no se
 * acortan, no se renombran. `Record<NumberedStageId, string>` obliga al
 * compilador a mantener las seis entradas si el conjunto de `StageId` cambia.
 */
export const OFFICIAL_STAGE_NAMES: Record<NumberedStageId, string> = {
  "etapa-1": "Reconócete para avanzar",
  "etapa-2": "Descubre nuevas posibilidades",
  "etapa-3": "Diseña con propósito",
  "etapa-4": "Prepara el terreno para el éxito",
  "etapa-5": "Hazlo realidad en el aula",
  "etapa-6": "Reflexiona, aprende y mejora",
};

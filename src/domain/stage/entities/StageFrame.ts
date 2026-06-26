/**
 * DOMAIN — Tipo StageFrame
 *
 * Tipo puro (sin React ni CSS) que describe un frame dentro de una etapa.
 * Parte del contrato declarativo objetivo (ver Stage.ts).
 *
 * TODO (diferido por riesgo funcional): aún no se consume en presentación.
 * El `StageClient` sigue renderizando los frames con lógica quemada; la
 * migración a esta config declarativa es una fase posterior.
 */

export type StageFrame = {
  id: string;
  stageId: string;
  order: number;
  title: string;
  /** Clave del componente de presentación que renderiza el frame. */
  componentKey: string;
  /** IDs de los diálogos de LaIA asociados a este frame. */
  dialogIds: string[];
  backgroundImage?: string;
  downloadableResourceIds?: string[];
};

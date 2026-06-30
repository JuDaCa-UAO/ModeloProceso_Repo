/**
 * DOMAIN — Tipo LaIADialog
 *
 * Tipo puro (sin React ni CSS) que describe un diálogo de LaIA de forma
 * declarativa e independiente de la presentación.
 *
 * TODO (diferido por riesgo funcional): hoy los diálogos viven en
 * `content/dialogs/*.dialogs.ts` como `CharacterDialogStep[]` (estructura que ya
 * consume el StageClient). Este tipo es el objetivo hacia el que migrar esos
 * datos cuando se centralice la configuración por frames. No se consume aún.
 */

export type LaIADialog = {
  id: string;
  stageId: string;
  frameId: string;
  page: number;
  totalPages: number;
  text: string;
  audioKey?: string;
  visualHint?: string;
  nextAction?: string;
};

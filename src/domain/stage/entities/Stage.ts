/**
 * DOMAIN — Entidad/tipo Stage
 *
 * Tipo puro (sin React ni CSS) que describe la configuración declarativa de una
 * etapa del modelo de proceso. Es el contrato objetivo hacia el que se migrará el
 * `StageClient`, que hoy tiene la lógica de frames quemada.
 *
 * TODO (diferido por riesgo funcional): el StageClient aún NO consume este tipo.
 * Cuando se centralice la configuración de frames, cada etapa se declarará con un
 * objeto `Stage` y el orquestador visual leerá `frames` desde aquí en lugar del
 * gran `if/else` actual. No importar este tipo en presentación todavía.
 */

import type { StageFrame } from "@domain/stage/entities/StageFrame";

/** Configuración del visor 3D para una etapa concreta. */
export type ViewerStageConfig = {
  /** Clave de la secuencia/animación a mostrar en el viewer. */
  sequenceKey?: string;
  /** Etiqueta de la etapa resaltada en el modelo. */
  highlightLabel?: string;
};

/** Recurso descargable asociado a una etapa o frame. */
export type DownloadableResource = {
  id: string;
  title: string;
  href: string;
  /** Tipo de archivo para la UI (pdf, zip, etc.). */
  kind?: string;
};

export type Stage = {
  id: string;
  order: number;
  title: string;
  slug: string;
  route: string;
  frames: StageFrame[];
  downloadableResources?: DownloadableResource[];
  viewerConfig?: ViewerStageConfig;
  /** Color o acento visual de la etapa, si aplica. */
  accent?: string;
};

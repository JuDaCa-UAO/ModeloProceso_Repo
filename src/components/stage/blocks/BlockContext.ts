/**
 * PRESENTATION — Block Context
 *
 * BlockContext: tipo compartido entre BlockRenderer y todos los bloques individuales.
 * Define el contrato de comunicación entre el motor de renderizado y cada bloque.
 *
 * Al pasar el contexto como prop explícita (en lugar de Context API o module globals),
 * cada bloque es un componente puro y fácilmente testeable.
 */

import type { Stage1ProgressState } from "@domain/stage/entities/StageProgress";
import type { StageFlagKey } from "@domain/stage/value-objects/StageFlagKey";

export type BlockContext = {
  /** ID de la etapa activa (para parametrizar el store). */
  stageId: string;
  /** Estado raw del progreso. Los bloques lo leen para mostrar datos. */
  state: Stage1ProgressState;
  /** Flags derivados. Los bloques los usan para lógica de habilitación. */
  flags: Record<StageFlagKey, boolean>;
  /** Actualiza el estado del store con un patch parcial. */
  onUpdate: (patch: Partial<Stage1ProgressState>) => void;
  /** Hace scroll suave al elemento con el id dado. */
  onScrollTo: (id: string) => void;
  /** Navega a una ruta y actualiza el progreso global. */
  onNavigate: (href: string) => void;
};

/**
 * DOMAIN — Entity
 *
 * Una de las seis etapas de la Cartilla. `unlock`/condiciones de desbloqueo
 * NO se modelan: el diseño no las usa (scroll libre, sin gating) y el plan
 * de rework solo las contempla "si son necesarias" — hoy no lo son.
 */
import type { NumberedStageId } from "./value-objects/StageId";
import type { MediaKey } from "./value-objects/MediaKey";
import type { Accent } from "./value-objects/Accent";
import type { Section } from "./Section";
import type { LaiaMessage } from "./LaiaMessage";
import type { StageClosing } from "./StageClosing";

/** Portada de capítulo: gradiente + número watermark + badges + chips + pose de LaIA. */
export interface StageCover {
  badgeLabel: string; // "ETAPA N"
  chapterLabel: string; // "CAPÍTULO N DE 6"
  title: string; // nombre oficial, EXACTO
  description: string;
  tags: string[];
  laiaAvatar: MediaKey;
}

/** Animación de transición al siguiente capítulo (ambiental: autoplay/loop/muted). */
export interface StageTransition {
  mediaKey: MediaKey;
  /** Nombre oficial del capítulo siguiente, para el pie de la animación ("Próximo capítulo: <nextStageName>"). */
  nextStageName: string;
}

export interface Stage {
  id: NumberedStageId;
  order: number;
  officialName: string;
  accent: Accent;
  cover: StageCover;
  sections: Section[];
  laia: LaiaMessage[];
  closing: StageClosing;
  /** Ausente solo en la Etapa 6 (su cierre es cíclico, no una transición a otra etapa). */
  transition?: StageTransition;
  a11y?: { summary?: string };
}

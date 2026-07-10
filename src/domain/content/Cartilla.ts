/**
 * DOMAIN — Aggregate Root
 *
 * La Cartilla completa: portada de Introducción, sus secciones, las seis
 * etapas en orden, los cinco factores rectores y el cierre final ("La
 * espiral continúa" — distinto del cierre cíclico propio de la Etapa 6).
 */
import type { Section } from "./Section";
import type { Stage, StageTransition } from "./Stage";
import type { Factor } from "./Factor";
import type { LaiaMessage } from "./LaiaMessage";
import type { MediaKey } from "./value-objects/MediaKey";

export interface IntroCover {
  title: string;
  quote: string;
  quoteAuthor: string;
  description: string;
}

export interface FinalClosing {
  title: string;
  message: string;
  note: string;
  laiaAvatar: MediaKey;
}

export interface Cartilla {
  introCover: IntroCover;
  introLaia: LaiaMessage[];
  introSections: Section[];
  introTransition?: StageTransition;
  stages: Stage[];
  factoresRectores: Factor[];
  finalClosing: FinalClosing;
}

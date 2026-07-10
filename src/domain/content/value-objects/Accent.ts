/**
 * DOMAIN — Value Object
 *
 * Acento visual de una etapa. Los campos guardan NOMBRES de variables CSS
 * (definidas en `src/styles/uao-tokens.css`, Fase 3), nunca valores
 * hexadecimales — esa hoja de tokens es la única fuente de verdad del color
 * real; el dominio y el contenido solo referencian su nombre.
 *
 * El diseño usa dos paletas distintas por etapa: una para la portada de
 * capítulo/borde de contenido (`Accent`) y otra, deliberadamente diferente,
 * para la tarjeta de cierre "CierreEtapa" (`ClosingAccent`).
 */
export interface Accent {
  /** var(--uao-stage-N-accent) — gradiente de portada, borde de contenido. */
  main: string;
  /** var(--uao-stage-N-chip) — color del badge "CAPÍTULO N DE 6". */
  chip: string;
}

export interface ClosingAccent {
  /** var(--uao-stage-N-closing-accent) — badge y acentos de CierreEtapa. */
  main: string;
  /** var(--uao-stage-N-closing-soft) — fondo suave del panel de cierre. */
  soft: string;
}

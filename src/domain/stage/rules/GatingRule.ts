/**
 * DOMAIN — Rule
 *
 * GatingRule: controla la visibilidad de secciones del árbol de contenido.
 * Una sección es accesible si todos sus flags requeridos están activos.
 *
 * Depende de: StageFlagKey (value object del mismo dominio).
 */

import type { StageFlagKey } from "../value-objects/StageFlagKey";

/**
 * Retorna `true` cuando todos los flags requeridos están presentes y activos.
 * Si `requires` es undefined o vacío, siempre permite el acceso.
 */
export function hasRequiredFlags(
  flags: Record<StageFlagKey, boolean>,
  requires?: StageFlagKey[]
): boolean {
  if (!requires?.length) return true;
  return requires.every((flag) => flags[flag]);
}

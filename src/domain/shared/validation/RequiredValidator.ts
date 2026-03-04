/**
 * DOMAIN — Shared Validation
 *
 * RequiredValidator: verifica que un campo de texto no esté vacío.
 * Función pura, sin efectos secundarios.
 */

/** Retorna `true` si `value` tiene al menos un carácter no-espacio. */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * DOMAIN — Shared Validation
 *
 * EmailValidator: valida el formato de una dirección de correo electrónico.
 * Función pura, sin efectos secundarios, sin dependencias de framework.
 *
 * Nota de seguridad: esta validación es solo sintáctica (formato).
 * La verificación real de existencia del correo debe hacerse server-side.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Retorna `true` si `value` tiene formato de email válido. */
export function isEmailValid(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

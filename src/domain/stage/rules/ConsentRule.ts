/**
 * DOMAIN — Rule
 *
 * ConsentRule: regla de negocio pura que determina si el consentimiento
 * de un docente es válido para habilitar el autodiagnóstico.
 *
 * 100% testeable con Jest/Vitest sin montar ningún componente.
 *
 * Depende de: EmailValidator (misma capa de dominio).
 */

import { isEmailValid } from "@domain/shared/validation/EmailValidator";
import type { Stage1ProgressState } from "../entities/StageProgress";

type ConsentInput = Pick<
  Stage1ProgressState,
  "consentAdmin" | "consentUsage" | "email" | "stage1AnimationViewed"
>;

/**
 * Retorna `true` cuando el docente cumple todos los requisitos de consentimiento:
 *  1. Ha visto la animación introductoria.
 *  2. Aceptó que no es evaluación administrativa.
 *  3. Aceptó el uso de sus respuestas.
 *  4. Proporcionó un correo electrónico válido.
 */
export function evaluateConsent(input: ConsentInput): boolean {
  return (
    input.stage1AnimationViewed &&
    input.consentAdmin &&
    input.consentUsage &&
    isEmailValid(input.email)
  );
}

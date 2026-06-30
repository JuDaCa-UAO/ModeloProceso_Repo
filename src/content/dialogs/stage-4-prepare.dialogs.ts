/**
 * CONTENT — Diálogos de LaIA · Etapa 4 (Prepara el terreno para el éxito)
 *
 * DATOS PUROS. Los parlamentos de LaIA se copian LITERALMENTE desde
 * `contexto/fuentes/EMI_escrita.md` (Etapa 4, secciones 1–5 y transición),
 * conservando el orden y la paginación (1/2, 1/3, …). No se parafrasean ni se resumen.
 *
 * Audios: la Etapa 4 aún no tiene narración grabada. Se omite `audioSrc`; el
 * botón de audio queda deshabilitado ("Audio próximamente") sin romper la UI.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

// ─── Sección 1 · Del diseño al alistamiento (EMI 4.1) ───────────────────────
export const STAGE4_S1_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya vimos cómo una experiencia puede diseñarse con propósito. Ahora aparece una pregunta práctica: ¿está lista para llegar al aula?",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Esta etapa no repite el diseño. Ayuda a revisar si existen las condiciones para que la experiencia sea clara, segura y viable.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Sección 2 · Preparar no es repetir el diseño (EMI 4.2) ──────────────────
export const STAGE4_S2_STEPS: CharacterDialogStep[] = [
  {
    text: "Preparar el terreno significa revisar más que la herramienta. También implica cuidar instrucciones, expectativas, reglas de uso y acompañamiento.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Una experiencia puede estar bien diseñada, pero fallar si los estudiantes no acceden, no entienden qué hacer o no tienen claridad sobre los límites de la IA.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 3 · Tablero de preparación (EMI 4.3) ───────────────────────────
export const STAGE4_S3_STEPS: CharacterDialogStep[] = [
  {
    text: "Este tablero muestra algunas preguntas que el docente podría revisar antes del aula: ¿la herramienta funciona?, ¿las instrucciones son claras?, ¿hay reglas de uso?",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "También conviene prever un plan B y formas de acompañamiento. Preparar no elimina todos los riesgos, pero ayuda a anticiparlos mejor.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 4 · Ejemplo demostrativo de riesgo (EMI 4.4) ────────────────────
export const STAGE4_S4_STEPS: CharacterDialogStep[] = [
  {
    text: "Imagina que durante la actividad una herramienta deja de responder, o un estudiante intenta ingresar datos sensibles. Estos escenarios no deben resolverse desde la improvisación total.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "El alistamiento permite preparar alternativas, mensajes claros y reglas de cuidado antes de que la experiencia ocurra.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 5 · Canvas de alistamiento y cierre (EMI 4.5) ───────────────────
export const STAGE4_S5_STEPS: CharacterDialogStep[] = [
  {
    text: "Para organizar esta preparación, el modelo propone un Canvas de alistamiento. No necesitas completarlo ahora; lo descargarás como material de apoyo.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Este recurso ayuda a revisar condiciones mínimas antes de llevar la experiencia al aula.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "En una espiral, prepararse no significa asegurar que todo será perfecto. Significa llegar con más claridad para observar, ajustar y aprender.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Ahora puedes descargar este canvas para aplicarlo cuando prepares una experiencia mediada por IA.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Transición hacia la Etapa 5 ──────────────────────────────────────────────
export const STAGE4_TRANSITION_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya preparaste el terreno y revisaste las condiciones para asegurar que la experiencia sea clara, segura y viable. Ahora es momento de llevarla al aula para hacerla realidad junto a tus estudiantes.",
    imgSrc: LAIA_ASSETS.triumphant,
  },
];

/** Compatibilidad con el placeholder previo. */
export const STAGE4_LAIA_STEPS: CharacterDialogStep[] = [];

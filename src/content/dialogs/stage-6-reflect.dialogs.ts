/**
 * CONTENT — Diálogos de LaIA · Etapa 6 (Reflexiona, aprende y mejora)
 *
 * DATOS PUROS. Los parlamentos de LaIA se copian LITERALMENTE desde
 * `contexto/fuentes/EMI_escrita.md` (Etapa 6, secciones 1–5 y cierre),
 * conservando el orden y la paginación (1/2, 1/3, …). No se parafrasean ni se resumen.
 *
 * Audios: la Etapa 6 no tiene narración grabada. Se omite `audioSrc`; el
 * botón de audio queda deshabilitado sin romper la UI.
 *
 * Cierre: EMI ofrece 3 páginas para el cierre ("El proceso continúa" 1/2 + 2/2 +
 * "Mensaje final" 1/1). Los mockups (imágenes 193/195) muestran 2 páginas; se usa
 * la 1/2 y la 1/1 ("Mensaje final"), omitiendo la 2/2 para coincidir con el diseño.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

export const STAGE6_LAIA_STEPS: CharacterDialogStep[] = [];

// ─── Sección 1 · Del aula a la reflexión / Mira lo vivido (EMI 6.1) ─────────
export const STAGE6_S1_STEPS: CharacterDialogStep[] = [
  {
    text: "Llegamos a la última etapa de esta vuelta de la espiral, pero no al final del proceso. Ahora miramos lo ocurrido para aprender de la experiencia.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "La evaluación no aparece para juzgar la actividad, sino para comprender qué funcionó, qué debe ajustarse y qué puede mejorar en la próxima iteración.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 2 · Evaluar no es solo calificar (EMI 6.2) ──────────────────────
export const STAGE6_S2_STEPS: CharacterDialogStep[] = [
  {
    text: "Evaluar una experiencia mediada por IA no significa mirar solo una nota o un producto final. También implica comprender cómo se vivió el proceso.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Por eso se revisan dimensiones pedagógicas, técnicas, éticas, cognitivas y emocionales. Cada una muestra una parte distinta de la experiencia.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 3 · Dos miradas sobre la experiencia (EMI 6.3) ──────────────────
export const STAGE6_S3_STEPS: CharacterDialogStep[] = [
  {
    text: "Una experiencia no se entiende desde una sola mirada. El docente observa el proceso, pero los estudiantes viven la experiencia desde dentro.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Cuando ambas perspectivas se cruzan, aparecen aprendizajes más completos: claridad, utilidad, dificultades, emociones y oportunidades de mejora.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 4 · De hallazgo a mejora (EMI 6.4) ──────────────────────────────
export const STAGE6_S4_STEPS: CharacterDialogStep[] = [
  {
    text: "Un hallazgo solo se vuelve útil cuando produce una decisión. Por ejemplo: si hubo copia acrítica, puede faltar una pausa de verificación.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Si falló el acceso, puede ser necesario mejorar el alistamiento. Si la IA no aportó valor, tal vez haya que revisar el diseño o volver a explorar herramientas.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Así funciona la espiral: cada experiencia deja información para ajustar la siguiente.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 5 · Canvas, cierre y nueva vuelta (EMI 6.5) ─────────────────────
export const STAGE6_S5_STEPS: CharacterDialogStep[] = [
  {
    text: "Para organizar esta reflexión, el modelo propone un Canvas de evaluación. No necesitas completarlo ahora; lo reconocerás como material para evaluar una experiencia real.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Este recurso ayuda a ordenar evidencias, percepciones, aprendizajes y decisiones de mejora.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "La espiral no termina aquí. Cada evaluación puede llevarte a reconocerte de nuevo, descubrir otras posibilidades y diseñar una versión mejorada.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Ahora puedes descargar este canvas para aplicarlo cuando evalúes una experiencia mediada por IA.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Cierre · La espiral continúa (EMI Cierre §1 p.1/2 + §2 p.1/1) ──────────
export const STAGE6_CLOSING_STEPS: CharacterDialogStep[] = [
  {
    text: "Has completado esta vuelta de la espiral. Ahora conoces las etapas que orientan la integración pedagógica de la IA en una experiencia de aprendizaje.",
    imgSrc: LAIA_ASSETS.triumphant,
  },
  {
    text: "La espiral continúa. Cuando vuelvas a iniciar el recorrido, no estarás en el mismo punto: volverás con más experiencia, más criterio y nuevas oportunidades para enriquecer tu práctica docente.",
    imgSrc: LAIA_ASSETS.triumphant,
  },
];

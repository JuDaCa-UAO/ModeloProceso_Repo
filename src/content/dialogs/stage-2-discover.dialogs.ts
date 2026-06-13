/**
 * CONTENT — Diálogos de Laia · Etapa 2 (Descubre nuevas posibilidades)
 *
 * DATOS PUROS. Los parlamentos de Laia se copian LITERALMENTE desde
 * `contexto/fuentes/EMI_escrita.md` (Etapa 2, secciones 1–5), conservando
 * el orden y la paginación (1/2, 1/3, …). No se parafrasean ni se resumen.
 *
 * El parlamento de transición (último frame) corresponde al texto mostrado en
 * el diseño aprobado (contexto/disenos/etapa-2/89.jpg). EMI no incluye una línea
 * de transición explícita de Etapa 2; se documenta esta decisión en
 * contexto/context.md.
 *
 * Audios: la Etapa 2 aún no tiene narración grabada. Se omite `audioSrc`; el
 * botón de audio queda deshabilitado ("Audio próximamente") sin romper la UI.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

// ─── Sección 1 · Tu lugar en la iteración (EMI 2.1) ───────────────────────────
export const STAGE2_S1_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya reconociste tu punto de partida. Ahora la espiral avanza hacia una nueva pregunta: ¿qué posibilidades puede abrir la IA para tu enseñanza?",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "En esta etapa no vamos a elegir una herramienta todavía. Primero vamos a entender cómo mirar esas posibilidades sin perder de vista tu contexto.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Sección 2 · No se elige por moda, se explora con propósito (EMI 2.2) ──────
export const STAGE2_S2_STEPS: CharacterDialogStep[] = [
  {
    text: "Cuando hablamos de descubrir posibilidades, no hablamos de revisar una lista infinita de aplicaciones. Hablamos de entender para qué podría servir cada una.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Una herramienta puede ayudar a explicar, retroalimentar, crear materiales, simular situaciones o analizar información. Su valor depende del propósito que la orienta.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 3 · Cómo se miran las posibilidades (EMI 2.3) ─────────────────────
export const STAGE2_S3_STEPS: CharacterDialogStep[] = [
  {
    text: "Para mirar una herramienta con criterio, el modelo propone varias preguntas. No basta con preguntar si la herramienta es novedosa o popular.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "También importa si el docente puede usarla con confianza, si aporta a la actividad, si cuida los datos y si favorece el razonamiento crítico.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Estos criterios ayudan a que la IA no entre por moda, sino por pertinencia pedagógica, responsabilidad y posibilidad real de uso.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Sección 4 · Ejemplo demostrativo de comparación (EMI 2.4) ─────────────────
export const STAGE2_S4_STEPS: CharacterDialogStep[] = [
  {
    text: "Observa este ejemplo: si un docente quiere fortalecer un debate, no busca cualquier IA. Busca una opción que ayude a preparar argumentos, contrastar posturas o revisar fuentes.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "La comparación no decide por el docente. Le ayuda a ver qué posibilidad se ajusta mejor a su actividad, sus estudiantes y sus condiciones de uso.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 5 · Material de apoyo y cierre (EMI 2.5) ──────────────────────────
export const STAGE2_S5_STEPS: CharacterDialogStep[] = [
  {
    text: "Para apoyar este análisis, el modelo propone una Matriz Pugh. No necesitas diligenciarla ahora; aquí solo la reconocerás como material de trabajo.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Cuando apliques esta etapa en tu práctica, la matriz te ayudará a comparar herramientas con mayor claridad y justificar mejor tus decisiones.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Recuerda: en una espiral, una decisión puede revisarse más adelante. Lo importante es aprender a mirar la tecnología con criterio.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Transición hacia la Etapa 3 (diseño 89.jpg; ver nota de cabecera) ─────────
export const STAGE2_TRANSITION_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya descubriste nuevas posibilidades para integrar IA con criterio. Ahora es momento de convertir esas posibilidades en una experiencia de aprendizaje con propósito.",
    imgSrc: LAIA_ASSETS.triumphant,
  },
];

/** Compatibilidad con el placeholder previo (no se usa en el render). */
export const STAGE2_LAIA_STEPS: CharacterDialogStep[] = [];

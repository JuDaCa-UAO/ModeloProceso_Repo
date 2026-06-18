/**
 * CONTENT — Diálogos de Laia · Etapa 3 (Diseña con propósito)
 *
 * DATOS PUROS. Los parlamentos de Laia se copian LITERALMENTE desde
 * `contexto/fuentes/EMI_escrita.md` (Etapa 3, secciones 1–5), conservando
 * el orden y la paginación (1/2, 1/3, …). No se parafrasean ni se resumen.
 *
 * Audios: la Etapa 3 aún no tiene narración grabada. Se omite `audioSrc`; el
 * botón de audio queda deshabilitado ("Audio próximamente") sin romper la UI.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

// ─── Sección 1 · De explorar a diseñar (EMI 3.1) ───────────────────────────
export const STAGE3_S1_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya vimos que la IA puede abrir muchas posibilidades. Ahora la pregunta cambia: ¿cómo convertir una posibilidad en una experiencia de aprendizaje con sentido?",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "En esta etapa, la herramienta deja de estar sola. Empieza a conectarse con objetivos, actividades, estudiantes, evaluación y mediación docente.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Sección 2 · La IA entra en una experiencia, no en el vacío (EMI 3.2) ──────
export const STAGE3_S2_STEPS: CharacterDialogStep[] = [
  {
    text: "Diseñar con propósito significa mirar más allá de la herramienta. La IA debe tener un papel claro dentro de una experiencia completa.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Por eso, el docente necesita pensar qué se quiere lograr, qué hará el estudiante, cómo acompañará el proceso y cómo se evaluará el aprendizaje.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 3 · El mapa del diseño (EMI 3.3) ─────────────────────
export const STAGE3_S3_STEPS: CharacterDialogStep[] = [
  {
    text: "El modelo organiza el diseño en varios elementos: objetivo, actividad, soluciones de IA, razonamiento crítico, ética, evaluación y seguimiento.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "No se trata de memorizar estos bloques. Lo importante es comprender que cada decisión del diseño debe dialogar con las demás.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Si una herramienta no aporta al objetivo, no cuida la ética o debilita el pensamiento del estudiante, el diseño necesita revisarse.",
    imgSrc: LAIA_ASSETS.explain,
  },
];

// ─── Sección 4 · Ejemplo demostrativo (EMI 3.4) ─────────────────
export const STAGE3_S4_STEPS: CharacterDialogStep[] = [
  {
    text: "Miremos un ejemplo: un docente quiere que sus estudiantes analicen un caso con apoyo de IA. La herramienta puede ayudar a generar preguntas o contrastar perspectivas.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Pero el diseño debe dejar claro qué analiza el estudiante, qué valida el docente, qué límites tiene el uso de IA y cómo se evaluará el proceso.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Sección 5 · Canvas y cierre iterativo (EMI 3.5) ──────────────────────────
export const STAGE3_S5_STEPS: CharacterDialogStep[] = [
  {
    text: "Para organizar estas decisiones, el modelo propone un Canvas de diseño. No necesitas completarlo ahora; en la cartilla lo reconocerás como una guía de trabajo.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Este canvas ayuda a convertir una idea en una experiencia más clara, coherente y responsable.",
    imgSrc: LAIA_ASSETS.holo,
  },
  {
    text: "Y recuerda: el diseño no queda cerrado. En la espiral, podrá ajustarse cuando prepares, lleves al aula y evalúes la experiencia.",
    imgSrc: LAIA_ASSETS.explain,
  },
  {
    text: "Ahora puedes descargar este canvas para aplicarlo cuando diseñes tus propias experiencias de aprendizaje.",
    imgSrc: LAIA_ASSETS.holo,
  },
];

// ─── Transición hacia la Etapa 4 ──────────────────────────────────────────────
export const STAGE3_TRANSITION_STEPS: CharacterDialogStep[] = [
  {
    text: "Ya diseñaste una experiencia de aprendizaje con propósito. Ahora es momento de preparar el terreno para asegurar que las condiciones técnicas, pedagógicas y éticas estén listas para el aula.",
    imgSrc: LAIA_ASSETS.triumphant,
  },
];

/** Compatibilidad con el placeholder previo. */
export const STAGE3_LAIA_STEPS: CharacterDialogStep[] = [];

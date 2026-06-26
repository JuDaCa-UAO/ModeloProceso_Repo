/**
 * CONTENT — Diálogos y copy de la Etapa 1 (Reconócete para avanzar)
 *
 * Textos de LaIA y datos de secciones extraídos de StageClient (frames 2-5).
 * Son DATOS PUROS: el texto, los assets y los audios son idénticos a los que
 * antes vivían hardcodeados dentro del componente. La presentación (JSX) no
 * cambió; solo se movió el contenido aquí para organizarlo por etapa.
 *
 * Para editar el copy de la Etapa 1: editar solo este archivo.
 *
 * Depende de: tipo CharacterDialogStep (presentación), solo a nivel de tipos.
 */

import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";

// ─── Diálogo de LaIA — Frame 2 (consentimiento) ───────────────────────────────

export const F6_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Tus respuestas son confidenciales y se usan únicamente para orientar este recorrido. No es un examen, ni tiene efectos administrativos.",
    imgSrc: "/ui/LaIA_explaining_holo.png",
    audioSrc: "/audio/Audios_laia/Etapa-1/LaIAAudio-seccion2.ogg",
  },
];

// ─── Diálogo de LaIA — Frame 3 (estados) ──────────────────────────────────────

export const F7_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "A lo largo de este proceso podrás reconocer en qué estado te encuentras frente al uso de la IA. Estos estados no son etiquetas ni juicios de valor: son puntos de referencia que ayudan a orientar tu recorrido. El autodiagnóstico permitirá identificar tu punto de partida dentro del modelo.",
    imgSrc: "/ui/laia.png",
    audioSrc: "/audio/Audios_laia/Etapa-1/LaIAAudio-seccion3.ogg",
  },
];

// ─── Tarjetas de estados — Frame 3 ────────────────────────────────────────────

export const ESTADO_CARDS = [
  {
    label: "Inicial",
    title: "Aprendiendo sin miedo",
    desc: "Primeras aproximaciones con curiosidad y necesidad de guía clara. Recibirás apoyo más guiado, ejemplos listos para adaptar y recomendaciones paso a paso.",
  },
  {
    label: "Intermedio",
    title: "Explorando con propósito",
    desc: "Ya experimentas con intención educativa y buscas mayor coherencia pedagógica. Recibirás recomendaciones para fortalecer decisiones didácticas, críticas y éticas.",
  },
  {
    label: "Avanzado",
    title: "Innovando e inspirando",
    desc: "Integras GenAI de forma crítica, creativa y estratégica en distintos contextos. Recibirás retos de mayor profundidad y oportunidades para compartir aprendizajes.",
  },
] as const;

// ─── Diálogo de LaIA — Frame 4 (autodiagnóstico) ──────────────────────────────

export const F8_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "El autodiagnóstico busca reconocer tu nivel actual de conocimiento, experiencia y disposición frente al uso de la GenAI en educación. A partir de tus respuestas, podrás ubicarte en un estado inicial del recorrido y recibir una orientación más pertinente para avanzar.",
    imgSrc: "/ui/laia_explaining.png",
    audioSrc: "/audio/Audios_laia/Etapa-1/LaIAAudio-seccion4-1.ogg",
  },
  {
    text: "Tu estado actual será enviado por correo al terminar.",
    imgSrc: "/ui/laia.png",
    audioSrc: "/audio/Audios_laia/Etapa-1/LaIAAudio-seccion4-2.ogg",
  },
];

// ─── Diálogo de LaIA — Frame 5 (transición, pos-video) ────────────────────────

export const F9_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Listo. Con esta información ya tenemos un punto de partida para el recorrido. Ahora pasaremos a explorar nuevas posibilidades de uso de GenAI.",
    imgSrc: "/ui/LaIA_triumphant.png",
    audioSrc: "/audio/Audios_laia/Etapa-1/LaIAAudio-seccion5.ogg",
  },
];

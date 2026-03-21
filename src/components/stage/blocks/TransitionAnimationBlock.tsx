"use client";

import AnimationBlock from "./AnimationBlock";
import type { BlockContext } from "./BlockContext";

const TRANSITION_VIDEO_URL = "/videos/TransicionE1-a-E2.mp4";

type TransitionAnimationBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque de animación de transición de Etapa 1 a Etapa 2.
 * Wrapper de AnimationBlock con la configuración específica de esta transición.
 *
 * Al completarse, activa el flag "transitionAnimationViewed" en el store,
 * lo que habilita el botón "Continuar a Etapa 2".
 */
export default function TransitionAnimationBlock({ ctx }: TransitionAnimationBlockProps) {
  return (
    <AnimationBlock
      ctx={ctx}
      videoSrc={TRANSITION_VIDEO_URL}
      flagToSet="transitionAnimationViewed"
      blockAdvance
      title="Cambio de estacion"
      description="Este video de cierre completa la salida de Etapa 1 y prepara el paso visual hacia la siguiente estacion del recorrido."
    />
  );
}

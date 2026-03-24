"use client";

import AnimationCard from "@/components/stage/AnimationCard";
import type { BlockContext } from "./BlockContext";

type AnimationBlockProps = {
  ctx: BlockContext;
  videoSrc: string;
  flagToSet: "stage1AnimationViewed" | "transitionAnimationViewed";
  blockAdvance?: boolean;
  onPlayStart?: () => void;
  viewerMode?: "video" | "mini-spiral";
  minSpiralViewMs?: number;
};

/**
 * Bloque de animación de video con control de completion.
 * Al completarse, llama a ctx.onUpdate para actualizar el flag correspondiente.
 *
 * El flag a activar es configurable (no hardcodeado) para reutilizar este
 * bloque en la animación de intro y en la de transición E1→E2.
 */
export default function AnimationBlock({
  ctx,
  videoSrc,
  flagToSet,
  blockAdvance = false,
  onPlayStart,
  viewerMode = "video",
  minSpiralViewMs,
}: AnimationBlockProps) {
  const completed = ctx.flags[flagToSet];

  return (
    <AnimationCard
      title=""
      description=""
      videoSrc={videoSrc}
      completed={completed}
      onPlayStart={
        flagToSet === "stage1AnimationViewed"
          ? () => {
              ctx.onUpdate({ stage1AnimationStarted: true });
              onPlayStart?.();
            }
          : onPlayStart
      }
      onComplete={() => ctx.onUpdate({ [flagToSet]: true })}
      autoplayOnVisible={false}
      blockAdvanceUntilComplete={blockAdvance}
      blockedAdvanceMessage={
        blockAdvance
          ? viewerMode === "mini-spiral"
            ? "Para continuar con la etapa, explora el modelo 3D y completa la visualización. Hasta entonces no se habilita el resto del contenido."
            : "Para continuar con la etapa, primero debes reproducir y completar esta animación. Hasta entonces no se habilita el resto del contenido."
          : undefined
      }
      viewerMode={viewerMode}
      minSpiralViewMs={minSpiralViewMs}
    />
  );
}

"use client";

import AnimationCard from "@/components/stage/AnimationCard";
import type { BlockContext } from "./BlockContext";

type AnimationBlockProps = {
  ctx: BlockContext;
  videoSrc: string;
  flagToSet: "stage1AnimationViewed" | "transitionAnimationViewed";
  blockAdvance?: boolean;
  onPlayStart?: () => void;
  title?: string;
  description?: string;
  variant?: "default" | "hero";
};

export default function AnimationBlock({
  ctx,
  videoSrc,
  flagToSet,
  blockAdvance = false,
  onPlayStart,
  title = "",
  description = "",
  variant = "default",
}: AnimationBlockProps) {
  const completed = ctx.flags[flagToSet];

  return (
    <AnimationCard
      title={title}
      description={description}
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
          ? "Para continuar con la etapa, primero debes reproducir y completar esta animacion. Hasta entonces no se habilita el resto del contenido."
          : undefined
      }
      variant={variant}
    />
  );
}

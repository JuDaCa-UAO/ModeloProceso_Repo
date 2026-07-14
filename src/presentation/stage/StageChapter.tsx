/**
 * PRESENTATION — Server Component
 *
 * Composición de un capítulo de etapa completo: portada → LaIA → secciones
 * de contenido → cierre → transición. Reutilizada por las 6 etapas — cada
 * una solo aporta datos (`Stage`), nunca JSX propio (mismo principio que el
 * motor viejo, pero Server-first y sin gating).
 */
import type { Stage } from "@domain/content/Stage";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import StageCover from "./StageCover";
import StageAbrebocas from "./StageAbrebocas";
import StageClosingCard from "./StageClosingCard";
import ContentSection from "@/presentation/content/ContentSection";
import LaiaStepper from "@/presentation/laia/LaiaStepper";
import TransitionAnimation from "@/presentation/video/TransitionAnimation";

export default function StageChapter({ stage, resolver }: { stage: Stage; resolver: IMediaResolver }) {
  const laiaSteps = stage.laia.map((message) => {
    const avatar = resolver.resolve(message.avatarKey);
    return {
      id: message.id,
      text: message.text,
      avatarUrl: avatar.available ? avatar.url : null,
      avatarFallback: avatar.fallback,
    };
  });

  const transitionMedia = stage.transition ? resolver.resolve(stage.transition.mediaKey) : null;
  const abrebocas = stage.abrebocas ? resolver.resolve(stage.abrebocas) : null;
  const stageNumber = String(stage.order).padStart(2, "0");

  return (
    <>
      <StageCover stage={stage} resolver={resolver} />
      {abrebocas?.available && abrebocas.url ? (
        <StageAbrebocas url={abrebocas.url} accent={stage.accent.main} />
      ) : null}
      <LaiaStepper steps={laiaSteps} />
      {stage.sections.map((section) => (
        <ContentSection key={section.id} section={section} resolver={resolver} />
      ))}
      <StageClosingCard closing={stage.closing} stageNumber={stageNumber} resolver={resolver} />
      {stage.transition && transitionMedia ? (
        <TransitionAnimation
          url={transitionMedia.available ? transitionMedia.url : null}
          fallback={transitionMedia.fallback}
          captionLabel="Próximo capítulo:"
          captionStage={`Etapa ${stage.order + 1} · ${stage.transition.nextStageName}`}
        />
      ) : null}
    </>
  );
}

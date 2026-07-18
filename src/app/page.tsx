import AppShell from "@/presentation/shell/AppShell";
import IntroPortada from "@/presentation/sections/IntroPortada";
import LaiaStepper from "@/presentation/laia/LaiaStepper";
import ContentSection from "@/presentation/content/ContentSection";
import EtapasSpiralNavSection from "@/presentation/sections/EtapasSpiralNavSection";
import TransitionAnimation from "@/presentation/video/TransitionAnimation";
import StageChapter from "@/presentation/stage/StageChapter";
import FactoresRectoresSection from "@/presentation/sections/FactoresRectoresSection";
import FinalClosingPanel from "@/presentation/sections/FinalClosingPanel";
import { getCartillaContentUseCase } from "@infra/content/createCartillaContentUseCase";
import { getMediaResolver } from "@infra/media/createMediaResolver";
import { mediaKey } from "@domain/content/value-objects/MediaKey";

/**
 * Raíz "/" de la aplicación: la nueva Cartilla (documento único de scroll
 * continuo). Composition root — única pieza que llama al caso de uso de
 * contenido y al resolver de medios; ningún componente de `presentation/`
 * importa `infrastructure/` directamente (patrón RSC del rework §5.1/§6).
 *
 * La app anterior (/inicio, /etapas/*, /modelo, /opciones) sigue disponible
 * como respaldo, pero ya no es la entrada: '/' es la Cartilla. Pendientes:
 * audios nuevos de LaIA y autodiagnóstico n8n real (hoy CTA estático).
 */
export default function Page() {
  const cartilla = getCartillaContentUseCase().execute();
  const resolver = getMediaResolver();

  const hero = resolver.resolve(mediaKey("ui.introHeroBackground"));
  const logo = resolver.resolve(mediaKey("brand.logoRed"));
  const introTransitionMedia = cartilla.introTransition ? resolver.resolve(cartilla.introTransition.mediaKey) : null;

  const laiaSteps = cartilla.introLaia.map((message) => {
    const avatar = resolver.resolve(message.avatarKey);
    return {
      id: message.id,
      text: message.text,
      avatarUrl: avatar.available ? avatar.url : null,
      avatarFallback: avatar.fallback,
    };
  });

  return (
    <AppShell>
      <IntroPortada
        cover={cartilla.introCover}
        heroBackgroundUrl={hero.available ? hero.url : null}
        logoUrl={logo.available ? logo.url : null}
      />
      <LaiaStepper steps={laiaSteps} />
      {cartilla.introSections.map((section) => (
        <ContentSection key={section.id} section={section} resolver={resolver} />
      ))}
      <EtapasSpiralNavSection stages={cartilla.stages} resolver={resolver} />
      {cartilla.introTransition && introTransitionMedia ? (
        <TransitionAnimation
          url={introTransitionMedia.available ? introTransitionMedia.url : null}
          fallback={introTransitionMedia.fallback}
          captionLabel="Comienza el recorrido:"
          captionStage={`Etapa 1 · ${cartilla.introTransition.nextStageName}`}
        />
      ) : null}

      {[...cartilla.stages]
        .sort((a, b) => a.order - b.order)
        .map((stage) => (
          <StageChapter key={stage.id} stage={stage} resolver={resolver} />
        ))}

      <FactoresRectoresSection factores={cartilla.factoresRectores} />
      <FinalClosingPanel closing={cartilla.finalClosing} resolver={resolver} />
    </AppShell>
  );
}

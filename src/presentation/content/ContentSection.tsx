/**
 * PRESENTATION — Server Component
 *
 * Despacha cada `Block` de una `Section` al componente que lo renderiza.
 * Mismo principio que el `BLOCK_REGISTRY` del motor viejo (`engine/blocks.tsx`),
 * pero Server-first y sin gating: no hay frames, no hay progreso, todo el
 * contenido está visible (el revelado progresivo lo hace `CartillaScroll` vía
 * `[data-reveal]`, no este componente).
 *
 * `resolver` se recibe como prop desde `app/cartilla/page.tsx` (único
 * composition root) y se reenvía a los bloques que necesitan resolver
 * medios — ningún bloque importa `infrastructure/` directamente.
 */
import type { Section } from "@domain/content/Section";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import ParagraphsBlock from "./blocks/ParagraphsBlock";
import BulletsBlock from "./blocks/BulletsBlock";
import ActionCardsBlock from "./blocks/ActionCardsBlock";
import StateCardsBlock from "./blocks/StateCardsBlock";
import CalloutBlock from "./blocks/CalloutBlock";
import InfographicBlock from "./blocks/InfographicBlock";
import NarrativeVideoBlock from "./blocks/NarrativeVideoBlock";
import DownloadBlock from "./blocks/DownloadBlock";
import CarouselBlock from "./blocks/CarouselBlock";
import AutodiagnosticBlock from "./blocks/AutodiagnosticBlock";
import styles from "./ContentSection.module.css";

export default function ContentSection({ section, resolver }: { section: Section; resolver: IMediaResolver }) {
  const titleId = section.title ? `${section.id}-title` : undefined;

  return (
    <section
      id={section.id}
      data-reveal
      className={styles.section}
      aria-labelledby={titleId}
    >
      {section.title ? (
        <h2 id={titleId} className={styles.title}>
          {section.title}
        </h2>
      ) : null}
      <div className={styles.blocks}>
        {section.blocks.map((block, index) => {
          switch (block.type) {
            case "paragraphs":
              return <ParagraphsBlock key={index} block={block} />;
            case "bullets":
              return <BulletsBlock key={index} block={block} />;
            case "action-cards":
              return <ActionCardsBlock key={index} block={block} />;
            case "state-cards":
              return <StateCardsBlock key={index} block={block} />;
            case "callout":
              return <CalloutBlock key={index} block={block} />;
            case "infographic":
              return <InfographicBlock key={index} block={block} resolver={resolver} />;
            case "narrative-video":
              return <NarrativeVideoBlock key={index} block={block} resolver={resolver} />;
            case "download":
              return <DownloadBlock key={index} block={block} resolver={resolver} />;
            case "carousel":
              return <CarouselBlock key={index} block={block} resolver={resolver} />;
            case "autodiagnostic":
              return <AutodiagnosticBlock key={index} block={block} />;
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}

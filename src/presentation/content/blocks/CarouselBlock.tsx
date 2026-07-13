import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import EvidenceCarousel from "@/presentation/content/EvidenceCarousel";
import styles from "../ContentSection.module.css";

export default function CarouselBlock({
  block,
  resolver,
}: {
  block: Extract<Block, { type: "carousel" }>;
  resolver: IMediaResolver;
}) {
  const panels = block.panels.map((panel) => {
    const media = resolver.resolve(panel.mediaKey);
    return {
      id: panel.id,
      label: panel.label,
      description: panel.description,
      imageUrl: media.available ? media.url : null,
      imageAlt: media.description ?? panel.label,
      fallback: media.fallback,
    };
  });

  return (
    <div>
      <div className={styles.blocks}>
        <h3 className={styles.downloadTitle}>{block.title}</h3>
        {block.description ? <p className={styles.paragraph}>{block.description}</p> : null}
      </div>
      <EvidenceCarousel panels={panels} />
    </div>
  );
}

import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "../ContentSection.module.css";

export default function InfographicBlock({
  block,
  resolver,
}: {
  block: Extract<Block, { type: "infographic" }>;
  resolver: IMediaResolver;
}) {
  const media = resolver.resolve(block.mediaKey);

  return (
    <figure className={styles.figure}>
      {media.available && media.url ? (
        // eslint-disable-next-line @next/next/no-img-element -- dimensiones variables por recurso, sin layout fijo
        <img className={styles.figureImage} src={media.url} alt={media.description ?? block.caption} />
      ) : (
        <div className={styles.videoPending}>
          <span className={styles.videoPendingLabel}>{media.fallback}</span>
        </div>
      )}
      <figcaption className={styles.figcaption}>{block.caption}</figcaption>
    </figure>
  );
}

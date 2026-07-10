import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "../ContentSection.module.css";

export default function DownloadBlock({
  block,
  resolver,
}: {
  block: Extract<Block, { type: "download" }>;
  resolver: IMediaResolver;
}) {
  const media = resolver.resolve(block.mediaKey);

  return (
    <div className={styles.downloadCard}>
      <div>
        <h3 className={styles.downloadTitle}>{block.title}</h3>
        <p className={styles.downloadDescription}>{block.description}</p>
      </div>
      {media.available && media.url ? (
        <a className={styles.downloadButton} href={media.url} download={media.downloadName}>
          {block.label}
        </a>
      ) : (
        <span className={styles.videoPendingLabel}>{media.fallback}</span>
      )}
    </div>
  );
}

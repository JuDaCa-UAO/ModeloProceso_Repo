import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "../ContentSection.module.css";

/**
 * Video ambiental embebido en el flujo de contenido (autoplay/muted/loop —
 * mismo comportamiento que las transiciones, ver `TRANSITION_PLAYBACK`).
 * Cuando el recurso está `pending` (aún no producido/subido), se muestra el
 * mismo placeholder rayado que usa el diseño para los videos pendientes de
 * la Etapa 5 — nunca un enlace roto.
 */
export default function NarrativeVideoBlock({
  block,
  resolver,
}: {
  block: Extract<Block, { type: "narrative-video" }>;
  resolver: IMediaResolver;
}) {
  const media = resolver.resolve(block.mediaKey);

  if (!media.available || !media.url) {
    return null;
  }

  return (
    <figure className={styles.videoFrame}>
      <video
        className={styles.videoEl}
        src={media.url}
        autoPlay={media.playback?.autoplay}
        muted={media.playback?.muted}
        loop={media.playback?.loop}
        playsInline={media.playback?.playsInline}
        preload="metadata"
        aria-label={block.caption ?? media.description}
      />
    </figure>
  );
}

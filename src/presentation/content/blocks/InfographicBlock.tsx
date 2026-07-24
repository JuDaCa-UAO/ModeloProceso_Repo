import Image from "next/image";
import type { Block } from "@domain/content/Block";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import styles from "../ContentSection.module.css";

/**
 * Infografía inline (`<figure>` + pie). Usa `next/image` para que el
 * optimizador de Next sirva una variante del tamaño real de pantalla en vez
 * del archivo fuente (las infografías fuente llegan a 100+ megapíxeles /
 * varios MB): sin esto el navegador descargaba y decodificaba el original
 * completo — la causa principal de la carga lenta del multimedia.
 * Las dimensiones intrínsecas vienen del manifiesto y reservan el aspect-ratio.
 */
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
        <Image
          className={styles.figureImage}
          src={media.url}
          alt={media.alt ?? media.description ?? block.caption}
          width={media.width ?? 1600}
          height={media.height ?? 1000}
          sizes="(max-width: 820px) 92vw, 800px"
        />
      ) : (
        <div className={styles.videoPending}>
          <span className={styles.videoPendingLabel}>{media.fallback}</span>
        </div>
      )}
      <figcaption className={styles.figcaption}>{block.caption}</figcaption>
    </figure>
  );
}

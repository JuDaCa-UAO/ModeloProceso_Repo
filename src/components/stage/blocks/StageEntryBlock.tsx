"use client";

import Image from "next/image";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import type { BlockContext } from "./BlockContext";

type StageEntryBlockProps = {
  eyebrow?: string;
  copy: string[];
  ctaLabel: string;
  targetId: string;
  characterSrc: string;
  characterAlt?: string;
  ctx: BlockContext;
};

export default function StageEntryBlock({
  eyebrow = "Etapa 1",
  copy,
  ctaLabel,
  targetId,
  characterSrc,
  characterAlt,
  ctx,
}: StageEntryBlockProps) {
  return (
    <section className={styles.entryHero}>
      <div className={styles.entryCopy}>
        <span className={styles.entryEyebrow}>{eyebrow}</span>
        <div className={styles.stageCopy}>
          {copy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.entryActions}>
          <button
            type="button"
            className={stageStyles.buttonPrimary}
            onClick={() => ctx.onScrollTo(targetId)}
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      <div className={styles.entryCharacter}>
        <div className={styles.entryCharacterFrame}>
          <Image
            src={characterSrc}
            alt={characterAlt || "Laia"}
            fill
            className={styles.entryCharacterImg}
            priority
            unoptimized
          />
        </div>
        <p className={styles.entryCharacterNote}>
          Laia abre el recorrido y prepara la transicion hacia la presentacion amplia
          del modelo.
        </p>
      </div>
    </section>
  );
}

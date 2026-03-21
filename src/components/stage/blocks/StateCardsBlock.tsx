"use client";

import styles from "./blocks.module.css";
import type { StateCardItem } from "@/types/stage";

type StateCardsBlockProps = {
  items: StateCardItem[];
  title?: string;
  intro?: string;
  note?: string;
  continueHint?: string;
};

export default function StateCardsBlock({
  items,
  title,
  intro,
  note,
  continueHint,
}: StateCardsBlockProps) {
  return (
    <div className={styles.stateBlock}>
      {title || intro ? (
        <div className={styles.stateIntro}>
          {title ? <h3 className={styles.stateBlockTitle}>{title}</h3> : null}
          {intro ? <p className={styles.stateBlockIntro}>{intro}</p> : null}
        </div>
      ) : null}

      {note ? <p className={styles.stateNote}>{note}</p> : null}

      <div className={styles.stateGrid}>
        {items.map((item) => (
          <article key={item.title} className={styles.stateCard}>
            <span className={styles.stateHierarchy}>{item.contextLabel}</span>
            <h3 className={styles.stateTitle}>{item.title}</h3>
            <p className={styles.stateDesc}>{item.description}</p>
            <span className={styles.stateSupportLabel}>Acompanamiento en la cartilla</span>
            <p className={styles.stateHint}>{item.supportHint}</p>
          </article>
        ))}
      </div>

      {continueHint ? <p className={styles.stateContinueHint}>{continueHint}</p> : null}
    </div>
  );
}

"use client";

import styles from "./blocks.module.css";
import type { StateCardItem } from "@/types/stage";

type StateCardsBlockProps = {
  items: StateCardItem[];
};

export default function StateCardsBlock({ items }: StateCardsBlockProps) {
  return (
    <div className={styles.stateGrid}>
      {items.map((item) => (
        <article key={item.title} className={styles.stateCard}>
          <span className={styles.stateHierarchy}>{item.hierarchy}</span>
          <h3 className={styles.stateTitle}>{item.title}</h3>
          <p className={styles.stateDesc}>{item.description}</p>
          <p className={styles.stateHint}>{item.supportHint}</p>
        </article>
      ))}
    </div>
  );
}

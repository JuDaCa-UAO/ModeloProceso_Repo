import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function BulletsBlock({ block }: { block: Extract<Block, { type: "bullets" }> }) {
  if (block.variant === "pills") {
    return (
      <ul className={styles.pillsRow}>
        {block.items.map((item) => (
          <li key={item} className={styles.pill}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.bulletsList}>
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function BulletsBlock({ block }: { block: Extract<Block, { type: "bullets" }> }) {
  const title = block.title ? <h3 className={styles.blockTitle}>{block.title}</h3> : null;

  if (block.variant === "pills") {
    return null;
  }

  return (
    <div>
      {title}
      <ul className={styles.bulletsList}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

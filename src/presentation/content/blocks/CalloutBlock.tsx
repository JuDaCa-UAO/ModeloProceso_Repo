import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function CalloutBlock({ block }: { block: Extract<Block, { type: "callout" }> }) {
  return (
    <div className={styles.callout}>
      {block.title ? <span className={styles.calloutBadge}>{block.title}</span> : null}
      <p className={styles.calloutBody}>{block.body}</p>
    </div>
  );
}

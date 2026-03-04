"use client";

import styles from "./blocks.module.css";

type ParagraphsBlockProps = { paragraphs: string[] };

export default function ParagraphsBlock({ paragraphs }: ParagraphsBlockProps) {
  return (
    <div className={styles.stageCopy}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

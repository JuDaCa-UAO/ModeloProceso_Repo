import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function ParagraphsBlock({ block }: { block: Extract<Block, { type: "paragraphs" }> }) {
  return (
    <>
      {block.paragraphs.map((text, index) => (
        <p key={index} className={styles.paragraph}>
          {text}
        </p>
      ))}
    </>
  );
}

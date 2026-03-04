"use client";

import styles from "./blocks.module.css";

type BulletsBlockProps = {
  title?: string;
  items: string[];
};

export default function BulletsBlock({ title, items }: BulletsBlockProps) {
  return (
    <div className={styles.bulletBlock}>
      {title ? <h3 className={styles.bulletTitle}>{title}</h3> : null}
      <ul className={styles.bulletList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

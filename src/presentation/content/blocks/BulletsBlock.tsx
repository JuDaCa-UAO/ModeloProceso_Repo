"use client";

import { useState } from "react";
import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function BulletsBlock({ block }: { block: Extract<Block, { type: "bullets" }> }) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const title = block.title ? <h3 className={styles.blockTitle}>{block.title}</h3> : null;

  if (block.variant === "pills") {
    return null;
  }

  if (block.variant === "ordered") {
    return (
      <div>
        {title}
        <ol className={styles.bulletsList}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    );
  }

  // Regex to check if all items follow "Concepto — Explicación"
  const isConceptList = block.variant === "list" && block.items.every((item) => /\s+[\u2014\u2013-]\s+/.test(item));

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isConceptList) {
    return (
      <div>
        {title}
        <div className={styles.conceptGrid} style={{ marginTop: block.title ? "16px" : "0px" }}>
          {block.items.map((item, index) => {
            const parts = item.split(/\s+[\u2014\u2013-]\s+/);
            const concept = parts[0];
            const description = parts.slice(1).join(" — ");
            const isExpanded = !!expandedItems[index];

            return (
              <div
                key={index}
                className={`${styles.conceptCard} ${isExpanded ? styles.conceptCardExpanded : ""}`}
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className={styles.conceptHeader}>
                  <h4 className={styles.conceptTitle}>{concept}</h4>
                  <span className={styles.conceptChevron} aria-hidden>
                    ▼
                  </span>
                </div>
                <div className={`${styles.conceptDescriptionContainer} ${isExpanded ? styles.show : ""}`}>
                  <p className={styles.conceptDescription}>{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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

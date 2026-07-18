"use client";

import { useState } from "react";
import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

const IS_STEP_NUMBER = /^\d$/;

export default function ActionCardsBlock({ block }: { block: Extract<Block, { type: "action-cards" }> }) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (title: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div>
      {block.title ? <h3 className={styles.blockTitle}>{block.title}</h3> : null}
      {block.description ? <p className={styles.paragraph}>{block.description}</p> : null}
      <div className={styles.cardsGrid} style={{ marginTop: block.title || block.description ? "16px" : "0px" }}>
        {block.cards.map((card) => {
          const isExpanded = !!expandedCards[card.title];
          return (
            <div
              key={card.title}
              className={`${styles.card} ${styles.interactiveCard} ${isExpanded ? styles.cardExpanded : ""}`}
              onClick={() => toggleCard(card.title)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleCard(card.title);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
            >
              <div className={styles.cardHeader}>
                {card.icon ? (
                  <div
                    className={IS_STEP_NUMBER.test(card.icon) ? `${styles.cardIcon} ${styles.cardIconBadge}` : styles.cardIcon}
                    aria-hidden
                  >
                    {card.icon}
                  </div>
                ) : null}
                <div className={styles.cardTitleContainer}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <span className={styles.expandChevron} aria-hidden>
                    ▼
                  </span>
                </div>
              </div>
              <div className={`${styles.cardDescriptionContainer} ${isExpanded ? styles.show : ""}`}>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

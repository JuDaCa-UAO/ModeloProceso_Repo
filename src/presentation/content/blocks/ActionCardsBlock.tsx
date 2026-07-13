import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

const IS_STEP_NUMBER = /^\d$/;

export default function ActionCardsBlock({ block }: { block: Extract<Block, { type: "action-cards" }> }) {
  return (
    <div className={styles.cardsGrid}>
      {block.cards.map((card) => (
        <div key={card.title} className={styles.card}>
          {card.icon ? (
            <div
              className={IS_STEP_NUMBER.test(card.icon) ? `${styles.cardIcon} ${styles.cardIconBadge}` : styles.cardIcon}
              aria-hidden
            >
              {card.icon}
            </div>
          ) : null}
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDescription}>{card.description}</p>
        </div>
      ))}
    </div>
  );
}

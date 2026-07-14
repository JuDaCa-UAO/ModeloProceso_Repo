import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

const IS_STEP_NUMBER = /^\d$/;

export default function ActionCardsBlock({ block }: { block: Extract<Block, { type: "action-cards" }> }) {
  return (
    <div>
      {block.title ? <h3 className={styles.blockTitle}>{block.title}</h3> : null}
      {block.description ? <p className={styles.paragraph}>{block.description}</p> : null}
      <div className={styles.cardsGrid} style={{ marginTop: block.title || block.description ? "16px" : "0px" }}>
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
    </div>
  );
}

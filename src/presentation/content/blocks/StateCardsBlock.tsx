import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

const HIERARCHY_LABEL: Record<string, string> = {
  Inicial: "ESTADO INICIAL",
  Intermedio: "ESTADO INTERMEDIO",
  Avanzado: "ESTADO AVANZADO",
};

const HIERARCHY_ACCENT: Record<string, string> = {
  Inicial: "var(--uao-color-coral)",
  Intermedio: "var(--uao-color-burgundy)",
  Avanzado: "var(--uao-color-red-primary)",
};

export default function StateCardsBlock({ block }: { block: Extract<Block, { type: "state-cards" }> }) {
  return (
    <div className={styles.stateGrid}>
      {block.items.map((item) => (
        <div
          key={item.hierarchy}
          className={styles.stateCard}
          style={{ "--state-accent": HIERARCHY_ACCENT[item.hierarchy] } as React.CSSProperties}
        >
          <span className={styles.stateLabel}>{HIERARCHY_LABEL[item.hierarchy]}</span>
          <h3 className={styles.stateTitle}>{item.title}</h3>
          <p className={styles.stateDescription}>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

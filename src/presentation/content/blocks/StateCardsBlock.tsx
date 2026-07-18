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
  const isRows = block.layout === "rows";

  return (
    <div>
      {block.title ? <h3 className={styles.blockTitle}>{block.title}</h3> : null}
      {block.description ? <p className={styles.paragraph}>{block.description}</p> : null}
      <div className={isRows ? styles.stateRows : styles.stateGrid} style={{ marginTop: block.title || block.description ? "16px" : "0px" }}>
        {block.items.map((item) => (
          <div
            key={item.hierarchy}
            className={isRows ? styles.stateRow : styles.stateCard}
            style={{ "--state-accent": HIERARCHY_ACCENT[item.hierarchy] } as React.CSSProperties}
          >
            {isRows ? (
              <>
                <div className={styles.stateRowHeader}>
                  <h3 className={styles.stateRowTitle}>{item.title}</h3>
                </div>
                <p className={styles.stateDescription} style={{ margin: 0 }}>
                  {item.description}
                </p>
              </>
            ) : (
              <>
                <h3 className={styles.stateTitle}>{item.title}</h3>
                <p className={styles.stateDescription}>{item.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

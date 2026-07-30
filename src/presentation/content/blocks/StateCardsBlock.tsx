import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

/** Color decorativo de la tarjeta (borde superior o lateral). */
const HIERARCHY_ACCENT: Record<string, string> = {
  Inicial: "var(--uao-color-coral)",
  Intermedio: "var(--uao-color-burgundy)",
  Avanzado: "var(--uao-color-red-primary)",
};

/**
 * Color del texto de la tarjeta (rótulo y título). Va aparte del decorativo
 * porque el coral y el rojo institucional no alcanzan 4.5:1 sobre blanco;
 * el burgundy sí (7.37:1) y por eso se conserva igual.
 */
const HIERARCHY_INK: Record<string, string> = {
  Inicial: "var(--uao-color-coral-ink)",
  Intermedio: "var(--uao-color-burgundy)",
  Avanzado: "var(--uao-color-red-ink)",
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
            style={
              {
                "--state-accent": HIERARCHY_ACCENT[item.hierarchy],
                "--state-ink": HIERARCHY_INK[item.hierarchy],
              } as React.CSSProperties
            }
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

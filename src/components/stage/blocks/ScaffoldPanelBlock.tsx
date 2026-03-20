"use client";

import type { ScaffoldActionItem } from "@/types/stage";
import styles from "./blocks.module.css";

type ScaffoldPanelBlockProps = {
  label?: string;
  body: string;
  items?: string[];
  actions?: ScaffoldActionItem[];
  tone?: "neutral" | "accent";
};

export default function ScaffoldPanelBlock({
  label,
  body,
  items = [],
  actions = [],
  tone = "neutral",
}: ScaffoldPanelBlockProps) {
  return (
    <section
      className={`${styles.scaffoldPanel} ${
        tone === "accent" ? styles.scaffoldPanelAccent : ""
      }`.trim()}
    >
      {label ? <span className={styles.scaffoldLabel}>{label}</span> : null}

      <p className={styles.scaffoldBody}>{body}</p>

      {items.length ? (
        <ul className={styles.scaffoldList}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {actions.length ? (
        <div className={styles.scaffoldActionGrid}>
          {actions.map((action) => (
            <article key={action.label} className={styles.scaffoldActionCard}>
              <div className={styles.scaffoldActionHead}>
                <strong className={styles.scaffoldActionLabel}>{action.label}</strong>
                <span
                  className={`${styles.scaffoldActionState} ${
                    action.state === "ready"
                      ? styles.scaffoldActionStateReady
                      : action.state === "locked"
                      ? styles.scaffoldActionStateLocked
                      : styles.scaffoldActionStateFuture
                  }`.trim()}
                >
                  {action.state === "ready"
                    ? "Listo"
                    : action.state === "locked"
                    ? "Pendiente"
                    : "Futuro"}
                </span>
              </div>

              {action.detail ? (
                <p className={styles.scaffoldActionDetail}>{action.detail}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

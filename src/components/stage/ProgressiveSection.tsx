"use client";

import type { ReactNode } from "react";
import styles from "./stage.module.css";

type ProgressiveSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  active: boolean;
  revealed: boolean;
  registerRef: (id: string, node: HTMLElement | null) => void;
  indexLabel?: string;
  surface?: "card" | "plain";
  flowCue?: {
    tone: "continue" | "blocked" | "complete";
    text: string;
  };
};

export default function ProgressiveSection({
  id,
  title,
  subtitle,
  children,
  active,
  revealed,
  registerRef,
  indexLabel,
  surface = "plain",
  flowCue,
}: ProgressiveSectionProps) {
  return (
    <section
      id={id}
      ref={(node) => registerRef(id, node)}
      className={`${styles.section} ${active ? styles.sectionActive : ""} ${
        revealed ? styles.sectionRevealed : styles.sectionMuted
      }`}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionLabelRow}>
          {indexLabel ? <span className={styles.sectionLabel}>{indexLabel}</span> : null}
          <span className={styles.sectionState}>
            {active ? "En foco" : revealed ? "Recorrido" : "Disponible en el recorrido"}
          </span>
        </div>

        <div className={surface === "card" ? styles.surfaceCard : styles.surfacePlain}>
          <header className={styles.header}>
            <h2 id={`${id}-title`} className={styles.title}>
              {title}
            </h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>
          <div className={styles.body}>{children}</div>
          {flowCue ? (
            <div
              className={`${styles.sectionFlowCue} ${
                flowCue.tone === "blocked"
                  ? styles.sectionFlowCueBlocked
                  : flowCue.tone === "complete"
                    ? styles.sectionFlowCueComplete
                    : styles.sectionFlowCueContinue
              }`}
              role="status"
              aria-live="polite"
            >
              <span className={styles.sectionFlowCueDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className={styles.sectionFlowCueText}>{flowCue.text}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

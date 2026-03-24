"use client";

import styles from "./stage.module.css";

type SectionScrollProgressProps = {
  orderedIds: string[];
  activeId: string;
  continuedIds: Set<string>;
};

/**
 * Indicador fijo: sección en foco y progreso del recorrido.
 */
export function SectionScrollProgress({
  orderedIds,
  activeId,
  continuedIds,
}: SectionScrollProgressProps) {
  if (orderedIds.length === 0) return null;

  const activePos = Math.max(1, orderedIds.indexOf(activeId) + 1);
  const doneCount = orderedIds.filter((id) => continuedIds.has(id)).length;
  const progress = orderedIds.length > 0 ? (doneCount / orderedIds.length) * 100 : 0;

  return (
    <div className={styles.scrollProgress} role="navigation" aria-label="Progreso del recorrido">
      <div className={styles.scrollProgressTop}>
        <span className={styles.scrollProgressEyebrow}>Recorrido</span>
        <span className={styles.scrollProgressCount}>
          Sección {activePos} de {orderedIds.length}
        </span>
      </div>
      <div className={styles.scrollProgressTrack} aria-hidden>
        <div className={styles.scrollProgressFill} style={{ width: `${progress}%` }} />
      </div>
      <ul className={styles.scrollProgressDots} aria-hidden>
        {orderedIds.map((id) => {
          const done = continuedIds.has(id);
          const active = id === activeId;
          return (
            <li key={id}>
              <span
                className={`${styles.scrollDot} ${done ? styles.scrollDot_done : ""} ${
                  active ? styles.scrollDot_active : ""
                }`.trim()}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type SectionContinueDockProps = {
  visible: boolean;
  sectionTitle: string;
  continueDisabled: boolean;
  onContinue: () => void;
};

/**
 * Botón Continuar fijo en la parte inferior.
 */
export function SectionContinueDock({
  visible,
  sectionTitle,
  continueDisabled,
  onContinue,
}: SectionContinueDockProps) {
  if (!visible) return null;

  return (
    <div className={styles.scrollContinueDock} role="region" aria-label="Continuar recorrido">
      <div className={styles.scrollContinueInner}>
        <div className={styles.scrollContinueRow}>
          <span className={styles.scrollContinueSectionLabel}>{sectionTitle}</span>
          <button
            type="button"
            className={styles.scrollContinueButton}
            disabled={continueDisabled}
            onClick={onContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

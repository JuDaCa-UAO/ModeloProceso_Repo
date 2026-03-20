"use client";

import { useProgress } from "@/lib/useProgress";
import styles from "./blocks.module.css";

type StageHeaderBlockProps = {
  title: string;
  subtitle: string;
  stageChip?: string;
  continuityLabel?: string;
  currentStageLabel?: string;
};

export default function StageHeaderBlock({
  title,
  subtitle,
  stageChip = "Etapa activa",
  continuityLabel = "Continuidad separada del viewer",
  currentStageLabel = "Etapa 1 activa",
}: StageHeaderBlockProps) {
  const { progress } = useProgress();

  return (
    <section className={styles.stageHeaderCard}>
      <div className={styles.stageHeaderTop}>
        <span className={styles.stageHeaderChip}>{stageChip}</span>
        <span className={styles.stageHeaderContinuity}>{continuityLabel}</span>
      </div>

      <div className={styles.stageHeaderMain}>
        <h3 className={styles.stageHeaderTitle}>{title}</h3>
        <p className={styles.stageHeaderSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.stageHeaderMeta}>
        <div className={styles.stageHeaderMetaRow}>
          <span className={styles.stageHeaderMetaKey}>Stage actual</span>
          <span className={styles.stageHeaderMetaValue}>{currentStageLabel}</span>
        </div>
        <div className={styles.stageHeaderMetaRow}>
          <span className={styles.stageHeaderMetaKey}>Ultimo punto guardado</span>
          <span className={styles.stageHeaderMetaValue}>
            {progress.lastSectionId || "entrada-etapa-1"}
          </span>
        </div>
      </div>
    </section>
  );
}

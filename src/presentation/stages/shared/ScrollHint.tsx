"use client";

import styles from "../stageClient.module.css";

export default function ScrollHint({ label, guideId }: { label?: string; guideId?: string }) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const frame = (e.currentTarget as HTMLElement).closest("section");
    const next = frame?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <button
      type="button"
      className={styles.scrollHint}
      onClick={handleClick}
      data-guide-id={guideId}
      aria-label="Ir al siguiente paso"
    >
      <span className={styles.scrollArrow} aria-hidden>
        ▼
      </span>
    </button>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import styles from "./stage.module.css";

type StageShellProps = {
  children: ReactNode;
  viewerTitle: string;
  viewerStatusLabel: string;
  viewerStatusTone?: "active" | "done";
  /** Recorrido (sección N de M): debajo del mini visor; si el panel está cerrado, se muestra arriba del contenido. */
  scrollProgress?: ReactNode;
  viewerEnabled?: boolean;
};

export default function StageShell({
  children,
  viewerTitle,
  viewerStatusLabel,
  viewerStatusTone = "active",
  scrollProgress,
  viewerEnabled = true,
}: StageShellProps) {
  const [dockOpen, setDockOpen] = useState(true);
  const dockVisible = viewerEnabled && dockOpen;
  const contentUsesFullWidth = !viewerEnabled || !dockOpen;
  /** Solo sin visor global: el dock cerrado no debe usar mainNoViewer (evita saltos de padding en móvil). */
  const mainPaddingClass = !viewerEnabled ? styles.mainNoViewer : "";
  const contentColumnClass = contentUsesFullWidth
    ? styles.contentColumnNoViewer
    : "";

  const showScrollProgressInMain =
    Boolean(scrollProgress) && (!viewerEnabled || !dockVisible);

  return (
    <div className={styles.stageRoot}>
      <TechTrailBackground className={styles.techBackground} />

      {dockVisible ? (
        <aside className={styles.viewerDock} aria-label="Visor del modelo 3D">
          <div className={styles.viewerHeader}>
            <div className={styles.viewerHeaderTop}>
              <div className={styles.viewerHeaderTitles}>
                <p className={styles.viewerEyebrow}>Modelo espiral GenAI</p>
                <h2 className={styles.viewerTitle}>{viewerTitle}</h2>
              </div>
              <button
                type="button"
                className={styles.viewerClose}
                onClick={() => setDockOpen(false)}
                aria-label="Ocultar visor del modelo"
                title="Ocultar panel del modelo 3D"
              >
                <span className={styles.viewerCloseIcon} aria-hidden>
                  ×
                </span>
                <span className={styles.viewerCloseLabel}>Ocultar</span>
              </button>
            </div>
            <div className={styles.viewerStatusRow}>
              <span
                className={`${styles.viewerStatus} ${
                  viewerStatusTone === "done"
                    ? styles.viewerStatus_done
                    : styles.viewerStatus_active
                }`}
              >
                {viewerStatusLabel}
              </span>
            </div>
          </div>

          <div className={styles.viewerCanvasWrap}>
            <MiniSpiralViewer />
          </div>

          {scrollProgress ? (
            <div className={styles.viewerRecorrido}>{scrollProgress}</div>
          ) : null}
        </aside>
      ) : null}

      {viewerEnabled && !dockOpen ? (
        <button
          type="button"
          className={styles.viewerReopenFab}
          onClick={() => setDockOpen(true)}
          aria-label="Mostrar de nuevo el visor del modelo 3D"
          title="Volver a mostrar el modelo 3D"
        >
          Mostrar modelo
        </button>
      ) : null}

      <main className={`${styles.main} ${mainPaddingClass}`.trim()}>
        <div className={`${styles.contentColumn} ${contentColumnClass}`.trim()}>
          {showScrollProgressInMain ? (
            <div className={styles.scrollProgressMainFallback}>{scrollProgress}</div>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}

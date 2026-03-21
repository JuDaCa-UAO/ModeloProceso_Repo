"use client";

import { useState, type ReactNode } from "react";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import styles from "./stage.module.css";

type StageNavItem = {
  id: string;
  name: string;
  href: string;
  available: boolean;
};

type StageShellProps = {
  children: ReactNode;
  viewerTitle: string;
  viewerStatusLabel: string;
  viewerStatusTone?: "active" | "done";
  viewerMeta?: Array<{ label: string; value: string }>;
  viewerStageMarkers?: Array<{
    label: string;
    tone: "current" | "done" | "next" | "upcoming";
  }>;
  viewerEnabled?: boolean;
  shellTone?: "default" | "transition";
  backgroundImageSrc?: string;
  backgroundImageOpacity?: number;
  globalStageButtonVisible?: boolean;
  globalStageItems?: StageNavItem[];
  currentStageId?: string;
  onGlobalStageNavigate?: (href: string) => void;
};

export default function StageShell({
  children,
  viewerTitle,
  viewerStatusLabel,
  viewerStatusTone = "active",
  viewerMeta = [],
  viewerStageMarkers = [],
  viewerEnabled = true,
  shellTone = "default",
  backgroundImageSrc,
  backgroundImageOpacity,
  globalStageButtonVisible = false,
  globalStageItems = [],
  currentStageId,
  onGlobalStageNavigate,
}: StageShellProps) {
  const [stagePanelOpen, setStagePanelOpen] = useState(false);

  const handleNavigate = (href: string) => {
    onGlobalStageNavigate?.(href);
    setStagePanelOpen(false);
  };

  return (
    <div
      className={`${styles.stageRoot} ${
        shellTone === "transition" ? styles.stageRootTransition : ""
      }`.trim()}
    >
      <TechTrailBackground
        className={styles.techBackground}
        backgroundImageSrc={backgroundImageSrc}
        backgroundImageOpacity={backgroundImageOpacity}
      />

      {globalStageButtonVisible ? (
        <>
          <button
            type="button"
            className={styles.stageHubButton}
            onClick={() => setStagePanelOpen((current) => !current)}
            aria-expanded={stagePanelOpen}
            aria-controls="stage-hub-panel"
          >
            Ir a etapas
          </button>

          {stagePanelOpen ? (
            <div className={styles.stageHubOverlay} onClick={() => setStagePanelOpen(false)}>
              <aside
                id="stage-hub-panel"
                className={styles.stageHubPanel}
                aria-label="Navegacion global de etapas"
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.stageHubHeader}>
                  <div>
                    <p className={styles.stageHubEyebrow}>Navegacion global</p>
                    <h2 className={styles.stageHubTitle}>Etapas del recorrido</h2>
                  </div>
                  <button
                    type="button"
                    className={styles.stageHubClose}
                    onClick={() => setStagePanelOpen(false)}
                  >
                    Cerrar
                  </button>
                </div>

                <div className={styles.stageHubGrid}>
                  {globalStageItems.map((item) => {
                    const isCurrent = item.id === currentStageId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.stageHubCard} ${
                          isCurrent ? styles.stageHubCardCurrent : ""
                        }`.trim()}
                        disabled={!item.available || isCurrent}
                        onClick={() => handleNavigate(item.href)}
                      >
                        <span className={styles.stageHubCardTag}>
                          {isCurrent
                            ? "Actual"
                            : item.available
                            ? "Disponible"
                            : "Pendiente"}
                        </span>
                        <strong className={styles.stageHubCardTitle}>{item.name}</strong>
                        <span className={styles.stageHubCardCopy}>
                          {item.available
                            ? "Abrir etapa"
                            : "La navegacion global ya esta desbloqueada, pero esta etapa aun no esta publicada."}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          ) : null}
        </>
      ) : null}

      {viewerEnabled ? (
        <aside className={styles.viewerDock} aria-label="Visor del modelo 3D">
          <div className={styles.viewerHeader}>
            <div>
              <p className={styles.viewerEyebrow}>Modelo espiral GenAI</p>
              <h2 className={styles.viewerTitle}>{viewerTitle}</h2>
            </div>
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

          <div className={styles.viewerCanvasWrap}>
            <MiniSpiralViewer />
          </div>

          {viewerStageMarkers.length ? (
            <div className={styles.viewerStageMarkers}>
              {viewerStageMarkers.map((marker) => (
                <span
                  key={marker.label}
                  className={`${styles.viewerStageMarker} ${
                    marker.tone === "done"
                      ? styles.viewerStageMarkerDone
                      : marker.tone === "next"
                        ? styles.viewerStageMarkerNext
                        : marker.tone === "current"
                          ? styles.viewerStageMarkerCurrent
                          : styles.viewerStageMarkerUpcoming
                  }`}
                >
                  {marker.label}
                </span>
              ))}
            </div>
          ) : null}

          <div className={styles.viewerMeta}>
            {viewerMeta.map((row) => (
              <div key={row.label} className={styles.viewerMetaRow}>
                <span className={styles.viewerMetaKey}>{row.label}</span>
                <span className={styles.viewerMetaValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </aside>
      ) : null}

      <main className={`${styles.main} ${!viewerEnabled ? styles.mainNoViewer : ""}`.trim()}>
        <div
          className={`${styles.contentColumn} ${!viewerEnabled ? styles.contentColumnNoViewer : ""}`.trim()}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

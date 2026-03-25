"use client";

import type { RailPanel } from "@/types/stage";
import styles from "./stage.module.css";

type HorizontalScrollRailProps = {
  panels: RailPanel[];
};

/**
 * Rail horizontal de paneles. Ahora usa overflow-x nativo en vez de scroll-pin.
 */
export default function HorizontalScrollRail({ panels }: HorizontalScrollRailProps) {
  return (
    <div className={styles.railPinArea}>
      <div className={styles.railSticky}>
        <div className={styles.railHead}>
          <span className={styles.railLabel}>Resumen del modelo</span>
          <h3 className={styles.railTitle}>Recorrido de las 6 etapas</h3>
        </div>

        <div className={styles.railViewport} style={{ overflowX: "auto" }}>
          <div className={styles.railTrack}>
            {panels.map((panel, index) => (
              <article
                key={panel.id}
                className={`${styles.railPanel} ${
                  panel.kind === "intro" ? styles.railPanelIntro : ""
                }`}
              >
                <div className={styles.railPanelInner}>
                  <span className={styles.railPanelTag}>
                    {panel.label ?? (panel.kind === "intro" ? "Introducción" : `Etapa ${index}`)}
                  </span>
                  <h4 className={styles.railPanelTitle}>{panel.title}</h4>
                  <p className={styles.railPanelCopy}>{panel.lines[0]}</p>
                  <p className={styles.railPanelCopy}>{panel.lines[1]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

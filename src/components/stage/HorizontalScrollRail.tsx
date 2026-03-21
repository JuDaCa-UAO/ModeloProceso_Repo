"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useScrollPin } from "@/hooks/ui/useScrollPin";
import type { RailPanel } from "@/types/stage";
import styles from "./stage.module.css";

type HorizontalScrollRailProps = {
  panels: RailPanel[];
};

export default function HorizontalScrollRail({ panels }: HorizontalScrollRailProps) {
  const pinAreaRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxOffset, setMaxOffset] = useState(0);
  const { progress } = useScrollPin(pinAreaRef);

  useEffect(() => {
    let rafId = 0;
    const measure = () => {
      rafId = 0;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measure);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;

    schedule();
    window.addEventListener("resize", schedule, { passive: true });

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (resizeObserver && viewport && track) {
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [panels.length]);

  const style = useMemo(
    () =>
      ({
        "--rail-height-multiplier": Math.max(3.4, 2.5 + panels.length * 0.42),
      }) as CSSProperties,
    [panels.length]
  );

  return (
    <div ref={pinAreaRef} className={styles.railPinArea} style={style}>
      <div className={styles.railSticky}>
        <div className={styles.railHead}>
          <span className={styles.railLabel}>Resumen del modelo</span>
          <h3 className={styles.railTitle}>Recorrido de las 6 etapas</h3>
          <p className={styles.railHint}>
            Primero entiendes tu punto de entrada. Luego, el scroll vertical mueve este mapa
            breve de las seis etapas.
          </p>
        </div>

        <div ref={viewportRef} className={styles.railViewport}>
          <div
            ref={trackRef}
            className={styles.railTrack}
            style={{ transform: `translate3d(${-maxOffset * progress}px,0,0)` }}
          >
            {panels.map((panel, index) => (
              <article
                key={panel.id}
                className={`${styles.railPanel} ${
                  panel.kind === "intro" ? styles.railPanelIntro : ""
                } ${panel.status === "current" ? styles.railPanelCurrent : ""} ${
                  panel.status === "completed" ? styles.railPanelCompleted : ""
                }`}
              >
                <div className={styles.railPanelInner}>
                  <div className={styles.railPanelHeader}>
                    <span className={styles.railPanelTag}>
                      {panel.label ?? (panel.kind === "intro" ? "Introduccion" : `Etapa ${index + 1}`)}
                    </span>
                    {panel.status ? (
                      <span
                        className={`${styles.railPanelStatus} ${
                          panel.status === "current"
                            ? styles.railPanelStatusCurrent
                            : panel.status === "completed"
                              ? styles.railPanelStatusCompleted
                              : styles.railPanelStatusUpcoming
                        }`}
                      >
                        {panel.status === "current"
                          ? "Actual"
                          : panel.status === "completed"
                            ? "Completada"
                            : "Siguiente"}
                      </span>
                    ) : null}
                  </div>
                  <h4 className={styles.railPanelTitle}>{panel.title}</h4>
                  <p className={styles.railPanelCopy}>{panel.lines[0]}</p>
                  <p className={styles.railPanelCopy}>{panel.lines[1]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.railProgressTrack} aria-hidden="true">
          <div className={styles.railProgressFill} style={{ width: `${progress * 100}%` }} />
        </div>

        <div className={styles.railFooter}>
          <div className={styles.railScrollCue} aria-hidden="true">
            <span className={styles.railCueDot} />
            <span className={styles.railCueDot} />
            <span className={styles.railCueDot} />
          </div>
          <p className={styles.railFooterText}>
            Continua bajando para seguir con la Etapa 1 y llegar despues al bloque de estados.
          </p>
        </div>
      </div>
    </div>
  );
}

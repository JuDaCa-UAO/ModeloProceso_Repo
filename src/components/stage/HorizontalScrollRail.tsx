"use client";

import { useEffect, useRef } from "react";
import type { RailPanel } from "@/types/stage";
import styles from "./stage.module.css";

type HorizontalScrollRailProps = {
  panels: RailPanel[];
};

/**
 * Rail horizontal de etapas.
 *
 * - Desplazamiento horizontal mediante rueda del ratón (wheel → scrollLeft).
 *   En los extremos izquierdo/derecho el scroll pasa al scroll de página.
 * - Las tarjetas muestran badge (label), título, descripción y botones de vídeo.
 * - Los botones de vídeo están deshabilitados hasta que se suban los recursos.
 */
export default function HorizontalScrollRail({ panels }: HorizontalScrollRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Convierte scroll vertical de rueda en scroll horizontal.
  // Listener nativo con passive:false para poder llamar preventDefault.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      const atLeft = vp.scrollLeft <= 0;
      const atRight = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1;
      // En los extremos dejamos que el scroll pase a la página
      if ((e.deltaY < 0 && atLeft) || (e.deltaY > 0 && atRight)) return;
      e.preventDefault();
      vp.scrollLeft += e.deltaY + e.deltaX;
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={viewportRef} className={styles.railViewportV2}>
      <div className={styles.railTrackV2}>
        {panels.map((panel) => (
          <article key={panel.id} className={styles.railCardV2}>
            <div className={styles.railCardInner}>
              {panel.label ? (
                <span className={styles.railCardBadge}>{panel.label}</span>
              ) : null}
              <h4 className={styles.railCardTitle}>{panel.title}</h4>
              {panel.lines[0] ? (
                <p className={styles.railCardDesc}>{panel.lines[0]}</p>
              ) : null}
            </div>
            <div className={styles.railCardFooter}>
              <button
                type="button"
                className={styles.railCardBtnText}
                disabled
                title="Vídeo próximamente"
              >
                Reproducir vídeo
              </button>
              <button
                type="button"
                className={styles.railCardBtnPlay}
                disabled
                aria-label={`Reproducir vídeo de ${panel.label ?? panel.title}`}
                title="Próximamente"
              >
                &#9654;
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import YouTubeNarrativePlayer from "@/components/youtube-narrative-player/YouTubeNarrativePlayer";
import { VIDEO_REGISTRY } from "@/content/shared/video-registry";
import type { RailPanel } from "@/types/stage";
import styles from "./stage.module.css";

type HorizontalScrollRailProps = {
  panels: RailPanel[];
};

/**
 * Rail horizontal de etapas.
 *
 * - Desplazamiento horizontal mediante rueda del raton (wheel -> scrollLeft).
 *   En los extremos izquierdo/derecho el scroll pasa al scroll de pagina.
 * - Las tarjetas muestran badge (label), titulo, descripcion y botones de video.
 * - Los botones de video solo se habilitan si la tarjeta tiene una referencia
 *   real en el registro centralizado de videos.
 */
export default function HorizontalScrollRail({ panels }: HorizontalScrollRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState<RailPanel | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [playerInstanceKey, setPlayerInstanceKey] = useState(0);

  const preloadedVideoKey = panels.find((panel) => panel.videoKey)?.videoKey;
  const preloadedVideo = preloadedVideoKey ? VIDEO_REGISTRY[preloadedVideoKey] : null;
  const activeVideo = activePanel?.videoKey ? VIDEO_REGISTRY[activePanel.videoKey] : null;

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (event: WheelEvent) => {
      const atLeft = vp.scrollLeft <= 0;
      const atRight = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1;
      if ((event.deltaY < 0 && atLeft) || (event.deltaY > 0 && atRight)) return;
      event.preventDefault();
      vp.scrollLeft += event.deltaY + event.deltaX;
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!activePanel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
        setVideoEnded(false);
      }
    };

    const focusTimer = window.setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activePanel]);

  const closeOverlay = () => {
    setActivePanel(null);
    setVideoEnded(false);
  };

  const openVideo = (panel: RailPanel) => {
    if (!panel.videoKey) return;
    setActivePanel(panel);
    setVideoEnded(false);
    setPlayerInstanceKey((current) => current + 1);
  };

  const replayVideo = () => {
    setVideoEnded(false);
    setPlayerInstanceKey((current) => current + 1);
  };

  return (
    <>
      <div ref={viewportRef} className={styles.railViewportV2}>
        <div className={styles.railTrackV2}>
          {panels.map((panel) => {
            const hasVideo = Boolean(panel.videoKey);
            const title = hasVideo
              ? `Reproducir video de ${panel.label ?? panel.title}`
              : "Video no disponible";

            return (
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
                    disabled={!hasVideo}
                    title={title}
                    onClick={() => openVideo(panel)}
                  >
                    Reproducir video
                  </button>
                  <button
                    type="button"
                    className={styles.railCardBtnPlay}
                    disabled={!hasVideo}
                    aria-label={`Reproducir video de ${panel.label ?? panel.title}`}
                    title={title}
                    onClick={() => openVideo(panel)}
                  >
                    &#9654;
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {preloadedVideo ? (
        <div className={styles.railVideoPreload} aria-hidden="true">
          <YouTubeNarrativePlayer
            videoId={preloadedVideo.videoId}
            startSeconds={preloadedVideo.startSeconds}
            autoplay={false}
            className={styles.railVideoPreloadPlayer}
          />
        </div>
      ) : null}

      {activePanel && activeVideo && typeof document !== "undefined"
        ? createPortal(
            <div
              className={styles.railVideoOverlay}
              role="presentation"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  closeOverlay();
                }
              }}
            >
              <div className={styles.railVideoBackdrop} aria-hidden="true" />
              <section
                ref={modalRef}
                className={styles.railVideoModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="rail-video-title"
                tabIndex={-1}
              >
                <div className={styles.railVideoHeader}>
                  <div className={styles.railVideoHeaderCopy}>
                    <p className={styles.railVideoEyebrow}>
                      {activePanel.label ?? "Recorrido del modelo"}
                    </p>
                    <h3 id="rail-video-title" className={styles.railVideoTitle}>
                      {activePanel.title}
                    </h3>
                  </div>
                </div>

                <div className={styles.railVideoPlayerShell}>
                  <YouTubeNarrativePlayer
                    key={`${activePanel.id}-${playerInstanceKey}`}
                    videoId={activeVideo.videoId}
                    startSeconds={activeVideo.startSeconds}
                    autoplay
                    onEnded={() => setVideoEnded(true)}
                    className={styles.railVideoPlayer}
                  />
                </div>

                <div className={styles.railVideoFooter}>
                  {videoEnded ? (
                    <div className={styles.railVideoActions}>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        onClick={closeOverlay}
                      >
                        Cerrar
                      </button>
                      <button
                        type="button"
                        className={styles.buttonPrimary}
                        onClick={replayVideo}
                      >
                        Reproducir de nuevo
                      </button>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

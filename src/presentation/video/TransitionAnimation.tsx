"use client";

/**
 * PRESENTATION — Client Component
 *
 * Animación de transición entre capítulos: ambiental (autoplay/muted/loop,
 * sin controles). Monta el video solo cuando entra en el viewport
 * (IntersectionObserver, igual que el diseño) y lo pausa al salir. Con
 * `prefers-reduced-motion`, no reproduce — se queda en el estado visible
 * (poster/fallback) sin animación.
 */
import { useEffect, useRef, useState } from "react";
import styles from "./TransitionAnimation.module.css";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export interface TransitionAnimationProps {
  url: string | null;
  fallback: string;
  captionLabel: string;
  captionStage: string;
}

export default function TransitionAnimation({ url, fallback, captionLabel, captionStage }: TransitionAnimationProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section data-reveal className={styles.section} aria-label={captionLabel}>
      <div className={styles.frame}>
        {url ? (
          <video
            ref={videoRef}
            src={url}
            muted
            loop
            playsInline
            autoPlay={!reduced}
            preload="none"
            className={styles.video}
            aria-label={captionLabel}
          />
        ) : (
          <div className={styles.pending}>
            <span className={styles.pendingLabel}>{fallback}</span>
          </div>
        )}
      </div>
      <p className={styles.caption}>
        {captionLabel} <strong className={styles.captionHighlight}>{captionStage}</strong>
      </p>
    </section>
  );
}

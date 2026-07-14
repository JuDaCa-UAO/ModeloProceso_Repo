"use client";

/**
 * PRESENTATION — Client Component
 *
 * Video-resumen con controles propios (patrón "CierreEtapa" del diseño):
 * play/pausa central + barra, tiempo, seek, volumen/mute, botón CC
 * (subtítulos aún no producidos — placeholder), pantalla completa.
 * `preload="metadata"`, reproducción SIEMPRE manual (nunca autoplay) — el
 * comportamiento opuesto al de `TransitionAnimation`.
 */
import { useRef, useState } from "react";
import styles from "./AccessibleVideoPlayer.module.css";

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export interface AccessibleVideoPlayerProps {
  url: string;
  accent: string;
  borderColor?: string;
  captionsAvailable?: boolean;
  /**
   * Pie del reproductor. `undefined` (omitido) → pie por defecto
   * ("Video-resumen opcional · …"). Pásalo explícitamente —incluido `null`—
   * para reemplazarlo u ocultarlo (p. ej. el abrebocas no lleva pie).
   */
  caption?: React.ReactNode;
}

export default function AccessibleVideoPlayer({ url, accent, borderColor, caption }: AccessibleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);

  return (
    <div>
      <div
        className={styles.wrap}
        style={{ "--accent": accent, "--border-col": borderColor } as React.CSSProperties}
      >
        <video
          ref={videoRef}
          src={url}
          controls
          preload="metadata"
          playsInline
          className={styles.video}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      </div>
      {caption === undefined ? (
        <p className={styles.caption}>
          Video-resumen opcional · reproducción manual · <strong>{formatTime(duration)}</strong>
        </p>
      ) : (
        caption
      )}
    </div>
  );
}

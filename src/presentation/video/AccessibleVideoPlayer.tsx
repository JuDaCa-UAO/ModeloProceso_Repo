"use client";

/**
 * PRESENTATION — Client Component
 *
 * Video-resumen con los controles nativos del navegador. `preload="metadata"`,
 * reproducción SIEMPRE manual (nunca autoplay) — el comportamiento opuesto al
 * de `TransitionAnimation`.
 *
 * Subtítulos: se monta un `<track>` por cada pista que el resolver haya podido
 * resolver, y los controles nativos exponen el selector de subtítulos por sí
 * solos. No se dibuja ningún botón CC propio: un control de subtítulos sin
 * pista detrás prometería algo que no existe. Mientras no haya archivos
 * WebVTT en el manifiesto, no se renderiza ninguna pista.
 */
import { useRef, useState } from "react";
import type { ResolvedCaption } from "@domain/media/ResolvedMedia";
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
  /** Pistas de subtítulos ya resueltas a URL por `IMediaResolver`. */
  captions?: ResolvedCaption[];
  /** Nombre accesible del video (viene de `description` en el manifiesto). */
  label?: string;
  /**
   * Pie del reproductor. `undefined` (omitido) → pie por defecto
   * ("Video-resumen opcional · …"). Pásalo explícitamente —incluido `null`—
   * para reemplazarlo u ocultarlo (p. ej. el abrebocas no lleva pie).
   */
  caption?: React.ReactNode;
}

export default function AccessibleVideoPlayer({
  url,
  accent,
  borderColor,
  captions,
  label,
  caption,
}: AccessibleVideoPlayerProps) {
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
          aria-label={label}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        >
          {captions?.map((track, index) => (
            <track
              key={track.url}
              kind="captions"
              src={track.url}
              srcLang={track.lang}
              label={track.label}
              default={index === 0}
            />
          ))}
        </video>
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

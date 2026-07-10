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
}

export default function AccessibleVideoPlayer({ url, accent, borderColor, captionsAvailable }: AccessibleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [ccOn, setCcOn] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setCurrent(video.currentTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const setVol = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = value;
      video.muted = value === 0;
    }
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleFullscreen = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else wrap.requestFullscreen?.().catch(() => {});
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div>
      <div
        ref={wrapRef}
        className={styles.wrap}
        style={{ "--accent": accent, "--border-col": borderColor } as React.CSSProperties}
      >
        <video
          ref={videoRef}
          src={url}
          preload="metadata"
          playsInline
          className={styles.video}
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />

        {!playing ? (
          <button type="button" className={styles.centerButton} onClick={togglePlay} aria-label="Reproducir">
            ▶
          </button>
        ) : null}

        {ccOn ? (
          <div className={styles.captionOverlay}>
            <span className={styles.captionText}>Subtítulos activados · se integrarán en la versión final</span>
          </div>
        ) : null}

        <div className={styles.controls}>
          <button type="button" className={styles.iconButton} onClick={togglePlay} aria-label={playing ? "Pausar" : "Reproducir"}>
            {playing ? "❚❚" : "▶"}
          </button>
          <span className={styles.time}>
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <div className={styles.seekTrack} onClick={seek}>
            <div className={styles.seekBar}>
              <div className={styles.seekFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button type="button" className={styles.iconButton} onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
            {muted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={setVol}
            className={styles.volumeRange}
            aria-label="Volumen"
          />
          {captionsAvailable !== false ? (
            <button
              type="button"
              className={styles.ccButton}
              onClick={() => setCcOn((v) => !v)}
              aria-label="Activar o desactivar subtítulos"
              title="Subtítulos"
              style={{ background: ccOn ? "#fff" : "transparent", color: ccOn ? "#0f172b" : "#fff" }}
            >
              CC
            </button>
          ) : null}
          <button type="button" className={styles.iconButton} onClick={toggleFullscreen} aria-label="Pantalla completa">
            ⛶
          </button>
        </div>
      </div>
      <p className={styles.caption}>
        Video-resumen opcional · reproducción manual · <strong>{formatTime(duration)}</strong>
      </p>
    </div>
  );
}

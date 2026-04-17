"use client";

import { useEffect, useRef } from "react";
import { useVolume } from "@/context/VolumeContext";
import styles from "./YouTubeNarrativePlayer.module.css";

// ─── Minimal YouTube IFrame API type declarations ─────────────────────────────
// No depende de @types/youtube; solo declara lo que este componente usa.

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
  PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
}

interface YTPlayerOptions {
  videoId: string;
  host?: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { target: YTPlayer; data: number }) => void;
  };
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  destroy(): void;
}

// ─── Singleton: carga la YouTube IFrame API una sola vez por sesión ───────────

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve) => {
    // API ya cargada (e.g., segunda visita a una etapa en la misma sesión)
    if (typeof window !== "undefined" && window.YT?.Player) {
      resolve();
      return;
    }

    // Encadena con cualquier callback previo para no clobbear otros registros
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      resolve();
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });

  return ytApiPromise;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface YouTubeNarrativePlayerProps {
  videoId: string;
  startSeconds: number;
  autoplay?: boolean;
  onEnded?: () => void;
  /** Clase adicional para dimensionar el wrapper desde el componente padre. */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function YouTubeNarrativePlayer({
  videoId,
  startSeconds,
  autoplay = true,
  onEnded,
  className,
}: YouTubeNarrativePlayerProps) {
  const { setIsVideoPlaying } = useVolume();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  // Ref para onEnded: evita closures obsoletos en el callback de la IFrame API
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    let destroyed = false;

    loadYouTubeApi().then(() => {
      if (destroyed || !containerRef.current) return;

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,     // oculta la barra de controles nativa de YouTube
          playsinline: 1,  // evita que iOS abra fullscreen automáticamente
          enablejsapi: 1,  // necesario para recibir eventos (onEnded)
          start: startSeconds,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === 1) { // PLAYING
              setIsVideoPlaying(true);
            } else if (event.data === 0 || event.data === 2) { // ENDED or PAUSED
              setIsVideoPlaying(false);
            }
            
            if (event.data === 0) {
              onEndedRef.current?.();
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      destroyed = true;
      setIsVideoPlaying(false);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <div ref={containerRef} className={styles.player} />
      {/* Overlay transparente — bloquea clic-para-pausar sin ocultar el video */}
      <div className={styles.overlay} aria-hidden="true" />
    </div>
  );
}

// ─── Eager init ───────────────────────────────────────────────────────────────
// Inicia la descarga de la IFrame API en cuanto este módulo se importa,
// sin esperar a que ningún componente monte. En la práctica esto ocurre
// cuando Next.js carga el bundle de la ruta, ganando los segundos de latencia
// que antes se perdían hasta el primer render del player.
if (typeof window !== "undefined") {
  loadYouTubeApi();
}

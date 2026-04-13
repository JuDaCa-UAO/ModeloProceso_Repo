"use client";

/**
 * PRESENTATION — YouTubeNarrativePlayer
 *
 * Reproductor de YouTube sin controles diseñado para flujos narrativos.
 * Usa la YouTube IFrame Player API directamente para:
 *   - Bloquear toda interacción del usuario (pausa, avance, teclado, fullscreen).
 *   - Disparar onEnded cuando el video termine, integrándose con el flujo
 *     de completedFrames del StageClient.
 *   - Minimizar la UI nativa de YouTube con playerVars apropiados.
 *   - Usar youtube-nocookie.com para reducir tracking.
 *
 * El overlay transparente sobre el iframe intercepta todos los eventos de
 * puntero antes de que lleguen al reproductor. El teclado queda bloqueado
 * con disablekb=1.
 *
 * Props:
 *   videoId        — ID del video en YouTube.
 *   startSeconds   — Segundo de inicio de la reproducción.
 *   autoplay       — Si debe reproducirse automáticamente al montar (default: true).
 *   onEnded        — Callback que se dispara cuando el video termina.
 *   replayEnabled  — Si se muestra un botón de replay interno cuando termina.
 *   className      — Clase adicional para ajustar dimensiones desde el caller.
 */

import { useEffect, useRef, useState } from "react";
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
  /** Mostrar botón de replay interno cuando el video termina. */
  replayEnabled?: boolean;
  /** Clase adicional para dimensionar el wrapper desde el componente padre. */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function YouTubeNarrativePlayer({
  videoId,
  startSeconds,
  autoplay = true,
  onEnded,
  replayEnabled = false,
  className,
}: YouTubeNarrativePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ended, setEnded] = useState(false);

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
        // Privacy-enhanced embed — reduce tracking sin perder funcionalidad de la API
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,       // oculta barra de controles
          disablekb: 1,      // bloquea teclado
          fs: 0,             // desactiva fullscreen
          rel: 0,            // sin videos relacionados al terminar
          modestbranding: 1, // logo de YouTube mínimo
          iv_load_policy: 3, // sin anotaciones
          playsinline: 1,    // no fullscreen en iOS
          enablejsapi: 1,    // habilita IFrame API
          start: startSeconds,
        },
        events: {
          onStateChange: (event) => {
            // YT.PlayerState.ENDED === 0
            if (event.data === 0) {
              setEnded(true);
              onEndedRef.current?.();
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // videoId, startSeconds y autoplay son estables durante la vida del componente;
    // si cambian, el padre debe remontar con una key diferente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReplay() {
    if (!playerRef.current) return;
    setEnded(false);
    playerRef.current.seekTo(startSeconds, true);
    playerRef.current.playVideo();
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      {/* El div que la IFrame API reemplaza con un <iframe> */}
      <div ref={containerRef} className={styles.player} />

      {/*
       * Overlay transparente — intercepta TODOS los eventos de puntero antes
       * de que lleguen al iframe, bloqueando pausa, skip y cualquier control.
       * pointer-events: auto en el overlay + pointer-events: none en el iframe
       * (via CSS) garantizan que el usuario no pueda interactuar directamente.
       */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Botón de replay interno — visible solo si replayEnabled y video terminó */}
      {replayEnabled && ended ? (
        <button
          type="button"
          className={styles.replayBtn}
          onClick={handleReplay}
          aria-label="Repetir animación"
        >
          ↺ Repetir animación
        </button>
      ) : null}
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

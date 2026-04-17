"use client";

import { useEffect, useRef } from "react";
import { useVolume } from "@/context/VolumeContext";

interface BackgroundAudioProps {
  src: string;
}

export default function BackgroundAudio({ src }: BackgroundAudioProps) {
  const { volume, isVideoPlaying } = useVolume();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // El multiplicador define qué tan fuerte será el audio de fondo relativo al volumen global.
    // 0.25 significa que si el volumen general es 100%, el fondo estará al 25%
    // para no solapar los efectos de sonido o posibles voces del diálogo.
    const BACKGROUND_MULTIPLIER = 0.25;
    
    if (audioRef.current) {
      audioRef.current.volume = volume * BACKGROUND_MULTIPLIER;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isVideoPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.debug("Background audio prevented:", e));
      }
    }
  }, [isVideoPlaying]);

  return (
    <audio
      ref={audioRef}
      src={src}
      loop
      autoPlay
      style={{ display: "none" }}
    />
  );
}

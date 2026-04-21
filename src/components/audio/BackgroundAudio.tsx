"use client";

import { useEffect, useRef } from "react";
import { useVolume } from "@/context/VolumeContext";

interface BackgroundAudioProps {
  src: string;
}

export default function BackgroundAudio({ src }: BackgroundAudioProps) {
  const { musicVolume, isVideoPlaying } = useVolume();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

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

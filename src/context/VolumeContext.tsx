"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface VolumeContextType {
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  sfxVolume: number;
  setSfxVolume: (volume: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos volúmenes
  const [musicVolume, setMusicVolumeState] = useState(0.25);
  const [sfxVolume, setSfxVolumeState] = useState(0.5);
  const [voiceVolume, setVoiceVolumeState] = useState(0.8);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Al cargar el cliente, recuperar de localStorage si existe
    const savedMusic = localStorage.getItem("app-music-volume");
    if (savedMusic !== null) {
      const parsed = parseFloat(savedMusic);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) setMusicVolumeState(parsed);
    }
    
    const savedSfx = localStorage.getItem("app-sfx-volume");
    if (savedSfx !== null) {
      const parsed = parseFloat(savedSfx);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) setSfxVolumeState(parsed);
    }

    const savedVoice = localStorage.getItem("app-voice-volume");
    if (savedVoice !== null) {
      const parsed = parseFloat(savedVoice);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) setVoiceVolumeState(parsed);
    }
  }, []);

  const setMusicVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setMusicVolumeState(clamped);
    localStorage.setItem("app-music-volume", clamped.toString());
  };

  const setSfxVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setSfxVolumeState(clamped);
    localStorage.setItem("app-sfx-volume", clamped.toString());
  };

  const setVoiceVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVoiceVolumeState(clamped);
    localStorage.setItem("app-voice-volume", clamped.toString());
  };

  return (
    <VolumeContext.Provider value={{ 
      musicVolume, setMusicVolume, 
      sfxVolume, setSfxVolume, 
      voiceVolume, setVoiceVolume, 
      isVideoPlaying, setIsVideoPlaying 
    }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  const context = useContext(VolumeContext);
  if (context === undefined) {
    throw new Error("useVolume must be used within a VolumeProvider");
  }
  return context;
}

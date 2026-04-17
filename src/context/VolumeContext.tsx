"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface VolumeContextType {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos el volumen global, puede ser 0.5 por defecto
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    // Al cargar el cliente, recuperar de localStorage si existe
    const saved = localStorage.getItem("app-global-volume");
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        setVolumeState(parsed);
      }
    }
  }, []);

  const setVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    localStorage.setItem("app-global-volume", clamped.toString());
  };

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
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

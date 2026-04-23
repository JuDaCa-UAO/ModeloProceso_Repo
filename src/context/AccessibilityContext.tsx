"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AccessibilityContextType {
  textScale: number;
  setTextScale: (scale: number) => void;
  uiScale: number;
  setUiScale: (scale: number) => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const SCALE_MIN = 0.8;
const TEXT_SCALE_MAX = 1.1;
const UI_SCALE_MAX = 1.1;
const SCALE_STEP = 0.1;
const DEFAULT_TEXT_SCALE = 1.0;
const DEFAULT_UI_SCALE = 1.0;

function clampTextScale(value: number): number {
  return Math.round(Math.max(SCALE_MIN, Math.min(TEXT_SCALE_MAX, value)) * 10) / 10;
}

function clampUiScale(value: number): number {
  return Math.round(Math.max(SCALE_MIN, Math.min(UI_SCALE_MAX, value)) * 10) / 10;
}

/**
 * Applies the CSS custom properties --text-scale and --ui-scale
 * to the root <html> element so every component can respond to them.
 */
function applyCSSVars(textScale: number, uiScale: number) {
  const root = document.documentElement;
  root.style.setProperty("--text-scale", String(textScale));
  root.style.setProperty("--ui-scale", String(uiScale));
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textScale, setTextScaleState] = useState(DEFAULT_TEXT_SCALE);
  const [uiScale, setUiScaleState] = useState(DEFAULT_UI_SCALE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedText = localStorage.getItem("app-text-scale");
      const savedUi = localStorage.getItem("app-ui-scale");

      const tScale = savedText !== null ? clampTextScale(parseFloat(savedText)) : DEFAULT_TEXT_SCALE;
      const uScale = savedUi !== null ? clampUiScale(parseFloat(savedUi)) : DEFAULT_UI_SCALE;

      setTextScaleState(tScale);
      setUiScaleState(uScale);
      applyCSSVars(tScale, uScale);
    } catch {
      /* localStorage unavailable — keep defaults */
    }
  }, []);

  const setTextScale = useCallback((newScale: number) => {
    const clamped = clampTextScale(newScale);
    setTextScaleState(clamped);
    localStorage.setItem("app-text-scale", clamped.toString());
    applyCSSVars(clamped, uiScale);
  }, [uiScale]);

  const setUiScale = useCallback((newScale: number) => {
    const clamped = clampUiScale(newScale);
    setUiScaleState(clamped);
    localStorage.setItem("app-ui-scale", clamped.toString());
    applyCSSVars(textScale, clamped);
  }, [textScale]);

  const resetAccessibility = useCallback(() => {
    setTextScaleState(DEFAULT_TEXT_SCALE);
    setUiScaleState(DEFAULT_UI_SCALE);
    localStorage.setItem("app-text-scale", DEFAULT_TEXT_SCALE.toString());
    localStorage.setItem("app-ui-scale", DEFAULT_UI_SCALE.toString());
    applyCSSVars(DEFAULT_TEXT_SCALE, DEFAULT_UI_SCALE);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ textScale, setTextScale, uiScale, setUiScale, resetAccessibility }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

export { SCALE_MIN, TEXT_SCALE_MAX, UI_SCALE_MAX, SCALE_STEP };

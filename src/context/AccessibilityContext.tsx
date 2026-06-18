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

const TEXT_SCALES = [1.0, 1.125, 1.25, 1.375, 1.5];
const UI_SCALES = [0.8, 0.9, 1.0];
const DEFAULT_TEXT_SCALE = 1.0;
const DEFAULT_UI_SCALE = 1.0;

function clampTextScale(value: number): number {
  return TEXT_SCALES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

function clampUiScale(value: number): number {
  return UI_SCALES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Applies the CSS custom properties --text-scale and --ui-scale
 * to the root <html> element so every component can respond to them.
 */
function applyCSSVars(textScale: number, uiScale: number) {
  if (typeof document === "undefined") return;
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
      let tScale = DEFAULT_TEXT_SCALE;
      let uScale = DEFAULT_UI_SCALE;

      const savedPrefs = localStorage.getItem("app-accessibility-v2");
      if (savedPrefs !== null) {
        const parsed = JSON.parse(savedPrefs);
        if (typeof parsed.textScale === "number") {
          tScale = clampTextScale(parsed.textScale);
        }
        if (typeof parsed.uiScale === "number") {
          uScale = clampUiScale(parsed.uiScale);
        }
      } else {
        // Migration of legacy keys if present
        const oldText = localStorage.getItem("app-text-scale");
        const oldUi = localStorage.getItem("app-ui-scale");

        if (oldText !== null || oldUi !== null) {
          if (oldText !== null) tScale = clampTextScale(parseFloat(oldText));
          if (oldUi !== null) uScale = clampUiScale(parseFloat(oldUi));

          // Save migrated preferences under versioned key
          localStorage.setItem(
            "app-accessibility-v2",
            JSON.stringify({ textScale: tScale, uiScale: uScale })
          );

          // Cleanup legacy keys
          localStorage.removeItem("app-text-scale");
          localStorage.removeItem("app-ui-scale");
        }
      }

      setTimeout(() => {
        setTextScaleState(tScale);
        setUiScaleState(uScale);
        applyCSSVars(tScale, uScale);
      }, 0);
    } catch {
      /* localStorage unavailable or JSON parsing failed — keep defaults */
    }
  }, []);

  const setTextScale = useCallback((newScale: number) => {
    const clamped = clampTextScale(newScale);
    setTextScaleState(clamped);
    applyCSSVars(clamped, uiScale);
    try {
      localStorage.setItem(
        "app-accessibility-v2",
        JSON.stringify({ textScale: clamped, uiScale })
      );
    } catch {}
  }, [uiScale]);

  const setUiScale = useCallback((newScale: number) => {
    const clamped = clampUiScale(newScale);
    setUiScaleState(clamped);
    applyCSSVars(textScale, clamped);
    try {
      localStorage.setItem(
        "app-accessibility-v2",
        JSON.stringify({ textScale, uiScale: clamped })
      );
    } catch {}
  }, [textScale]);

  const resetAccessibility = useCallback(() => {
    setTextScaleState(DEFAULT_TEXT_SCALE);
    setUiScaleState(DEFAULT_UI_SCALE);
    applyCSSVars(DEFAULT_TEXT_SCALE, DEFAULT_UI_SCALE);
    try {
      localStorage.setItem(
        "app-accessibility-v2",
        JSON.stringify({ textScale: DEFAULT_TEXT_SCALE, uiScale: DEFAULT_UI_SCALE })
      );
    } catch {}
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

export { TEXT_SCALES, UI_SCALES, DEFAULT_TEXT_SCALE, DEFAULT_UI_SCALE };

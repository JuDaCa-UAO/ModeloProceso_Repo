/**
 * PRESENTATION — UI Hook
 *
 * useScrollPin: detecta si un contenedor está "anclado" (pinned) al viewport
 * durante el scroll y calcula el progreso 0→1 de su recorrido visible.
 *
 * Este hook es PURAMENTE de orquestación visual — no contiene lógica de negocio.
 * Movido a hooks/ui/ para diferenciarlo de hooks/domain/ que tocan Application.
 *
 * Depende de: lib/scroll/pin.ts (utilidad de cálculo, sin framework).
 */

"use client";

import { useEffect, useState, type RefObject } from "react";
import { getPinProgress } from "@/lib/scroll/pin";

type UseScrollPinOptions = {
  disabled?: boolean;
};

export function useScrollPin<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  { disabled = false }: UseScrollPinOptions = {}
) {
  const [progress, setProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (disabled) return;

    let rafId = 0;
    const measure = () => {
      rafId = 0;
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      setProgress(getPinProgress(rect, vh));
      setIsPinned(rect.top <= 0 && rect.bottom >= vh);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [containerRef, disabled]);

  return {
    progress: disabled ? 0 : progress,
    isPinned: disabled ? false : isPinned,
  };
}

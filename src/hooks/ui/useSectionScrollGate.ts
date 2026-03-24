"use client";

import { useEffect, type MutableRefObject } from "react";

type UseSectionScrollGateParams = {
  /** ID de la sección que bloquea (la que requiere Continuar). Null = no bloquear. */
  blockingSectionId: string | null;
  /** ID de la sección siguiente (hacia la que no debe poder hacer scroll). */
  nextSectionId: string | null;
  sectionRefs: MutableRefObject<Map<string, HTMLElement>>;
  /** Si el botón Continuar está habilitado: bloqueamos scroll. Si está deshabilitado: no bloqueamos (puede leer). */
  shouldBlock: boolean;
};

/**
 * Impide avanzar hacia abajo hasta que el usuario pulse Continuar en la sección bloqueante.
 */
export function useSectionScrollGate({
  blockingSectionId,
  nextSectionId,
  sectionRefs,
  shouldBlock,
}: UseSectionScrollGateParams) {
  useEffect(() => {
    if (!blockingSectionId || !nextSectionId || !shouldBlock) return;

    const getNextEl = () =>
      sectionRefs.current.get(nextSectionId) ?? document.getElementById(nextSectionId);

    /** Bloqueamos cuando la siguiente sección está cerca o ya visible.
     * Margen amplio para interceptar antes de que entre al viewport. */
    const BLOCK_THRESHOLD = window.innerHeight + 200;

    const isNextSectionApproaching = () => {
      const nextEl = getNextEl();
      if (!nextEl) return false;
      return nextEl.getBoundingClientRect().top < BLOCK_THRESHOLD;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;
      if (isNextSectionApproaching()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      if (y >= lastY) return;
      if (isNextSectionApproaching()) {
        e.preventDefault();
        e.stopPropagation();
      }
      lastY = y;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // No bloquear si el foco está en un control interactivo (botón, enlace, input, etc.)
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      const role = document.activeElement?.getAttribute?.("role");
      if (
        tag === "button" ||
        tag === "a" ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        role === "button" ||
        document.activeElement?.getAttribute?.("contenteditable") === "true"
      ) {
        return;
      }
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "End"
      ) {
        if (isNextSectionApproaching()) e.preventDefault();
      }
    };

    // Captura para interceptar antes de que el scroll consuma el evento.
    const wheelOpts = { passive: false, capture: true };
    const touchOpts = { passive: false, capture: true };
    document.addEventListener("wheel", onWheel, wheelOpts);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, touchOpts);

    return () => {
      document.removeEventListener("wheel", onWheel, wheelOpts);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [blockingSectionId, nextSectionId, sectionRefs, shouldBlock]);
}

"use client";

import { useEffect } from "react";

/**
 * Hace scroll suave hasta la sección cuyo id coincide con el hash de la URL
 * (p. ej. `#etapa-2`), tanto en la carga inicial como al navegar por anclas
 * dentro de la página (teaser de etapas, CTA "Continuar", cierre cíclico).
 * Respeta `prefers-reduced-motion` (scroll instantáneo en vez de suave).
 */
export default function useHashNavigation() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    function scrollToHash(hash: string) {
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      if (!id) return;
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior, block: "start" });
    }

    if (window.location.hash) {
      // Espera al primer paint para que ScrollTrigger ya tenga medidas
      // correctas del documento antes de saltar.
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    function onHashChange() {
      scrollToHash(window.location.hash);
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
}

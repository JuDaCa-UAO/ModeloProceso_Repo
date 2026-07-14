"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve `true` si el usuario prefiere movimiento reducido
 * (`prefers-reduced-motion: reduce`). Hook reutilizable por componentes que
 * animan (espiral 3D, autorrotación, transiciones). SSR-safe: arranca en
 * `false` en el servidor y se sincroniza en el cliente al montar.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

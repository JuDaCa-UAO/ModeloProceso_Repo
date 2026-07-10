"use client";

/**
 * PRESENTATION — Client Component
 *
 * Visor 3D de la espiral en la portada de la Introducción (arrastrable,
 * auto-rotación salvo `prefers-reduced-motion`). Reutiliza `LazyStageViewer`
 * (un solo contexto WebGL activo) sin modificarlo — la espiral 3D es
 * contenido a conservar tal cual, per el plan de rework.
 */
import { useEffect, useState } from "react";
import LazyStageViewer from "@/components/stage/LazyStageViewer";
import styles from "./IntroSpiralViewer.module.css";

function usePrefersReducedMotion(): boolean {
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

export default function IntroSpiralViewer({ caption }: { caption?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div>
      <div className={styles.frame}>
        <LazyStageViewer enableRotation={!reduced} lowPower />
      </div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}

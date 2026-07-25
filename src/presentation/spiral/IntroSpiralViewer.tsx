"use client";

/**
 * PRESENTATION — Client Component
 *
 * Visor 3D de la espiral en la portada de la Introducción (arrastrable,
 * auto-rotación salvo `prefers-reduced-motion`). Reutiliza `LazyStageViewer`
 * (un solo contexto WebGL activo) sin modificarlo — la espiral 3D es
 * contenido a conservar tal cual, per el plan de rework.
 */
import LazyStageViewer from "./LazyStageViewer";
import { usePrefersReducedMotion } from "@/presentation/hooks/usePrefersReducedMotion";
import styles from "./IntroSpiralViewer.module.css";

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

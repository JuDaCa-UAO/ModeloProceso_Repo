import type { Stage } from "@domain/content/Stage";
import styles from "./TeaserEtapasSection.module.css";

/**
 * Teaser de las 6 etapas en la Introducción: número + nombre + color de
 * acento, sin descripción (patrón visual único de esta sección — no
 * reutiliza `action-cards`, que sí lleva descripción). Necesita `stages`
 * completo, por eso llega en la Fase 8 (antes solo tenía el párrafo de cierre).
 */
export default function TeaserEtapasSection({ stages }: { stages: Stage[] }) {
  const ordered = [...stages].sort((a, b) => a.order - b.order);

  return (
    <section data-reveal data-screen-label="Teaser etapas" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Lo que viene: seis etapas clave</h2>
          <span className={styles.eyebrow}>próximos capítulos</span>
        </div>
        <div className={styles.grid}>
          {ordered.map((stage) => (
            <a key={stage.id} href={`#${stage.id}`} className={styles.card} style={{ "--stage-accent": stage.accent.main } as React.CSSProperties}>
              <span className={styles.cardNumber}>{stage.order}</span>
              <span className={styles.cardName}>{stage.officialName}</span>
            </a>
          ))}
        </div>
        <p className={styles.description}>
          Cada etapa se acompaña de cinco factores rectores —propósito, razonamiento crítico, ética, herramientas y
          reflexión— que conocerás al final del recorrido.
        </p>
      </div>
    </section>
  );
}

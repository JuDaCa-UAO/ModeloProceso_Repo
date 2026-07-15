import type { Stage } from "@domain/content/Stage";
import CartillaSpiralNav from "@/presentation/spiral/CartillaSpiralNav";
import styles from "./EtapasSpiralNavSection.module.css";

/**
 * Navegación por las 6 etapas mediante la espiral 3D interactiva (reemplaza el
 * antiguo teaser de tarjetas `TeaserEtapasSection`). La espiral es la
 * navegación primaria: girar el modelo y hacer clic en una etapa hace scroll a
 * `#etapa-N` en la misma página (vía `useHashNavigation`).
 *
 * Debajo se conserva una lista de enlaces accesibles (misma ancla `#etapa-N`)
 * como respaldo para teclado, lectores de pantalla y `prefers-reduced-motion`,
 * ya que un canvas WebGL no es navegable por esos medios.
 */
export default function EtapasSpiralNavSection({ stages }: { stages: Stage[] }) {
  const ordered = [...stages].sort((a, b) => a.order - b.order);

  return (
    <section
      id="navegacion-etapas"
      data-reveal
      data-screen-label="Navegación por etapas"
      className={styles.section}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Explora las seis etapas</h2>
          <span className={styles.eyebrow}>gira el modelo y elige una etapa</span>
        </div>

        <CartillaSpiralNav />

        <nav className={styles.linksNav} aria-label="Ir directamente a una etapa">
          <p className={styles.linksHint}>¿Prefieres ir directo? Elige una etapa:</p>
          <ul className={styles.grid}>
            {ordered.map((stage) => (
              <li key={stage.id}>
                <a
                  href={`#${stage.id}`}
                  className={styles.card}
                  style={{ "--stage-accent": stage.accent.main } as React.CSSProperties}
                >
                  <span className={styles.cardNumber}>{stage.order}</span>
                  <span className={styles.cardName}>{stage.officialName}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.description}>
          Cada etapa se acompaña de cinco factores rectores —propósito, razonamiento crítico, ética, herramientas y
          reflexión— que conocerás al final del recorrido.
        </p>
      </div>
    </section>
  );
}

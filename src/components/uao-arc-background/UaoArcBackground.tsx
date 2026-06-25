import styles from "./UaoArcBackground.module.css";

/**
 * Capa decorativa de fondo con el arco institucional UAO.
 *
 * Server component puramente presentacional: sin estado, sin eventos.
 * Se monta detrás de los frames (z-index 0) para dar profundidad al fondo
 * crema sin competir con el contenido. Decorativo → aria-hidden y sin
 * pointer-events. Estático (sin animación), por lo que respeta de base
 * prefers-reduced-motion.
 *
 * El path proviene del asset oficial `public/brand/uao-arc.svg`
 * (viewBox 0 0 434 217); se reutiliza sin deformar.
 */
const ARC_PATH =
  "M 8 0 H 426 A 8 8 0 0 1 434 8 V 209 A 8 8 0 0 1 426 217 H 378 A 12 12 0 0 1 369 213 C 330 170 276 148 217 148 C 158 148 104 170 65 213 A 12 12 0 0 1 56 217 H 8 A 8 8 0 0 1 0 209 V 8 A 8 8 0 0 1 8 0 Z";

export default function UaoArcBackground() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {/* Arco grande crema-sobre-crema, abajo-derecha: zona que la referencia
          marca como plana. */}
      <svg
        className={`${styles.arc} ${styles.arcBottomRight}`}
        viewBox="0 0 434 217"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path d={ARC_PATH} fill="currentColor" />
      </svg>

      {/* Acento coral muy tenue arriba-izquierda, detrás del widget 3D. */}
      <svg
        className={`${styles.arc} ${styles.arcTopLeft}`}
        viewBox="0 0 434 217"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path d={ARC_PATH} fill="currentColor" />
      </svg>
    </div>
  );
}

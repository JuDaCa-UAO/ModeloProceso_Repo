"use client";

import { useEffect, useState } from "react";
import styles from "./FloatingNavButton.module.css";

/**
 * Botón flotante interactivo en la esquina inferior derecha.
 * Se muestra tras hacer scroll descendente (> 300px).
 * Permite retornar al menú de etapas ("Explora las seis etapas") de manera instantánea y suave.
 */
export default function FloatingNavButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón si la posición de scroll supera los 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleHighlightStart = () => {
      setIsHighlighted(true);
      setForceVisible(true);
    };

    const handleHighlightStop = () => {
      setIsHighlighted(false);
      setForceVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("laia-nav-highlight-start", handleHighlightStart);
    window.addEventListener("laia-nav-highlight-stop", handleHighlightStop);

    // Ejecutar inmediatamente en caso de recarga a mitad de página
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("laia-nav-highlight-start", handleHighlightStart);
      window.removeEventListener("laia-nav-highlight-stop", handleHighlightStop);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("navegacion-etapas");
    if (target) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });

      // Actualizar el hash en el navegador de manera silenciosa (sin recargar ni saltar bruscamente)
      window.history.pushState(null, "", "#navegacion-etapas");
    }
  };

  return (
    <a
      href="#navegacion-etapas"
      onClick={handleClick}
      className={`${styles.button} ${isVisible || forceVisible ? styles.visible : ""} ${
        isHighlighted ? styles.highlighted : ""
      }`}
      aria-label="Volver al menú de etapas"
      title="Volver al menú de etapas"
    >
      <div className={styles.iconWrapper}>
        {/* SVG Espiral abstracta */}
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.spiralIcon}
        >
          <path d="M12 3a9 9 0 1 0 9 9c0-3.5-2.5-6-6-6a4 4 0 1 0 4 4" />
        </svg>
      </div>
      <span className={styles.text}>Seleccionar una etapa distinta</span>
    </a>
  );
}

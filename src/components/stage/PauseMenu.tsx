/**
 * PRESENTATION — PauseMenu
 *
 * Menú de pausa superpuesto, activado por el botón de opciones (≡)
 * en la esquina superior izquierda de las etapas.
 *
 * Funcionalidades actuales:
 *   - Salir → redirige a /inicio
 *
 * El botón de apertura se renderiza siempre (outside del overlay).
 * El overlay con el menú solo aparece cuando `open` es true.
 */

"use client";

import Link from "next/link";
import styles from "./PauseMenu.module.css";

interface PauseMenuProps {
  open: boolean;
  onToggle: () => void;
}

export default function PauseMenu({ open, onToggle }: PauseMenuProps) {
  return (
    <>
      {/* Botón hamburguesa — siempre visible arriba izquierda */}
      <button
        className={styles.triggerBtn}
        onClick={onToggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
      >
        <span className={styles.triggerIcon} aria-hidden>
          {open ? "✕" : "≡"}
        </span>
      </button>

      {/* Overlay + panel del menú */}
      {open ? (
        <div className={styles.overlay} onClick={onToggle} aria-hidden>
          <div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-label="Menú de pausa"
          >
            <p className={styles.panelTitle}>Menú</p>

            <nav className={styles.menuList}>
              <Link href="/inicio" className={styles.menuItem}>
                Salir
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

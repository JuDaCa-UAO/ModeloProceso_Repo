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
import { useVolume } from "@/context/VolumeContext";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import styles from "./PauseMenu.module.css";

interface PauseMenuProps {
  open: boolean;
  onToggle: () => void;
}

export default function PauseMenu({ open, onToggle }: PauseMenuProps) {
  const { volume, setVolume } = useVolume();

  return (
    <>
      {/* Botón hamburguesa — siempre visible arriba derecha */}
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

            <div className={styles.volumeControl}>
              <div className={styles.volumeHeader}>
                <span className={styles.volumeLabel}>Volumen</span>
                <span className={styles.volumeLabel}>{Math.round(volume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <HiOutlineSpeakerXMark className={styles.volumeIcon} size={18} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Control de volumen"
                />
                <HiOutlineSpeakerWave className={styles.volumeIcon} size={20} />
              </div>
            </div>

            <nav className={styles.menuList}>
              <Link href="/inicio" className={styles.menuItem}>
                Volver al menú principal
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

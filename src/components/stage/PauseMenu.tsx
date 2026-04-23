/**
 * PRESENTATION — PauseMenu
 *
 * Menú de pausa superpuesto, activado por el botón de opciones (≡)
 * en la esquina superior izquierda de las etapas.
 *
 * Funcionalidades actuales:
 *   - Controles de volumen (música, efectos, voz)
 *   - Controles de accesibilidad (tamaño de texto, escala de interfaz)
 *   - Salir → redirige a /inicio
 *
 * El botón de apertura se renderiza siempre (outside del overlay).
 * El overlay con el menú solo aparece cuando `open` es true.
 */

"use client";

import Link from "next/link";
import { useVolume } from "@/context/VolumeContext";
import { useAccessibility, SCALE_MIN, TEXT_SCALE_MAX, UI_SCALE_MAX, SCALE_STEP } from "@/context/AccessibilityContext";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import styles from "./PauseMenu.module.css";

interface PauseMenuProps {
  open: boolean;
  onToggle: () => void;
}

export default function PauseMenu({ open, onToggle }: PauseMenuProps) {
  const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume, voiceVolume, setVoiceVolume } = useVolume();
  const { textScale, setTextScale, uiScale, setUiScale, resetAccessibility } = useAccessibility();

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

            {/* ── Audio controls ─────────────────────────── */}
            <div className={styles.volumeControl}>
              <div className={styles.volumeHeader}>
                <span className={styles.volumeLabel}>Música</span>
                <span className={styles.volumeLabel}>{Math.round(musicVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <HiOutlineSpeakerXMark className={styles.volumeIcon} size={18} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de música"
                />
                <HiOutlineSpeakerWave className={styles.volumeIcon} size={20} />
              </div>

              <div className={styles.volumeHeader} style={{ marginTop: '12px' }}>
                <span className={styles.volumeLabel}>Efectos</span>
                <span className={styles.volumeLabel}>{Math.round(sfxVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <HiOutlineSpeakerXMark className={styles.volumeIcon} size={18} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de efectos"
                />
                <HiOutlineSpeakerWave className={styles.volumeIcon} size={20} />
              </div>

              <div className={styles.volumeHeader} style={{ marginTop: '12px' }}>
                <span className={styles.volumeLabel}>Voz de Laia</span>
                <span className={styles.volumeLabel}>{Math.round(voiceVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <HiOutlineSpeakerXMark className={styles.volumeIcon} size={18} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de voz"
                />
                <HiOutlineSpeakerWave className={styles.volumeIcon} size={20} />
              </div>
            </div>

            {/* ── Accessibility controls ─────────────────── */}
            <div className={styles.accessibilitySection}>
              <p className={styles.sectionLabel}>Accesibilidad</p>

              {/* Text scale */}
              <div className={styles.scaleControl}>
                <span className={styles.scaleLabel}>Tamaño de texto</span>
                <div className={styles.scaleRow}>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => setTextScale(textScale - SCALE_STEP)}
                    disabled={textScale <= SCALE_MIN}
                    aria-label="Reducir tamaño de texto"
                  >
                    A−
                  </button>
                  <span className={styles.scaleValue}>{Math.round(textScale * 100)}%</span>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => setTextScale(textScale + SCALE_STEP)}
                    disabled={textScale >= TEXT_SCALE_MAX}
                    aria-label="Aumentar tamaño de texto"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* UI scale */}
              <div className={styles.scaleControl}>
                <span className={styles.scaleLabel}>Escala de interfaz</span>
                <div className={styles.scaleRow}>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => setUiScale(uiScale - SCALE_STEP)}
                    disabled={uiScale <= SCALE_MIN}
                    aria-label="Reducir escala de interfaz"
                  >
                    −
                  </button>
                  <span className={styles.scaleValue}>{Math.round(uiScale * 100)}%</span>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => setUiScale(uiScale + SCALE_STEP)}
                    disabled={uiScale >= UI_SCALE_MAX}
                    aria-label="Aumentar escala de interfaz"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reset button */}
              {(textScale !== 1.0 || uiScale !== 1.0) ? (
                <button
                  className={styles.resetBtn}
                  onClick={resetAccessibility}
                  aria-label="Restablecer configuración de accesibilidad"
                >
                  Restablecer
                </button>
              ) : null}
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

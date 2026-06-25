/**
 * PRESENTATION — PauseMenu
 *
 * Menú de pausa superpuesto, activado por el botón de opciones (≡)
 * en la esquina superior izquierda de las etapas.
 *
 * Requisitos WCAG 2.1 AA implementados:
 *   - Semántica correcta (role="dialog", aria-modal="true").
 *   - Gestión de foco (foco inicial al abrir, trampa de foco, restauración al cerrar).
 *   - Atajos de teclado (cierre con tecla Escape).
 *   - Anuncios dinámicos en aria-live al cambiar la escala.
 *   - Objetivos táctiles cómodos.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useVolume } from "@/context/VolumeContext";
import { useAccessibility, TEXT_SCALES, UI_SCALES } from "@/context/AccessibilityContext";
import { FiVolume2, FiVolumeX, FiMenu, FiX } from "react-icons/fi";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";
import styles from "./PauseMenu.module.css";

interface PauseMenuProps {
  open: boolean;
  onToggle: () => void;
}

export default function PauseMenu({ open, onToggle }: PauseMenuProps) {
  const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume, voiceVolume, setVoiceVolume } = useVolume();
  const { textScale, setTextScale, uiScale, setUiScale, resetAccessibility } = useAccessibility();
  const [confirmExit, setConfirmExit] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    if (open) setConfirmExit(false);
    onToggle();
  };

  // Keyboard navigation & Focus management
  useEffect(() => {
    if (!open) return;

    // Save current active element to restore later
    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the dialog container
    dialogRef.current?.focus();

    const triggerEl = triggerRef.current;

    // Block page scrolling while menu is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleToggle();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        
        // Find all focusable elements
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: loop back to end
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab: loop back to beginning
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      
      // Restore focus to trigger button
      if (previousActiveElement) {
        previousActiveElement.focus();
      } else {
        triggerEl?.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Adjust scales via indices
  const handleTextScaleChange = (increase: boolean) => {
    const currentIndex = TEXT_SCALES.indexOf(textScale);
    if (increase && currentIndex < TEXT_SCALES.length - 1) {
      const nextVal = TEXT_SCALES[currentIndex + 1];
      setTextScale(nextVal);
      setSrAnnouncement(`Tamaño de texto aumentado al ${Math.round(nextVal * 100)}%`);
    } else if (!increase && currentIndex > 0) {
      const prevVal = TEXT_SCALES[currentIndex - 1];
      setTextScale(prevVal);
      setSrAnnouncement(`Tamaño de texto reducido al ${Math.round(prevVal * 100)}%`);
    }
  };

  const handleUiScaleChange = (increase: boolean) => {
    const currentIndex = UI_SCALES.indexOf(uiScale);
    if (increase && currentIndex < UI_SCALES.length - 1) {
      const nextVal = UI_SCALES[currentIndex + 1];
      setUiScale(nextVal);
      setSrAnnouncement(`Escala de interfaz aumentada al ${Math.round(nextVal * 100)}%`);
    } else if (!increase && currentIndex > 0) {
      const prevVal = UI_SCALES[currentIndex - 1];
      setUiScale(prevVal);
      setSrAnnouncement(`Escala de interfaz reducida al ${Math.round(prevVal * 100)}%`);
    }
  };

  const handleReset = () => {
    resetAccessibility();
    setSrAnnouncement("Configuración de accesibilidad restablecida a los valores predeterminados.");
  };

  return (
    <>
      {/* Botón hamburguesa — siempre visible arriba derecha */}
      <button
        ref={triggerRef}
        className={styles.triggerBtn}
        onClick={handleToggle}
        aria-label={open ? "Cerrar menú de pausa" : "Abrir menú de pausa"}
        aria-expanded={open}
        aria-controls="pause-menu-dialog"
      >
        <span className={styles.triggerIcon} aria-hidden>
          {open ? <FiX /> : <FiMenu />}
        </span>
      </button>

      {/* Región aria-live para anuncios accesibles */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Overlay + panel del menú */}
      {open && (
        <div className={styles.overlay} onClick={handleToggle}>
          <section
            ref={dialogRef}
            id="pause-menu-dialog"
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-menu-title"
            tabIndex={-1}
          >
            <h2 id="pause-menu-title" className={styles.panelTitle}>
              Menú de opciones
            </h2>

            {/* ── Audio controls ─────────────────────────── */}
            <div className={styles.volumeControl}>
              <div className={styles.volumeHeader}>
                <span className={styles.volumeLabel}>Música</span>
                <span className={styles.volumeLabel}>{Math.round(musicVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <FiVolumeX className={styles.volumeIcon} size={18} aria-hidden />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de música de fondo"
                />
                <FiVolume2 className={styles.volumeIcon} size={20} aria-hidden />
              </div>

              <div className={styles.volumeHeader} style={{ marginTop: "12px" }}>
                <span className={styles.volumeLabel}>Efectos</span>
                <span className={styles.volumeLabel}>{Math.round(sfxVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <FiVolumeX className={styles.volumeIcon} size={18} aria-hidden />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de efectos de sonido"
                />
                <FiVolume2 className={styles.volumeIcon} size={20} aria-hidden />
              </div>

              <div className={styles.volumeHeader} style={{ marginTop: "12px" }}>
                <span className={styles.volumeLabel}>Voz de Laia</span>
                <span className={styles.volumeLabel}>{Math.round(voiceVolume * 100)}%</span>
              </div>
              <div className={styles.volumeRow}>
                <FiVolumeX className={styles.volumeIcon} size={18} aria-hidden />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volumen de voz del personaje guía"
                />
                <FiVolume2 className={styles.volumeIcon} size={20} aria-hidden />
              </div>
            </div>

            {/* ── Accessibility controls ─────────────────── */}
            <div className={styles.accessibilitySection}>
              <h3 className={styles.sectionLabel}>Accesibilidad</h3>

              {/* Text scale */}
              <div className={styles.scaleControl}>
                <span className={styles.scaleLabel}>Tamaño de texto</span>
                <div className={styles.scaleRow}>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => handleTextScaleChange(false)}
                    disabled={textScale <= TEXT_SCALES[0]}
                    aria-label="Reducir tamaño de texto"
                  >
                    A−
                  </button>
                  <span className={styles.scaleValue}>{Math.round(textScale * 100)}%</span>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => handleTextScaleChange(true)}
                    disabled={textScale >= TEXT_SCALES[TEXT_SCALES.length - 1]}
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
                    onClick={() => handleUiScaleChange(false)}
                    disabled={uiScale <= UI_SCALES[0]}
                    aria-label="Reducir escala de interfaz"
                  >
                    −
                  </button>
                  <span className={styles.scaleValue}>{Math.round(uiScale * 100)}%</span>
                  <button
                    className={styles.scaleBtn}
                    onClick={() => handleUiScaleChange(true)}
                    disabled={uiScale >= UI_SCALES[UI_SCALES.length - 1]}
                    aria-label="Aumentar escala de interfaz"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reset button */}
              {textScale !== 1.0 || uiScale !== 1.0 ? (
                <UaoButton
                  variant="ghost"
                  size="sm"
                  pill
                  onClick={handleReset}
                  aria-label="Restablecer configuración de accesibilidad"
                >
                  Restablecer
                </UaoButton>
              ) : null}
            </div>

            {/* ── Exit navigation ────────────────────────── */}
            <nav className={styles.menuList} aria-label="Navegación de salida">
              {confirmExit ? (
                <div className={styles.confirmBox}>
                  <p className={styles.confirmText}>¿Seguro que deseas salir al menú principal?</p>
                  <div className={styles.confirmActions}>
                    <UaoButton variant="secondary" onClick={() => setConfirmExit(false)}>
                      Cancelar
                    </UaoButton>
                    <UaoButtonLink href="/inicio">
                      Sí, Salir
                    </UaoButtonLink>
                  </div>
                </div>
              ) : (
                <UaoButton variant="secondary" onClick={() => setConfirmExit(true)}>
                  Volver al menú principal
                </UaoButton>
              )}
            </nav>
          </section>
        </div>
      )}
    </>
  );
}

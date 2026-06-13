"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./engine.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Etiqueta accesible del diálogo. */
  title: string;
  /** Texto del badge superior (ej. "INFOGRAFÍA"). Opcional. */
  badge?: string;
  closeLabel?: string;
  children: React.ReactNode;
};

/**
 * Modal accesible reutilizable: portal a document.body, cierre por backdrop,
 * Escape y botón. Mueve el foco al cierre al abrir y lo restaura al cerrar.
 */
export default function Modal({ open, onClose, title, badge, closeLabel = "Cerrar", children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    lastFocused.current = (document.activeElement as HTMLElement) ?? null;
    closeRef.current?.focus();
    window.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, handleKey]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          {badge ? <span className={styles.modalBadge}>{badge}</span> : <span />}
          <button
            ref={closeRef}
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

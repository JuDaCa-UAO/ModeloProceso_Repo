"use client";

/**
 * Tarjeta CTA "Haz tu autodiagnóstico". Al hacer clic abre el formulario de
 * N8N embebido en un modal a pantalla casi completa — nunca navega fuera de
 * la Cartilla. `block.formUrl` ya viene resuelto desde el contenido (Etapa 1
 * lo toma de `infrastructure/n8n/n8n.config.ts`); este componente no conoce
 * N8N, solo recibe una URL a embeber.
 */
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

export default function AutodiagnosticBlock({ block }: { block: Extract<Block, { type: "autodiagnostic" }> }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className={styles.downloadCard}>
      <div>
        <h3 className={styles.downloadTitle}>{block.title}</h3>
        <p className={styles.downloadDescription}>{block.description}</p>
      </div>
      <button type="button" className={styles.downloadButton} onClick={() => setOpen(true)}>
        {block.ctaLabel}
      </button>
      {open
        ? createPortal(
            <div className={styles.autodiagnosticOverlay} onClick={close}>
              <div
                className={styles.autodiagnosticModal}
                role="dialog"
                aria-modal="true"
                aria-label={block.title}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.autodiagnosticHeader}>
                  <span className={styles.autodiagnosticHeaderTitle}>{block.title}</span>
                  <button
                    type="button"
                    className={styles.autodiagnosticClose}
                    onClick={close}
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </div>
                <iframe
                  src={block.formUrl}
                  title={block.title}
                  className={styles.autodiagnosticIframe}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

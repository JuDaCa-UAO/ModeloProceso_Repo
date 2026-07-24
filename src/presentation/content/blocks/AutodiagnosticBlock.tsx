"use client";

/**
 * Tarjeta CTA "Haz tu autodiagnóstico". Al hacer clic abre el formulario de
 * N8N embebido en un modal a pantalla casi completa — nunca navega fuera de
 * la Cartilla. `block.formUrl` ya viene resuelto desde el contenido (Etapa 1
 * lo toma de `infrastructure/n8n/n8n.config.ts`); este componente no conoce
 * N8N, solo recibe una URL a embeber.
 */
import { useCallback, useState } from "react";
import type { Block } from "@domain/content/Block";
import AccessibleDialog from "../AccessibleDialog";
import styles from "../ContentSection.module.css";

export default function AutodiagnosticBlock({ block }: { block: Extract<Block, { type: "autodiagnostic" }> }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className={styles.downloadCard}>
      <div>
        <h3 className={styles.downloadTitle}>{block.title}</h3>
        <p className={styles.downloadDescription}>{block.description}</p>
      </div>
      <button type="button" className={styles.downloadButton} onClick={() => setOpen(true)}>
        {block.ctaLabel}
      </button>
      <AccessibleDialog open={open} title={block.title} onClose={close}>
        <iframe src={block.formUrl} title={block.title} className={styles.autodiagnosticIframe} />
      </AccessibleDialog>
    </div>
  );
}

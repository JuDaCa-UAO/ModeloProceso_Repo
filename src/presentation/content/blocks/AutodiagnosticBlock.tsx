"use client";

import { ArrowRight, ClipboardCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { useCallback, useId, useState } from "react";
import type { AutodiagnosticBlock as AutodiagnosticBlockModel } from "@domain/content/Block";
import AccessibleDialog from "../AccessibleDialog";
import styles from "./AutodiagnosticBlock.module.css";

/**
 * Solicita autorización explícita antes de abrir el formulario embebido.
 * La finalidad y el texto legal pertenecen al contenido tipado; la
 * presentación solo controla el consentimiento local y el diálogo.
 */
export default function AutodiagnosticBlock({ block }: { block: AutodiagnosticBlockModel }) {
  const [open, setOpen] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const titleId = useId();
  const descriptionId = useId();
  const noticeTitleId = useId();
  const consentId = useId();
  const consentHelpId = useId();

  return (
    <article
      className={styles.card}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-testid="autodiagnostic-card"
    >
      <span className={styles.brandArc} aria-hidden="true" />

      <header className={styles.header}>
        <span className={styles.primaryIcon} aria-hidden="true">
          <ClipboardCheck size={30} strokeWidth={2.25} />
        </span>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Autodiagnóstico docente · Etapa 1</span>
          <h3 id={titleId} className={styles.title}>
            {block.title}
          </h3>
          <p id={descriptionId} className={styles.description}>
            {block.description}
          </p>
        </div>
      </header>

      <section className={styles.privacyNotice} role="note" aria-labelledby={noticeTitleId}>
        <ShieldCheck className={styles.noticeIcon} size={28} strokeWidth={2.1} aria-hidden="true" />
        <div>
          <h4 id={noticeTitleId} className={styles.noticeTitle}>
            {block.privacyNotice.title}
          </h4>
          <p className={styles.noticeText}>{block.privacyNotice.purpose}</p>
          <p className={styles.confidentiality}>
            <LockKeyhole size={18} strokeWidth={2.25} aria-hidden="true" />
            <strong>{block.privacyNotice.confidentiality}</strong>
          </p>
          <p className={styles.legalReference}>{block.privacyNotice.legalReference}</p>
        </div>
      </section>

      <div className={styles.consentArea}>
        <div className={styles.consentControl}>
          <label className={styles.consentLabel} htmlFor={consentId}>
            <input
              id={consentId}
              className={styles.checkbox}
              type="checkbox"
              checked={consentAccepted}
              required
              aria-describedby={consentHelpId}
              onChange={(event) => setConsentAccepted(event.target.checked)}
            />
            <span>{block.privacyNotice.consentLabel}</span>
          </label>
          <p id={consentHelpId} className={styles.consentHelp} aria-live="polite">
            {consentAccepted
              ? "Autorización confirmada. Ya puedes comenzar."
              : "Marca la autorización para habilitar el autodiagnóstico."}
          </p>
        </div>

        <button
          type="button"
          className={styles.cta}
          disabled={!consentAccepted}
          onClick={() => {
            if (consentAccepted) setOpen(true);
          }}
        >
          <span>{block.ctaLabel}</span>
          <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>

      <AccessibleDialog open={open} title={block.title} onClose={close}>
        <iframe src={block.formUrl} title={block.title} className={styles.autodiagnosticIframe} />
      </AccessibleDialog>
    </article>
  );
}

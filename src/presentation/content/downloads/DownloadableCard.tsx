"use client";

import Image from "next/image";
import { CircleAlert } from "lucide-react";
import { useCallback, useId, useState } from "react";
import type { ResolvedMedia } from "@domain/media/ResolvedMedia";
import AccessibleDialog from "../AccessibleDialog";
import styles from "./DownloadableCard.module.css";

type DownloadableCardProps = {
  title: string;
  description: string;
  information: string;
  stageLabel: string;
  resourceType: string;
  pdf: ResolvedMedia;
  preview: ResolvedMedia;
};

export default function DownloadableCard({
  title,
  description,
  information,
  stageLabel,
  resourceType,
  pdf,
  preview,
}: DownloadableCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const informationId = useId();

  const previewAvailable = preview.available && Boolean(preview.url);
  const pdfAvailable = pdf.available && Boolean(pdf.url);
  const imageWidth = preview.width ?? 1600;
  const imageHeight = preview.height ?? 1000;

  return (
    <article className={styles.card} data-testid="downloadable-card">
      <button
        type="button"
        className={styles.informationButton}
        aria-expanded={informationOpen}
        aria-controls={informationId}
        aria-label={`${informationOpen ? "Ocultar" : "Ver"} información de ${title}`}
        onClick={() => setInformationOpen((open) => !open)}
      >
        <CircleAlert className={styles.informationIcon} size={18} strokeWidth={2.25} aria-hidden="true" />
        <span>Información</span>
      </button>
      <div className={styles.previewFrame}>
        {previewAvailable ? (
          <Image
            src={preview.url!}
            alt={preview.alt ?? preview.description ?? `Vista previa de ${title}`}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 720px) 92vw, 360px"
            className={styles.previewImage}
          />
        ) : (
          <div className={styles.previewFallback} role="status">
            {preview.fallback}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.stageLabel}>{stageLabel}</span>
          <span className={styles.resourceType}>{resourceType}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {informationOpen ? (
          <section id={informationId} className={styles.informationPanel} aria-labelledby={`${informationId}-title`}>
            <h4 id={`${informationId}-title`} className={styles.informationTitle}>
              Información importante
            </h4>
            <p className={styles.informationText}>{information}</p>
          </section>
        ) : null}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setPreviewOpen(true)}
            disabled={!previewAvailable}
            aria-label={`Ver vista previa de ${title}`}
          >
            Ver vista previa
          </button>
          {pdfAvailable ? (
            <>
              <a className={styles.ghostButton} href={pdf.url!} target="_blank" rel="noopener noreferrer">
                Abrir recurso
              </a>
              <a className={styles.primaryButton} href={pdf.url!} download={pdf.downloadName}>
                Descargar PDF
              </a>
            </>
          ) : (
            <span className={styles.unavailable} role="status">
              {pdf.fallback}
            </span>
          )}
        </div>
      </div>

      <AccessibleDialog
        open={previewOpen}
        title={title}
        description={`${stageLabel} · ${resourceType}. ${description}`}
        onClose={closePreview}
      >
        {previewAvailable ? (
          <Image
            src={preview.url!}
            alt={preview.alt ?? preview.description ?? `Vista previa de ${title}`}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 720px) 92vw, 880px"
            className={styles.dialogImage}
          />
        ) : (
          <div className={styles.previewFallback} role="status">
            {preview.fallback}
          </div>
        )}
        {pdfAvailable ? (
          <div className={styles.dialogActions}>
            <a className={styles.ghostButton} href={pdf.url!} target="_blank" rel="noopener noreferrer">
              Abrir recurso
            </a>
            <a className={styles.primaryButton} href={pdf.url!} download={pdf.downloadName}>
              Descargar PDF
            </a>
          </div>
        ) : null}
      </AccessibleDialog>
    </article>
  );
}

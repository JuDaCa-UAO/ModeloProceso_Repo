"use client";

/**
 * STAGE ENGINE — Registro de bloques reutilizables.
 *
 * Cada bloque es un componente que recibe `{ block, ctx }`. El renderer central
 * los despacha por `BLOCK_REGISTRY[type]`. Agregar una etapa con bloques
 * existentes NO requiere tocar el renderer ni este registro.
 *
 * Los bloques reutilizan componentes ya existentes (StageViewer,
 * CharacterStepDialog) y las clases visuales del patrón actual para conservar
 * la identidad visual.
 */

import { useCallback, useEffect, useState } from "react";
import StageViewer from "@/components/stage/StageViewer";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import { resolveMedia } from "@/content/shared/media-registry";
import type { ResolvedMedia } from "@/content/shared/media-registry";
import Modal from "./Modal";
import type { BlockContext, StageBlock } from "./types";
import sc from "../stageClient.module.css";
import styles from "./engine.module.css";

type BlockComponentProps = { block: StageBlock; ctx: BlockContext };

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// ── spiral-viewer ─────────────────────────────────────────────────────────────
function SpiralViewerBlock({ block }: BlockComponentProps) {
  const reduced = usePrefersReducedMotion();
  if (block.type !== "spiral-viewer") return null;
  return (
    <>
      <div className={block.variant === "compact" ? sc.modelStageCompact : sc.modelStage}>
        <StageViewer enableRotation={!reduced} activeStage={block.activeStage} />
      </div>
      {block.instructions ? (
        <p className={sc.frameInstructions}>{block.instructions}</p>
      ) : null}
    </>
  );
}

// ── dialogue ──────────────────────────────────────────────────────────────────
function DialogueBlock({ block, ctx }: BlockComponentProps) {
  if (block.type !== "dialogue") return null;
  const completes = block.completesFrame !== false;
  return (
    <div className={sc.laiaSlot}>
      <CharacterStepDialog
        steps={block.steps}
        size={block.size ?? "compact"}
        density={block.density ?? "tight"}
        onComplete={() => {
          if (completes) ctx.completeFrame();
        }}
      />
    </div>
  );
}

// ── paragraphs ────────────────────────────────────────────────────────────────
function ParagraphsBlock({ block }: BlockComponentProps) {
  if (block.type !== "paragraphs") return null;
  return (
    <div className={styles.paragraphs}>
      {block.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

// ── narrative-video ───────────────────────────────────────────────────────────
function NarrativeVideoBlock({ block }: BlockComponentProps) {
  if (block.type !== "narrative-video") return null;
  const media = resolveMedia(block.mediaKey);
  const caption = block.caption ?? media.description ?? "";

  return (
    <figure className={styles.videoFrame}>
      {media.available && media.url ? (
        <video
          className={styles.videoEl}
          src={media.url}
          controls
          preload="metadata"
          aria-label={media.description}
        />
      ) : (
        <div className={styles.videoFallback} role="img" aria-label={media.fallbackLabel}>
          <span className={styles.videoFallbackIcon} aria-hidden>
            ▶
          </span>
          <p className={styles.videoFallbackText}>{media.fallbackLabel}</p>
          <span className={styles.pendingTag}>Recurso pendiente</span>
        </div>
      )}
      {caption ? <figcaption className={styles.videoCaption}>{caption}</figcaption> : null}
    </figure>
  );
}

// ── Infografía hosteada (SVG diseñado aparte) o "Próximamente" ─────────────────
function HostedInfographic({ media }: { media: ResolvedMedia }) {
  if (media.available && media.url) {
    return (
      // El SVG vive en el host de multimedia (ruta lógica del media-registry).
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.url} alt={media.description ?? ""} className={styles.infographicImg} />
    );
  }
  return (
    <div className={styles.comingSoon} role="img" aria-label={media.fallbackLabel}>
      <span className={styles.pendingTag}>Próximamente</span>
      <p className={styles.comingSoonText}>{media.fallbackLabel}</p>
    </div>
  );
}

// ── criteria-infographic ──────────────────────────────────────────────────────
function CriteriaInfographicBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "criteria-infographic") return null;
  const media = resolveMedia(block.mediaKey);
  return (
    <div className={styles.actionRow}>
      <button
        type="button"
        className={sc.btnVerAnimacion}
        data-guide-id="etapa2-observar-criterios"
        onClick={() => setOpen(true)}
      >
        {block.openLabel} →
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Cómo se miran las posibilidades" badge="INFOGRAFÍA">
        <HostedInfographic media={media} />
      </Modal>
    </div>
  );
}

// ── comparison-example ────────────────────────────────────────────────────────
function ComparisonExampleBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "comparison-example") return null;
  const media = resolveMedia(block.mediaKey);
  return (
    <div className={styles.actionRow}>
      <button
        type="button"
        className={sc.btnVerAnimacion}
        data-guide-id="etapa2-observar-ejemplo"
        onClick={() => setOpen(true)}
      >
        {block.openLabel} →
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Ejemplo demostrativo de comparación" badge="EJEMPLO">
        <HostedInfographic media={media} />
      </Modal>
    </div>
  );
}

// ── download-resource ─────────────────────────────────────────────────────────
function DownloadResourceBlock({ block }: BlockComponentProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDownload = useCallback((url: string, name?: string) => {
    const a = document.createElement("a");
    a.href = url;
    if (name) a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  if (block.type !== "download-resource") return null;
  const media = resolveMedia(block.mediaKey);

  return (
    <div className={styles.actionRow}>
      <button
        type="button"
        className={sc.btnVerAnimacion}
        data-guide-id="etapa2-descargar-matriz"
        disabled={!media.available}
        aria-disabled={!media.available}
        onClick={() => {
          if (!media.available || !media.url) return;
          handleDownload(media.url, media.downloadName);
          setConfirmOpen(true);
        }}
      >
        {block.label}
      </button>
      {!media.available ? (
        <p className={styles.downloadNote}>{media.fallbackLabel}</p>
      ) : null}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Descarga" badge="DESCARGA">
        <p className={styles.confirmText}>¡Matriz de Pugh descargada exitosamente!</p>
        <p className={styles.confirmSub}>{media.description}</p>
      </Modal>
    </div>
  );
}

// ── transition ────────────────────────────────────────────────────────────────
function TransitionBlock({ block, ctx }: BlockComponentProps) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"idle" | "playing" | "ended">("idle");
  if (block.type !== "transition") return null;
  const media = resolveMedia(block.mediaKey);

  // Cuando el video aún no está hosteado, el cierre (diálogo de Laia + botón a la
  // siguiente etapa) debe quedar accesible sin pasos muertos: se omite el paso de
  // "Ver animación" y se muestra el modelo 3D con un aviso de "próximamente".
  const showVideoIntro = media.available && phase === "idle";
  const showVideo = media.available && phase === "playing";
  const showEnded = !media.available || phase === "ended";

  return (
    <div className={sc.f9Splash}>
      <div className={sc.f9ModelWrap}>
        {showVideo && media.url ? (
          <video
            className={styles.videoEl}
            src={media.url}
            autoPlay
            controls
            onEnded={() => setPhase("ended")}
            aria-label={media.description}
          />
        ) : (
          <StageViewer enableRotation={!reduced} activeStage={2} />
        )}
      </div>

      {showVideoIntro ? (
        <button
          type="button"
          className={sc.btnVerAnimacion}
          data-guide-id="etapa2-ver-animacion"
          onClick={() => setPhase("playing")}
        >
          Ver animación →
        </button>
      ) : null}

      {showEnded ? (
        <>
          {media.available ? (
            <div className={sc.f9RepeatRow}>
              <button type="button" className={sc.f9RepeatBtn} onClick={() => setPhase("idle")}>
                ↺ Repetir animación
              </button>
            </div>
          ) : (
            <p className={styles.transitionNote}>
              <span className={styles.pendingTag}>Próximamente</span> {media.fallbackLabel}
            </p>
          )}

          <div className={sc.f9LaiaWrap}>
            <CharacterStepDialog
              steps={block.steps}
              size="default"
              density="standard"
              onComplete={() => ctx.completeFrame()}
            />
          </div>

          {ctx.frameDone ? (
            <div className={sc.f9NextRow}>
              {block.nextAvailable ? (
                <a href={block.nextHref} className={sc.f9NextBtn} aria-label={block.nextLabel}>
                  {block.nextLabel}
                </a>
              ) : (
                <button type="button" className={sc.f9NextBtn} disabled aria-disabled>
                  Próximamente: {block.nextLabel}
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/** Registro de bloques: tipo → componente. */
export const BLOCK_REGISTRY: Record<
  StageBlock["type"],
  (props: BlockComponentProps) => React.ReactElement | null
> = {
  "spiral-viewer": SpiralViewerBlock,
  dialogue: DialogueBlock,
  paragraphs: ParagraphsBlock,
  "narrative-video": NarrativeVideoBlock,
  "criteria-infographic": CriteriaInfographicBlock,
  "comparison-example": ComparisonExampleBlock,
  "download-resource": DownloadResourceBlock,
  transition: TransitionBlock,
};

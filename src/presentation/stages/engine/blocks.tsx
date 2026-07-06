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

import { useCallback, useEffect, useState, useRef } from "react";
import LazyStageViewer from "@/components/stage/LazyStageViewer";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import { resolveMedia } from "@/content/shared/media-registry";
import type { ResolvedMedia } from "@/content/shared/media-registry";
import Modal from "./Modal";
import type { BlockContext, StageBlock, DesignCanvasData } from "./types";
import sc from "../stageClient.module.css";
import styles from "./engine.module.css";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";
import {
  FiTarget, FiEdit3, FiCpu, FiShield, FiFileText, FiCompass, FiHelpCircle,
  FiArrowRight, FiPlay, FiRotateCcw, FiDownload,
  FiCheckCircle, FiClock, FiAlertCircle, FiEye, FiMessageCircle, FiTool, FiSliders
} from "react-icons/fi";

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
        <LazyStageViewer enableRotation={!reduced} activeStage={block.activeStage} />
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
        media.kind === "image" || media.kind === "svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.videoEl}
            src={media.url}
            alt={media.description ?? ""}
            style={{ objectFit: "contain", background: "var(--uao-color-cream, #fbf5ec)", ...(block.maxHeight ? { maxHeight: block.maxHeight } : {}) }}
          />
        ) : (
          <video
            className={styles.videoEl}
            src={media.url}
            autoPlay
            muted
            loop
            preload="metadata"
            aria-label={media.description}
            style={block.maxHeight ? { maxHeight: block.maxHeight } : undefined}
          />
        )
      ) : (
        <div className={styles.videoFallback} role="img" aria-label={media.fallbackLabel}>
          <span className={styles.videoFallbackIcon} aria-hidden>
            <FiPlay />
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
      <UaoButton
        pill
        trailingIcon={<FiArrowRight />}
        data-guide-id={block.guideId ?? "etapa2-observar-criterios"}
        onClick={() => setOpen(true)}
      >
        {block.openLabel}
      </UaoButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={block.modalTitle ?? "Cómo se miran las posibilidades"}
        badge={block.modalBadge ?? "INFOGRAFÍA"}
        width="wide"
      >
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
      <UaoButton
        pill
        trailingIcon={<FiArrowRight />}
        data-guide-id={block.guideId ?? "etapa2-observar-ejemplo"}
        onClick={() => setOpen(true)}
      >
        {block.openLabel}
      </UaoButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={block.modalTitle ?? "Ejemplo demostrativo de comparación"}
        badge={block.modalBadge ?? "EJEMPLO"}
        width="wide"
      >
        <HostedInfographic media={media} />
      </Modal>
    </div>
  );
}

// ── InteractiveDesignCanvas (layout fijo; contenido vía DesignCanvasData) ────
const CANVAS_LAYOUT: {
  key: keyof Omit<DesignCanvasData, "citation" | "citationBadge">;
  number: number;
  icon: React.ReactNode;
  className: string;
}[] = [
  { key: "activities", number: 2, icon: <FiEdit3 />, className: "block2" },
  { key: "objective", number: 1, icon: <FiTarget />, className: "block1" },
  { key: "tools", number: 3, icon: <FiCpu />, className: "block3" },
  { key: "criticalThinking", number: 4, icon: <FiHelpCircle />, className: "block4" },
  { key: "ethics", number: 5, icon: <FiShield />, className: "block5" },
  { key: "evaluation", number: 6, icon: <FiFileText />, className: "block6" },
  { key: "followUp", number: 7, icon: <FiCompass />, className: "block7" },
];

function InteractiveDesignCanvas({ data }: { data: DesignCanvasData }) {
  return (
    <div className={styles.canvasContainer}>
      <div className={styles.canvasGrid}>
        {CANVAS_LAYOUT.map(({ key, number, icon, className }) => {
          const section = data[key];
          return (
            <div key={key} className={`${styles.canvasBlock} ${styles[className]}`}>
              <div className={styles.canvasBlockHeader}>
                <span className={styles.canvasBlockNumber}>{number}</span>
                <span className={styles.canvasBlockIcon}>{icon}</span>
                <h4 className={styles.canvasBlockTitle}>{section.title}</h4>
              </div>
              <div className={styles.canvasBlockContent}>
                {section.questions.map((q, i) => (
                  <div key={i} className={styles.canvasQuestionGroup}>
                    <h5 className={styles.canvasQuestion}>{q.question}</h5>
                    <p className={styles.canvasDescription}>{q.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.canvasCitation}>
        <span>{data.citation}</span>
        <strong>{data.citationBadge}</strong>
      </div>
    </div>
  );
}

// ── design-canvas ─────────────────────────────────────────────────────────────
function DesignCanvasBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "design-canvas") return null;
  return (
    <div className={styles.actionRow}>
      <UaoButton
        pill
        trailingIcon={<FiArrowRight />}
        data-guide-id={block.guideId ?? "etapa3-observar-canvas"}
        onClick={() => setOpen(true)}
      >
        {block.openLabel}
      </UaoButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={block.modalTitle ?? "Canvas de diseño de experiencia mediada por GenAI"}
        badge={block.modalBadge ?? "CANVAS"}
        width="wide"
      >
        <InteractiveDesignCanvas data={block.canvas} />
      </Modal>
    </div>
  );
}

// ── download-resource ─────────────────────────────────────────────────────────
function DownloadResourceBlock({ block }: BlockComponentProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
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

  const showPreview = block.previewEmbed && media.available && media.url;
  const previewMaxHeight = block.previewMaxHeight ?? "45dvh";
  const previewTitle = block.previewTitle ?? block.label;

  return (
    <div className={styles.downloadBlock}>
      <div className={styles.actionRow} style={{ flexWrap: "wrap", justifyContent: "center" }}>
        {showPreview && (
          <UaoButton
            pill
            leadingIcon={<FiEye />}
            onClick={() => setPreviewOpen(true)}
          >
            Ver vista previa
          </UaoButton>
        )}
        <UaoButton
          pill
          leadingIcon={<FiDownload />}
          data-guide-id={block.guideId ?? "etapa2-descargar-matriz"}
          disabled={!media.available}
          aria-disabled={!media.available}
          onClick={() => {
            if (!media.available || !media.url) return;
            handleDownload(media.url, media.downloadName);
            setConfirmOpen(true);
          }}
        >
          {block.label}
        </UaoButton>
        {!media.available ? (
          <p className={styles.downloadNote}>{media.fallbackLabel}</p>
        ) : null}
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        badge="VISTA PREVIA"
        width="wide"
      >
        <div className={styles.pdfPreviewFrame} style={{ height: "70vh", maxHeight: "none" }}>
          <object
            data={media.url!}
            type="application/pdf"
            className={styles.pdfPreviewObject}
            aria-label={previewTitle}
            title={previewTitle}
          >
            <iframe
              src={media.url!}
              className={styles.pdfPreviewObject}
              title={previewTitle}
              aria-label={previewTitle}
            />
          </object>
        </div>
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={block.confirmationTitle ?? "Descarga"}
        badge="DESCARGA"
      >
        <p className={styles.confirmText}>
          {block.confirmationText ?? "¡Matriz de Pugh descargada exitosamente!"}
        </p>
        <p className={styles.confirmSub}>
          {block.confirmationDescription ?? media.description}
        </p>
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

  // Cuando el video aún no está hosteado, el cierre (diálogo de LaIA + botón a la
  // siguiente etapa) debe quedar accesible sin pasos muertos: se omite el paso de
  // "Ver animación" y se muestra el modelo 3D con un aviso de "próximamente".
  const showVideoIntro = media.available && phase === "idle";
  const showVideo = media.available && phase === "playing";
  const showEnded = !media.available || phase === "ended";

  return (
    <div className={sc.f9Splash}>
      {showVideo && media.url ? (
        <video
          className={styles.videoEl}
          src={media.url}
          autoPlay
          muted
          onEnded={() => setPhase("ended")}
          aria-label={media.description}
        />
      ) : (
        <div className={sc.f9ModelWrap}>
          <LazyStageViewer enableRotation={!reduced} activeStage={block.activeStage ?? 2} />
        </div>
      )}

      {showVideoIntro ? (
        <UaoButton
          pill
          trailingIcon={<FiPlay />}
          data-guide-id={block.guideId ?? "etapa2-ver-animacion"}
          onClick={() => setPhase("playing")}
        >
          {block.playLabel ?? "Ver animación"}
        </UaoButton>
      ) : null}

      {showEnded ? (
        <>
          {media.available ? (
            <div className={sc.f9RepeatRow}>
              <UaoButton
                variant="ghost"
                size="sm"
                pill
                leadingIcon={<FiRotateCcw />}
                onClick={() => setPhase("idle")}
              >
                {block.repeatLabel ?? "Repetir animación"}
              </UaoButton>
            </div>
          ) : (
            <p className={styles.transitionNote}>
              <span className={styles.pendingTag}>Próximamente</span> {media.fallbackLabel}
            </p>
          )}

          <div className={sc.f9LaIAWrap}>
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
                <UaoButtonLink
                  href={block.nextHref}
                  pill
                  size="lg"
                  trailingIcon={<FiArrowRight />}
                  aria-label={block.nextLabel}
                >
                  {block.nextLabel}
                </UaoButtonLink>
              ) : (
                <UaoButton pill size="lg" disabled aria-disabled>
                  Próximamente: {block.nextLabel}
                </UaoButton>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

// ── checklist-board ───────────────────────────────────────────────────────────
function ChecklistBoardBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "checklist-board") return null;

  return (
    <div className={styles.actionRow}>
      <UaoButton
        pill
        trailingIcon={<FiArrowRight />}
        data-guide-id={block.guideId ?? "etapa4-observar-tablero"}
        onClick={() => setOpen(true)}
      >
        {block.openLabel}
      </UaoButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={block.modalTitle ?? "Tablero de preparación"}
        badge={block.modalBadge ?? "PREPARACIÓN"}
      >
        <div className={styles.checklistContainer}>
          <div className={styles.checklistGrid}>
            {block.items.map((item, i) => {
              let statusClass = styles.statusPending;
              let statusIcon = <FiClock aria-hidden />;
              if (item.status === "ready") {
                statusClass = styles.statusReady;
                statusIcon = <FiCheckCircle aria-hidden />;
              } else if (item.status === "review") {
                statusClass = styles.statusReview;
                statusIcon = <FiAlertCircle aria-hidden />;
              }

              return (
                <div key={i} className={styles.checklistCard}>
                  <div className={styles.checklistCardHeader}>
                    <span className={styles.checklistCategory}>{item.category}</span>
                    <span className={`${styles.checklistStatusBadge} ${statusClass}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {statusIcon}
                      {item.statusLabel}
                    </span>
                  </div>
                  <h4 className={styles.checklistCardTitle}>{item.title}</h4>
                  <p className={styles.checklistCardDesc}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── guided-scenario ───────────────────────────────────────────────────────────
function GuidedScenarioBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "guided-scenario") return null;
  const { scenario } = block;

  return (
    <div className={styles.actionRow}>
      <UaoButton
        pill
        trailingIcon={<FiArrowRight />}
        data-guide-id={block.guideId ?? "etapa4-observar-microcaso"}
        onClick={() => setOpen(true)}
      >
        {block.openLabel}
      </UaoButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={block.modalTitle ?? "Ejemplo de riesgo y recomendación"}
        badge={block.modalBadge ?? "MICROCASO"}
      >
        <div className={styles.scenarioContainer}>
          <div className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <span className={styles.scenarioIcon} aria-hidden>
                <FiAlertCircle />
              </span>
              <h3 className={styles.scenarioTitle}>{scenario.title}</h3>
            </div>
            
            <div className={styles.scenarioSection}>
              <span className={styles.scenarioLabel}>Situación:</span>
              <p className={styles.scenarioContentText}>{scenario.situation}</p>
            </div>
            
            <div className={styles.scenarioAlert}>
              <span className={styles.scenarioLabel} style={{ marginTop: "2px" }}>Riesgo:</span>
              <p className={styles.scenarioAlertText}>{scenario.risk}</p>
            </div>
            
            <div className={styles.scenarioSection}>
              <span className={styles.scenarioLabel}>Recomendación:</span>
              <p className={styles.scenarioContentText}>{scenario.recommendation}</p>
            </div>
            
            <div className={styles.scenarioSection} style={{ borderTop: "1px solid rgba(138, 20, 40, 0.08)", paddingTop: "12px" }}>
              <span className={styles.scenarioLabel}>Rol Docente:</span>
              <p className={styles.scenarioContentText} style={{ fontStyle: "italic" }}>{scenario.teacherRole}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── action-cards ──────────────────────────────────────────────────────────────
function ActionCardsBlock({ block }: BlockComponentProps) {
  if (block.type !== "action-cards") return null;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "guide": return <FiCompass />;
      case "observe": return <FiEye />;
      case "clarify": return <FiMessageCircle />;
      case "intervene": return <FiTool />;
      case "adjust": return <FiSliders />;
      case "protect": return <FiShield />;
      default: return <FiCheckCircle />;
    }
  };

  return (
    <div className={styles.actionCardsContainer}>
      {block.title ? <h3 className={styles.actionCardsTitle}>{block.title}</h3> : null}
      {block.description ? <p className={styles.actionCardsDesc}>{block.description}</p> : null}
      <div className={styles.actionCardsGrid}>
        {block.cards.map((card, idx) => (
          <div key={idx} className={styles.actionCard}>
            <div className={styles.actionCardIcon} aria-hidden>
              {getIcon(card.icon)}
            </div>
            <div className={styles.actionCardContent}>
              <h4 className={styles.actionCardTitle}>{card.title}</h4>
              <p className={styles.actionCardDesc}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── image-rail ────────────────────────────────────────────────────────────────
function ImageRailBlock({ block }: BlockComponentProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeMedia, setActiveMedia] = useState<{ media: ResolvedMedia; title: string } | null>(null);

  if (block.type !== "image-rail") return null;

  return (
    <div className={styles.imageRailContainer}>
      {block.title ? <h3 className={styles.imageRailTitle}>{block.title}</h3> : null}
      <div ref={viewportRef} className={styles.imageRailViewport}>
        <div className={styles.imageRailTrack}>
          {block.panels.map((panel) => {
            const media = resolveMedia(panel.mediaKey);
            return (
              <article key={panel.id} className={styles.imageRailCard}>
                  {(panel.label || panel.title || panel.description) && (
                    <div className={styles.imageRailCardInner}>
                      {panel.label ? (
                        <span className={styles.imageRailCardBadge}>{panel.label}</span>
                      ) : null}
                      {panel.title ? (
                        <h4 className={styles.imageRailCardTitle}>{panel.title}</h4>
                      ) : null}
                      {panel.description ? (
                        <p className={styles.imageRailCardDesc}>{panel.description}</p>
                      ) : null}
                    </div>
                  )}
                <div className={styles.imageRailCardMedia}>
                  {media.available && media.url ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                      <img
                        src={media.url}
                        alt={media.description ?? panel.title ?? "Evidencia"}
                        className={styles.imageRailImg}
                        loading="lazy"
                      />
                      <UaoButton
                        size="sm"
                        pill
                        onClick={() => setActiveMedia({ media, title: panel.title || "Evidencia" })}
                      >
                        Ampliar imagen
                      </UaoButton>
                    </div>
                  ) : (
                    <div className={styles.imageRailFallback}>
                      <span>{media.fallbackLabel}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <p className={styles.railScrollNote}>
        * Tip: Puedes desplazarte horizontalmente usando <strong>Shift + Rueda del ratón</strong> o deslizando lateralmente.
      </p>

      <Modal
        open={!!activeMedia}
        onClose={() => setActiveMedia(null)}
        title={activeMedia?.title ?? "Evidencia"}
        badge="EVIDENCIA"
        width="wide"
      >
        {activeMedia && <HostedInfographic media={activeMedia.media} />}
      </Modal>
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
  "design-canvas": DesignCanvasBlock,
  "download-resource": DownloadResourceBlock,
  transition: TransitionBlock,
  "checklist-board": ChecklistBoardBlock,
  "guided-scenario": GuidedScenarioBlock,
  "action-cards": ActionCardsBlock,
  "image-rail": ImageRailBlock,
};

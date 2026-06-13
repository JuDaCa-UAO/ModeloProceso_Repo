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

// ── criteria-infographic ──────────────────────────────────────────────────────
const CRITERIA = [
  { n: "1", title: "Apropiación docente", desc: "Si el docente puede usarla con confianza." },
  { n: "2", title: "Idoneidad pedagógica", desc: "Si aporta a la actividad y al aprendizaje." },
  { n: "3", title: "Ética y datos", desc: "Si cuida la privacidad y el uso responsable." },
  { n: "4", title: "Razonamiento crítico", desc: "Si favorece análisis, contraste y reflexión." },
  { n: "5", title: "Accesibilidad", desc: "Si puede ser comprendida y usada por distintos estudiantes." },
  { n: "6", title: "Integración / costo", desc: "Si es viable en el contexto real de uso." },
];

function CriteriaInfographicBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "criteria-infographic") return null;
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
        <h2 className={styles.infoTitle}>Cómo se miran las posibilidades</h2>
        <p className={styles.infoSubtitle}>
          Criterios para analizar herramientas de IA con sentido pedagógico
        </p>
        <ul className={styles.criteriaGrid}>
          {CRITERIA.map((c) => (
            <li key={c.n} className={styles.criteriaCard}>
              <span className={styles.criteriaNum} aria-hidden>
                {c.n}
              </span>
              <div>
                <p className={styles.criteriaTitle}>{c.title}</p>
                <p className={styles.criteriaDesc}>{c.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.infoFoot}>
          La IA no entra por moda, sino por <strong>pertinencia pedagógica</strong>,{" "}
          <strong>responsabilidad</strong> y <strong>posibilidad real de uso</strong>.
        </p>
      </Modal>
    </div>
  );
}

// ── comparison-example ────────────────────────────────────────────────────────
const COMPARISON_OPTIONS = [
  {
    n: "1",
    title: "Preparar argumentos",
    desc: "Genera preguntas y perspectivas para que los estudiantes construyan sus argumentos.",
  },
  {
    n: "2",
    title: "Revisar fuentes",
    desc: "Busca y resume fuentes confiables para apoyar la información del debate inicial.",
  },
  {
    n: "3",
    title: "Crear rúbrica",
    desc: "Genera criterios claros para evaluar los argumentos y la participación.",
  },
];
const COMPARISON_CRITERIA = [
  "Pertinencia pedagógica",
  "Cuidado ético",
  "Pensamiento crítico",
  "Facilidad de uso",
];

function ComparisonExampleBlock({ block }: BlockComponentProps) {
  const [open, setOpen] = useState(false);
  if (block.type !== "comparison-example") return null;
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
        <div className={styles.compCase}>
          <span className={styles.pill}>Caso docente</span>
          <h3 className={styles.compCaseTitle}>Fortalecer un debate</h3>
          <p className={styles.compCaseText}>
            La actividad necesita que los estudiantes preparen argumentos, contrasten posturas y
            revisen fuentes antes de participar.
          </p>
        </div>

        <p className={styles.infoSubtitle}>Tres posibilidades de IA para el mismo propósito</p>
        <ul className={styles.compOptions}>
          {COMPARISON_OPTIONS.map((o) => (
            <li key={o.n} className={styles.compCard}>
              <span className={styles.criteriaNum} aria-hidden>
                {o.n}
              </span>
              <p className={styles.criteriaTitle}>{o.title}</p>
              <p className={styles.criteriaDesc}>{o.desc}</p>
            </li>
          ))}
        </ul>

        <table className={styles.compTable}>
          <caption className={styles.compTableCaption}>Criterios de comparación</caption>
          <thead>
            <tr>
              <th scope="col">Criterio</th>
              {COMPARISON_OPTIONS.map((o) => (
                <th key={o.n} scope="col">
                  {o.n}. {o.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_CRITERIA.map((crit) => (
              <tr key={crit}>
                <th scope="row">{crit}</th>
                {COMPARISON_OPTIONS.map((o) => (
                  <td key={o.n} aria-hidden>
                    ●●●○
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.infoFoot}>
          La comparación es demostrativa: orienta la decisión según propósito, contexto y condiciones,
          no reemplaza el juicio docente.
        </p>
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

  const startAnimation = () => {
    if (media.available && media.url) setPhase("playing");
    else {
      ctx.pushToast(media.fallbackLabel);
      setPhase("ended");
    }
  };

  return (
    <div className={sc.f9Splash}>
      {phase !== "ended" ? (
        <>
          <div className={sc.f9ModelWrap}>
            {phase === "playing" && media.url ? (
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
          {phase === "idle" ? (
            <button type="button" className={sc.btnVerAnimacion} data-guide-id="etapa2-ver-animacion" onClick={startAnimation}>
              Ver animación →
            </button>
          ) : null}
        </>
      ) : (
        <>
          <div className={sc.f9RepeatRow}>
            <button type="button" className={sc.f9RepeatBtn} onClick={() => setPhase("idle")}>
              ↺ Repetir animación
            </button>
          </div>
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
      )}
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

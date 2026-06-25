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
import LazyStageViewer from "@/components/stage/LazyStageViewer";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import { resolveMedia } from "@/content/shared/media-registry";
import type { ResolvedMedia } from "@/content/shared/media-registry";
import Modal from "./Modal";
import type { BlockContext, StageBlock } from "./types";
import sc from "../stageClient.module.css";
import styles from "./engine.module.css";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";
import {
  FiTarget, FiEdit3, FiCpu, FiShield, FiFileText, FiCompass, FiHelpCircle,
  FiArrowRight, FiPlay, FiRotateCcw, FiDownload,
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
      >
        <HostedInfographic media={media} />
      </Modal>
    </div>
  );
}

// ── InteractiveDesignCanvas (HTML/CSS Stage 3) ──────────────────────────────
function InteractiveDesignCanvas() {
  return (
    <div className={styles.canvasContainer}>
      <div className={styles.canvasGrid}>
        
        {/* Block 2: Actividades académicas (Col 1, Row 1) */}
        <div className={`${styles.canvasBlock} ${styles.block2}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>2</span>
            <span className={styles.canvasBlockIcon}><FiEdit3 /></span>
            <h4 className={styles.canvasBlockTitle}>Actividades académicas</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué harán los estudiantes?</h5>
              <p className={styles.canvasDescription}>
                Describe tareas retadoras (proyectos, estudios de caso, debates, simulaciones) que los sitúen en el centro del aprendizaje, con protagonismo activo.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué estrategia didáctica usaré?</h5>
              <p className={styles.canvasDescription}>
                Indica si será aprendizaje basado en problemas, proyectos, aula invertida, etc. Estas estrategias deben alinear contenidos, objetivos y evaluación.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo y cuándo interviene la GenAI?</h5>
              <p className={styles.canvasDescription}>
                Explica los momentos y modos de participación de la IA: ideación, retroalimentación, edición, simulación, evaluación. Asegúrate de que complemente el esfuerzo cognitivo del estudiante, sin sustituirlo.
              </p>
            </div>
          </div>
        </div>

        {/* Block 1: Objetivo y propuesta de valor (Col 2, Row 1) */}
        <div className={`${styles.canvasBlock} ${styles.block1}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>1</span>
            <span className={styles.canvasBlockIcon}><FiTarget /></span>
            <h4 className={styles.canvasBlockTitle}>Objetivo y propuesta de valor</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué quiero lograr?</h5>
              <p className={styles.canvasDescription}>
                Formula la gran meta pedagógica (competencias, aprendizajes significativos). El objetivo debe trascender lo instrumental y apuntar a transformar al estudiante en sus dimensiones cognitivas y éticas.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cuál es el valor agregado de usar GenAI en esta experiencia?</h5>
              <p className={styles.canvasDescription}>
                Explica cómo la GenAI contribuye no solo a la eficiencia docente, sino también a enriquecer el proceso formativo del estudiante: más reflexión, creatividad, personalización, retroalimentación o apertura de perspectivas.
              </p>
            </div>
          </div>
        </div>

        {/* Block 3: Soluciones de GenAI seleccionadas (Col 3, Row 1) */}
        <div className={`${styles.canvasBlock} ${styles.block3}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>3</span>
            <span className={styles.canvasBlockIcon}><FiCpu /></span>
            <h4 className={styles.canvasBlockTitle}>Soluciones de GenAI seleccionadas</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué herramienta de GenAI usaré?</h5>
              <p className={styles.canvasDescription}>
                Especifica la herramienta elegida y justifica su pertinencia en la experiencia.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Para qué propósito específico?</h5>
              <p className={styles.canvasDescription}>
                Indica el uso pedagógico (ej.: lluvia de ideas, edición, generación de escenarios). Evita la adopción por moda.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cuál es el nivel de uso esperado (escala Perkins 1-5)?</h5>
              <p className={styles.canvasDescription}>
                Define el grado de integración permitido, desde &apos;No IA&apos; hasta &apos;Full IA&apos;. Esto da transparencia y evita el enfoque binario de prohibir/permitir.
              </p>
            </div>
          </div>
        </div>

        {/* Block 4: Razonamiento crítico y mediaciones (Col 1-2, Row 2) */}
        <div className={`${styles.canvasBlock} ${styles.block4}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>4</span>
            <span className={styles.canvasBlockIcon}><FiHelpCircle /></span>
            <h4 className={styles.canvasBlockTitle}>Razonamiento crítico y mediaciones</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué preguntas o reflexiones plantearé?</h5>
              <p className={styles.canvasDescription}>
                Integra retos de pensamiento crítico (sesgos, validez, alternativas). Estas preguntas convierten a la GenAI en detonador de reflexión y no en atajo cognitivo.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo promoveré que cuestionen y analicen lo generado por la IA?</h5>
              <p className={styles.canvasDescription}>
                Diseña actividades metacognitivas: discusión, contraste con fuentes, evaluación de calidad.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cuál será mi rol como docente?</h5>
              <p className={styles.canvasDescription}>
                Asume el papel de mediador y curador: enseña prompting, acompaña el análisis, modela el uso crítico y ético.
              </p>
            </div>
          </div>
        </div>

        {/* Block 5: Consideraciones éticas y de diseño responsable (Col 3, Row 2) */}
        <div className={`${styles.canvasBlock} ${styles.block5}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>5</span>
            <span className={styles.canvasBlockIcon}><FiShield /></span>
            <h4 className={styles.canvasBlockTitle}>Consideraciones éticas y de diseño responsable</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué reglas de uso comunicaré?</h5>
              <p className={styles.canvasDescription}>
                Define políticas claras: citación de IA, límites de ayuda permitida, responsabilidad individual.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo asegurar inclusión, equidad, privacidad y transparencia?</h5>
              <p className={styles.canvasDescription}>
                Integra principios éticos desde el diseño (UNESCO, Comisión Europea). Asegura acceso para todos y protección de datos.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué haré si un estudiante no usa GenAI?</h5>
              <p className={styles.canvasDescription}>
                Diseña rutas paralelas que aseguren aprendizaje equivalente, respetando convicciones personales.
              </p>
            </div>
          </div>
        </div>

        {/* Block 6: Mecanismos de evaluación y retroalimentación (Col 1-2, Row 3) */}
        <div className={`${styles.canvasBlock} ${styles.block6}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>6</span>
            <span className={styles.canvasBlockIcon}><FiFileText /></span>
            <h4 className={styles.canvasBlockTitle}>Mecanismos de evaluación y retroalimentación</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo evaluaré los aprendizajes?</h5>
              <p className={styles.canvasDescription}>
                La evaluación debe medir no solo el producto, sino el proceso y las decisiones críticas tomadas.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué criterios usaré (pensamiento crítico, creatividad, metacognición)?</h5>
              <p className={styles.canvasDescription}>
                Diseña instrumentos como rúbricas u otros que privilegien la reflexión, la originalidad y la justificación del uso de GenAI.
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo integraré la escala Perkins o rúbricas adaptadas?</h5>
              <p className={styles.canvasDescription}>
                Aplica escalas para evaluar el nivel de autonomía y reflexión en el uso de IA.
              </p>
            </div>
          </div>
        </div>

        {/* Block 7: Mecanismos de seguimiento y mejora continua (Col 3, Row 3) */}
        <div className={`${styles.canvasBlock} ${styles.block7}`}>
          <div className={styles.canvasBlockHeader}>
            <span className={styles.canvasBlockNumber}>7</span>
            <span className={styles.canvasBlockIcon}><FiCompass /></span>
            <h4 className={styles.canvasBlockTitle}>Mecanismos de seguimiento y mejora continua</h4>
          </div>
          <div className={styles.canvasBlockContent}>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Qué mecanismos de retroalimentación continua usaré?</h5>
              <p className={styles.canvasDescription}>
                Combina retroalimentación inmediata (GenAI, quizzes) y formativa (docente, pares).
              </p>
            </div>
            <div className={styles.canvasQuestionGroup}>
              <h5 className={styles.canvasQuestion}>¿Cómo verificaré el progreso y apoyaré a quienes lo necesiten?</h5>
              <p className={styles.canvasDescription}>
                Usa analítica de aprendizaje o revisión continua para detectar dificultades. Garantiza equidad y validez en estos mecanismos.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.canvasCitation}>
        <span>Modelo de proceso para la apropiación de la inteligencia artificial generativa en la formación docente de la Universidad Autónoma de Occidente. Peláez, C., Solano, A., Castillo, P., López J. (2026)</span>
        <strong>Creative Commons CC BY-NC-SA</strong>
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
        <InteractiveDesignCanvas />
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
          <LazyStageViewer enableRotation={!reduced} activeStage={block.activeStage ?? 2} />
        )}
      </div>

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
};

/**
 * PRESENTATION — Client Component (Stage Engine)
 *
 * Sistema de frames progresivos:
 *   - `completedFrames` cuenta cuántos frames han terminado.
 *   - Frame N se renderiza cuando completedFrames >= N-1.
 *   - El indicador de scroll aparece entre frames tan pronto termina el anterior.
 *   - Para añadir frames nuevos: renderizar condicionalmente con
 *     completedFrames >= N y llamar completeFrame(N) al terminar.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import Frame from "@/components/stage/Frame";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import HorizontalScrollRail from "@/components/stage/HorizontalScrollRail";
import StageViewer from "@/components/stage/StageViewer";
import ToastStack from "@/components/stage/ToastStack";
import type { Toast } from "@/components/stage/ToastStack";
import PauseMenu from "@/components/stage/PauseMenu";
import { writeProgress } from "@/lib/progress";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import { N8N_CONFIG } from "@/infrastructure/n8n/n8n.config";
import YouTubeNarrativePlayer from "@/components/youtube-narrative-player/YouTubeNarrativePlayer";
import { VIDEO_REGISTRY } from "@/content/shared/video-registry";
import BackgroundAudio from "@/components/audio/BackgroundAudio";
import styles from "./stageClient.module.css";
import blockStyles from "@/components/stage/blocks/blocks.module.css";
import {
  LAIA_INTRO_STEPS,
  F3_LAIA_STEPS,
  STAGE_RAIL_CARDS,
  F4_LAIA_STEPS,
  F5_LAIA_STEPS,
} from "@/content/dialogs/stage-0.dialogs";
import {
  F6_LAIA_STEPS,
  F7_LAIA_STEPS,
  ESTADO_CARDS,
  F8_LAIA_STEPS,
  F9_LAIA_STEPS,
} from "@/content/dialogs/stage-1.dialogs";

// ─── Persistencia del progreso de frames en localStorage ────────────────────────────
function frameProgressKey(stageId: string) {
  return `ai-tech-ed-frames-${stageId}`;
}
function readFrameProgress(stageId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = window.localStorage.getItem(frameProgressKey(stageId));
    const n = parseInt(v ?? "", 10);
    return isNaN(n) || n < 0 ? 0 : n;
  } catch {
    return 0;
  }
}
function saveFrameProgress(stageId: string, n: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(frameProgressKey(stageId), String(n));
  } catch { /* quota exceeded — silently ignore */ }
}

// ─── Sub-componente: indicador de scroll entre frames ──────────────────────

function ScrollHint({ label }: { label?: string }) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const frame = (e.currentTarget as HTMLElement).closest('section');
    const next = frame?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <button
      type="button"
      className={styles.scrollHint}
      onClick={handleClick}
      aria-label="Ir al siguiente paso"
    >
      <span className={styles.scrollArrow} aria-hidden>▼</span>
    </button>
  );
}

// Contenido (textos de Laia, rail y tarjetas) movido a archivos por etapa:
//   etapa-0 -> @/content/dialogs/stage-0.dialogs
//   etapa-1 -> @/content/dialogs/stage-1.dialogs

// ─── Props ────────────────────────────────────────────────────────────────────

type StageClientProps = {
  stageId: string;
  stageName: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StageClient({ stageId, stageName }: StageClientProps) {
  const isEtapa0 = stageId === "etapa-0";

  // ── Estado principal ──────────────────────────────────────────────────────
  const [completedFrames, setCompletedFrames] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);
  /**
   * notifiedFrames: frames para los que ya se enviaron las notificaciones toast.
   * Evita que pulsar "Siguiente" varias veces al final del diálogo acumule toasts.
   */
  const notifiedFrames = useRef(new Set<number>());

  const pushToast = useCallback((text: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * f3Phase: fase interna del Frame 3.
   *   'initial'     → model visible + botón "Continuar"
   *   'laia-model'  → model visible + LaiaChatBar Fase A
   *   'laia-viewer' → model oculto + StageViewer fijo + LaiaChatBar Fase B
   */
  const [f3Phase, setF3Phase] = useState<"initial" | "laia-model" | "laia-viewer">("initial");

  /**
   * f5Phase: fase interna del Frame 5.
   *   'intro'       → diálogo inicial visible, botón chatbot oculto
   *   'show-button' → diálogo completado, botón chatbot visible + pulsando
   *   'after-chat'  → chatbot usado, diálogo muestra "Continuemos"
   */
  const [f5Phase, setF5Phase] = useState<"intro" | "show-button" | "after-chat">("intro");
  /** chatbotOpen: panel de chat visible */
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // ── Frame 6: formulario de consentimiento ─────────────────────────────────
  const [consentAdmin, setConsentAdmin] = useState(false);
  const [consentUsage, setConsentUsage] = useState(false);
  const [consentEmail, setConsentEmail] = useState("");
  /** Muestra error de validación solo si el usuario ya intentó enviar */
  const [consentTouched, setConsentTouched] = useState(false);
  const consentValid =
    consentAdmin && consentUsage && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consentEmail);

  // ── Frame 8: autodiagnóstico ───────────────────────────────────────────────
  /** true cuando el usuario confirma que completó el formulario embebido */
  const [autodiagDone, setAutodiagDone] = useState(false);

  // ── Frame 9: transición ──────────────────────────────────────────────────
  /** true cuando el video de transición terminó de reproducirse */
  const [f9VideoEnded, setF9VideoEnded] = useState(false);
  /** true cuando el usuario solicitó reproducir el video de transición */
  const [f9VideoPlaying, setF9VideoPlaying] = useState(false);

  // ── Hidratación desde localStorage ────────────────────────────────────────
  // Seguro porque page.tsx usa dynamic({ ssr: false }) — no hay SSR de este
  // componente, así que no puede haber hydration mismatch.
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved <= 0) return;
    notifiedFrames.current = new Set(Array.from({ length: saved }, (_, i) => i + 1));
    setCompletedFrames(saved);
    if (stageId === "etapa-0") {
      // Restauración para etapa-0 (frames 1-4)
      if (saved >= 2) setF3Phase("laia-viewer");
      if (saved >= 4) setF5Phase("after-chat");
    } else {
      // Restauración para etapa-1 (frames renumerados 1-5)
      if (saved >= 2) {
        setConsentAdmin(true);
        setConsentUsage(true);
      }
      if (saved >= 4) setAutodiagDone(true);
      if (saved >= 5) { setF9VideoEnded(true); setF9VideoPlaying(false); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapa/${stageId}` });
  }, [stageId]);

  /**
   * Marca el frame N como terminado y lo persiste en localStorage.
   * Seguro llamarlo más de una vez (usa Math.max).
   */
  const completeFrame = useCallback((frameIndex: number) => {
    setCompletedFrames((prev) => {
      const next = Math.max(prev, frameIndex);
      if (next > prev) saveFrameProgress(stageId, next);
      return next;
    });
  }, [stageId]);

  const handleStartVideo = useCallback(() => setVideoPlaying(true), []);

  const handleVideoEnded = useCallback(() => {
    setVideoPlaying(false);
    completeFrame(1);
    if (!notifiedFrames.current.has(1)) {
      notifiedFrames.current.add(1);
      pushToast("\u00a1Proceso guardado!");
    }
  }, [completeFrame, pushToast]);

  return (
    <div className={styles.root}>
      {(stageId === "etapa-0" || stageId === "etapa-1") && (
        <BackgroundAudio src="/audio/fondo.ogg" />
      )}
      <TechTrailBackground className={styles.background} />
      <PauseMenu open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />



      {/* ═══ FRAMES 1-4: Solo en etapa-0 ══════════════════════ */}
      {isEtapa0 ? (
        <>
          {/* ═══ FRAME 1: Bienvenida con Laia ══════════════════════ */}
          <Frame
            id="frame-intro"
            sectionTitle="Sección 1: Bienvenido a esta iteración"
            stageTitle="Introducción: Bienvenido a esta iteración"
            backgroundImage="/ui/backgroundUAO.png"
            overlay="rgba(4, 2, 3, 0.45)"
            hint={completedFrames >= 1 ? <ScrollHint label="Iniciar recorrido" /> : null}
          >
            <CharacterStepDialog
              steps={LAIA_INTRO_STEPS}
              characterName="Laia"
              nextLabel="Siguiente"
              onComplete={() => {
                completeFrame(1);
                if (!notifiedFrames.current.has(1)) {
                  notifiedFrames.current.add(1);
                  pushToast("\u00a1Proceso guardado!");
                }
              }}
            />
          </Frame>

          {/*
       * ─────────────────────────────────────────────────────────────────
       * PARA AÑADIR UN FRAME NUEVO:
       *
       *   {completedFrames >= N ? (
       *     <Frame id="frame-N" sectionTitle="Sección N+1: ..." ...>
       *       ...contenido...
       *       <button onClick={() => completeFrame(N+1)}>Siguiente</button>
       *     </Frame>
       *   ) : null}
       *
       * ─────────────────────────────────────────────────────────────────
       */}

          {/* ═══ FRAME 2: Tu lugar en el modelo ════════════════════════════ */}
          {completedFrames >= 1 ? (
            <>
              {/* Viewer fijo top-right — aparece en fase B y se mantiene permanente */}
              {(isEtapa0 ? f3Phase === "laia-viewer" : true) ? (
                <MiniSpiralViewer stageLabel={isEtapa0 ? "Etapa actual: Etapa 0" : "Etapa actual: Etapa 1"} stageKey={isEtapa0 ? "etapa-0" : "etapa-1"} />
              ) : null}

              <Frame
                id="frame-modelo-interactivo"
                sectionTitle="Sección 2: Tu lugar en el modelo"
                backgroundImage="/ui/backgroundUAO.png"
                overlay="rgba(4, 2, 3, 0.45)"
                hint={completedFrames >= 2 ? <ScrollHint label="Continuar" /> : null}
              >
                {/* Fase A y B: modelo visible solo mientras no estamos en viewer */}
                {f3Phase !== "laia-viewer" ? (
                  <>
                    <div className={styles.modelStageCompact}>
                      <StageViewer enableRotation />
                    </div>
                    <p className={styles.frameInstructions}>
                      Puedes interactuar con el modelo usando el scroll para acercarte y
                      arrastrando con el click presionado para girarlo.
                    </p>
                    {f3Phase === "initial" ? (
                      <div className={styles.frameActions}>
                        <button
                          className={styles.btnVerAnimacion}
                          onClick={() => setF3Phase("laia-model")}
                        >
                          Continuar →
                        </button>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {/* Diálogo de Laia — misma apariencia que Frame 1, empujado al fondo */}
                {f3Phase !== "initial" ? (
                  <div className={styles.laiaSlot}>
                    <CharacterStepDialog
                      size="compact"
                      density="tight"
                      steps={F3_LAIA_STEPS}
                      onStepChange={(idx) => {
                        if (idx === 1) setF3Phase("laia-viewer");
                        else setF3Phase("laia-model");
                      }}
                      onComplete={() => {
                        completeFrame(2);
                        if (!notifiedFrames.current.has(2)) {
                          notifiedFrames.current.add(2);
                          pushToast("\u00a1Proceso guardado!");
                          pushToast("Ahora puedes acceder a cualquier etapa desde el men\u00fa principal");
                        }
                      }}
                    />
                  </div>
                ) : null}
              </Frame>
            </>
          ) : null}

          {/* ═══ FRAME 3: Familiárizándote con el modelo ══════════════════ */}
          {completedFrames >= 2 ? (
            <Frame
              id="frame-rail"
              sectionTitle="Sección 3: Familiárizándote con el modelo"
              backgroundImage="/ui/backgroundUAO.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={completedFrames >= 3 ? <ScrollHint label="¡Continuemos!" /> : null}
            >
              <HorizontalScrollRail panels={STAGE_RAIL_CARDS} />

              {/* Diálogo de Laia — empujado al fondo del frame */}
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F4_LAIA_STEPS}
                  onComplete={() => {
                    completeFrame(3);
                    if (!notifiedFrames.current.has(3)) {
                      notifiedFrames.current.add(3);
                      pushToast("\u00a1Proceso guardado!");
                    }
                  }}
                />
              </div>
            </Frame>
          ) : null}

          {/* ═══ FRAME 4: Asistencia guiada ═══════════════════════════════ */}
          {completedFrames >= 3 ? (
            <Frame
              id="frame-asistencia"
              sectionTitle="Sección 4: Asistencia guiada"
              backgroundImage="/ui/backgroundUAO.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={null}
            >
              {/* Diálogo de Laia — cambia tras usar el chatbot */}
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F5_LAIA_STEPS}
                  disableNext={f5Phase === "show-button"}
                  onBeforeNext={(idx) => {
                    if (idx === 0 && f5Phase === "intro") {
                      setF5Phase("show-button");
                      return false;
                    }
                    return true;
                  }}
                  onComplete={() => {
                    completeFrame(4);
                    if (!notifiedFrames.current.has(4)) {
                      notifiedFrames.current.add(4);
                      pushToast("\u00a1Proceso guardado!");
                    }
                  }}
                />
              </div>

              {/* Botón CTA — visible al completar frame 5 */}
              {completedFrames >= 4 ? (
                <div className={styles.f9NextRow}>
                  <a
                    href="/etapa/etapa-1"
                    className={styles.f9NextBtn}
                    aria-label="Ir a la siguiente etapa"
                  >
                    Ir a la siguiente etapa
                  </a>
                </div>
              ) : null}
            </Frame>
          ) : null}

        </>
      ) : null}

      {/* ═══ FRAMES 1-5: Solo en etapa-1 ══════════════════════ */}
      {!isEtapa0 ? (
        <>
          {/* Viewer fijo top-right — visible en toda la etapa-1 */}
          <MiniSpiralViewer stageLabel="Etapa actual: Etapa 1" stageKey="etapa-1" />

          {/* ═══ FRAME 1 (etapa-1): Interactúa con tu entorno ══════ */}
          {completedFrames >= 0 ? (
            <Frame
              id="frame-modelo"
              sectionTitle="Sección 1: Reconociendo nuestros pasos"
              stageTitle="Etapa 1: Reconócete para avanzar"
              backgroundImage="/ui/backgroundUAO.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={completedFrames >= 1 ? <ScrollHint label="¡Avancemos!" /> : null}
            >
              {videoPlaying ? (
                <YouTubeNarrativePlayer
                  videoId={VIDEO_REGISTRY.introModelo.videoId}
                  startSeconds={VIDEO_REGISTRY.introModelo.startSeconds}
                  autoplay
                  onEnded={handleVideoEnded}
                  className={styles.ytIntro}
                />
              ) : (
                <>
                  <div className={styles.modelStage}>
                    <StageViewer enableRotation />
                  </div>
                  <p className={styles.frameInstructions}>
                    Puedes interactuar con el modelo usando el scroll para acercarte y
                    arrastrando con el click presionado para girarlo.
                  </p>
                  {completedFrames < 1 ? (
                    <div className={styles.frameActions}>
                      <button className={styles.btnVerAnimacion} onClick={handleStartVideo}>
                        Ver animación →
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </Frame>
          ) : null}

          {/* ═══ FRAME 2 (etapa-1): Condiciones de confianza ════════ */}
          {completedFrames >= 1 ? (
            <Frame
              id="frame-consentimiento"
              sectionTitle="Sección 2: Condiciones de confianza"
              backgroundImage="/ui/fondo_biblioteca.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={completedFrames >= 2 ? <ScrollHint label="Iniciar diagnóstico" /> : null}
            >
              {/* Formulario de consentimiento */}
              {completedFrames < 2 ? (
                <form
                  className={blockStyles.formCard}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className={blockStyles.stageCopy}>
                    <p>Este ejercicio es individual, objetivo y confidencial.</p>
                    <p>No tiene efectos administrativos. Su único propósito es orientar el camino formativo.</p>
                  </div>

                  <label className={blockStyles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={consentAdmin}
                      onChange={(e) => setConsentAdmin(e.target.checked)}
                    />
                    <span>Entiendo que no es una evaluación administrativa.</span>
                  </label>

                  <label className={blockStyles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={consentUsage}
                      onChange={(e) => setConsentUsage(e.target.checked)}
                    />
                    <span>Acepto que mis respuestas se usen para generar mi resultado y recomendaciones.</span>
                  </label>

                  <label className={blockStyles.fieldLabel} htmlFor="consent-email">
                    Correo para enviarte el resultado
                  </label>
                  <input
                    id="consent-email"
                    type="email"
                    className={blockStyles.textInput}
                    placeholder="docente@uao.edu.co"
                    value={consentEmail}
                    onChange={(e) => setConsentEmail(e.target.value)}
                    autoComplete="email"
                  />

                  {consentTouched && !consentValid ? (
                    <p className={blockStyles.errorText}>
                      Completa los dos consentimientos e ingresa un correo válido para continuar.
                    </p>
                  ) : null}

                  <div className={blockStyles.actionRow}>
                    <button
                      type="button"
                      className={styles.btnVerAnimacion}
                      onClick={() => {
                        setConsentTouched(true);
                        if (!consentValid) return;
                        completeFrame(2);
                        if (!notifiedFrames.current.has(2)) {
                          notifiedFrames.current.add(2);
                          pushToast("\u00a1Proceso guardado!");
                        }
                      }}
                    >
                      Iniciar autodiagnóstico →
                    </button>
                  </div>
                </form>
              ) : (
                <div className={blockStyles.formCard}>
                  <div className={blockStyles.stageCopy}>
                    <p>Ya diste tu consentimiento. El autodiagnóstico está habilitado.</p>
                  </div>
                </div>
              )}

              {/* Diálogo de Laia al fondo */}
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F6_LAIA_STEPS}
                />
              </div>
            </Frame>
          ) : null}

          {/* ═══ FRAME 3 (etapa-1): Estados iniciales ═══════════════ */}
          {completedFrames >= 2 ? (
            <Frame
              id="frame-estados"
              sectionTitle="Sección 3: Estados iniciales"
              backgroundImage="/ui/fondo_biblioteca.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={completedFrames >= 3 ? <ScrollHint label="Continuar" /> : null}
            >
              {/* Grid de 3 tarjetas */}
              <div className={blockStyles.stateGrid}>
                {ESTADO_CARDS.map((card) => (
                  <div key={card.label} className={blockStyles.stateCard}>
                    <span className={blockStyles.stateHierarchy}>{card.label}</span>
                    <p className={blockStyles.stateTitle}>{card.title}</p>
                    <p className={blockStyles.stateDesc}>{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Diálogo de Laia al fondo */}
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F7_LAIA_STEPS}
                  onComplete={() => {
                    completeFrame(3);
                    if (!notifiedFrames.current.has(3)) {
                      notifiedFrames.current.add(3);
                      pushToast("¡Proceso guardado!");
                    }
                  }}
                />
              </div>
            </Frame>
          ) : null}

          {/* ═══ FRAME 4 (etapa-1): Autodiagnóstico ═════════════─── */}
          {completedFrames >= 3 ? (
            <Frame
              id="frame-autodiagnostico"
              sectionTitle="Sección 4: Autodiagnóstico"
              backgroundImage="/ui/fondo_biblioteca.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={completedFrames >= 4 ? <ScrollHint label="Continuar" /> : null}
            >
              {/* Iframe embebido con marco futurista */}
              <div className={styles.embedShell}>
                {/* Esquinas decorativas */}
                <span className={styles.embedCornerTL} aria-hidden />
                <span className={styles.embedCornerTR} aria-hidden />
                <span className={styles.embedCornerBL} aria-hidden />
                <span className={styles.embedCornerBR} aria-hidden />

                {/* Barra de cabecera */}
                <div className={styles.embedHeader}>
                  <span className={styles.embedHeaderDot} />
                  <span className={styles.embedHeaderDot} />
                  <span className={styles.embedHeaderDot} />
                  <span className={styles.embedHeaderLabel}>AUTODIAGNÓSTICO — ETAPA 1</span>
                </div>

                {/* El iframe */}
                <div className={styles.embedViewport}>
                  <iframe
                    src={N8N_CONFIG.forms.autodiagnostic || undefined}
                    title="Autodiagnóstico Etapa 1"
                    className={styles.embedIframe}
                    loading="lazy"
                    sandbox="allow-forms allow-scripts allow-same-origin"
                  />
                </div>

                {/* Barra inferior con escanlines decorativos */}
                <div className={styles.embedFooter}>
                  <span className={styles.embedFooterStatus}>
                    {autodiagDone ? "\u2713 Completado" : "Pendiente de respuesta"}
                  </span>
                </div>
              </div>

              {/* Diálogo de Laia — cambia tras completar */}
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F8_LAIA_STEPS}
                  onStepChange={(idx) => {
                    if (idx === 1) setAutodiagDone(true);
                    else setAutodiagDone(false);
                  }}
                  onComplete={() => {
                    completeFrame(4);
                    if (!notifiedFrames.current.has(4)) {
                      notifiedFrames.current.add(4);
                      pushToast("¡Proceso guardado!");
                    }
                  }}
                  nextLabel={!autodiagDone ? "Autodiagnóstico completado" : "Siguiente"}
                />
              </div>
            </Frame>
          ) : null}

          {/* ═══ FRAME 5 (etapa-1): Transición ══════════════───── */}
          {completedFrames >= 4 ? (
            <Frame
              id="frame-transicion"
              sectionTitle="Sección 5: Transición"
              backgroundImage="/ui/backgroundUAO.png"
              overlay="rgba(4, 2, 3, 0.45)"
              hint={null}
            >
              {/* ——— Reproductor de video ——— */}
              {f9VideoPlaying && !f9VideoEnded ? (
                <YouTubeNarrativePlayer
                  videoId={VIDEO_REGISTRY.transicionE1aE2.videoId}
                  startSeconds={VIDEO_REGISTRY.transicionE1aE2.startSeconds}
                  autoplay
                  onEnded={() => setF9VideoEnded(true)}
                  className={styles.ytTransicion}
                />
              ) : !f9VideoEnded ? (
                /* Pantalla inicial: modelo grande + botón ver animación */
                <div className={styles.f9Splash}>
                  <div className={styles.f9ModelWrap}>
                    <StageViewer enableRotation />
                  </div>
                  <button
                    className={styles.btnVerAnimacion}
                    onClick={() => setF9VideoPlaying(true)}
                  >
                    Ver animación →
                  </button>
                </div>
              ) : null}

              {/* ——— Post-video: Laia protagonista + botón siguiente etapa ——— */}
              {f9VideoEnded ? (
                <>
                  {/* Botón repetir — discréto, arriba */}
                  <div className={styles.f9RepeatRow}>
                    <button
                      className={styles.f9RepeatBtn}
                      onClick={() => { setF9VideoEnded(false); setF9VideoPlaying(true); }}
                    >
                      ↺ Repetir animación
                    </button>
                  </div>

                  {/* Diálogo de Laia a tamaño protagonista */}
                  <div className={styles.f9LaiaWrap}>
                    <CharacterStepDialog
                      steps={F9_LAIA_STEPS}
                      size="default"
                      density="standard"
                      showAudioButton
                      onComplete={() => {
                        completeFrame(5);
                        if (!notifiedFrames.current.has(5)) {
                          notifiedFrames.current.add(5);
                        }
                      }}
                    />
                  </div>

                  {/* Botón ir a Etapa 2 — solo visible tras completar el diálogo */}
                  {completedFrames >= 5 ? (
                    <div className={styles.f9NextRow}>
                      <a
                        href="/inicio"
                        className={styles.f9NextBtn}
                        aria-label="Ir a la siguiente etapa"
                      >
                        Ir a la siguiente etapa
                      </a>
                    </div>
                  ) : null}
                </>
              ) : null}
            </Frame>
          ) : null}

        </>
      ) : null}

      {/* ═══ Floating ChatBot button — fijo abajo-derecha ════─── */}
      {(isEtapa0 ? f5Phase !== "intro" : true) ? (
        <>
          <button
            type="button"
            className={[
              styles.chatbotBtn,
              f5Phase === "show-button" && !chatbotOpen ? styles.chatbotBtnAttract : "",
              chatbotOpen ? styles.chatbotBtnPulseClose : "",
            ].join(" ")}
            onClick={() => {
              if (chatbotOpen) {
                setChatbotOpen(false);
                if (f5Phase === "show-button") {
                  setF5Phase("after-chat");
                }
              } else {
                setChatbotOpen(true);
              }
            }}
          >
            <Image
              src="/ui/Laia-Icon.png"
              alt="Chat con Laia"
              width={44}
              height={44}
              unoptimized
              className={styles.chatbotBtnIcon}
            />
          </button>

          {/* Panel de chat desplegable */}
          {chatbotOpen ? (
            <div className={styles.chatPanel}>
              <div className={styles.chatPanelInner}>
                <div className={styles.chatBubble}>
                  <p className={styles.chatTitle}>Hola, soy Laia.</p>
                  <p className={styles.chatBody}>
                    Este chatbot está aquí para acompañarte durante tu recorrido
                    por la cartilla web. Puedes acudir a mí si necesitas aclarar
                    algo puntual, entender mejor una parte de la página o
                    profundizar en algún aspecto del modelo de proceso. Mi
                    alcance se limita a esta experiencia: puedo explicarte el
                    modelo, sus etapas, sus estados y el funcionamiento de la
                    cartilla, pero no responder preguntas por fuera de este
                    contexto.{" "}
                    <strong>
                      Siempre que lo necesites, estaré aquí para orientarte.
                    </strong>
                  </p>
                </div>
                <div className={styles.chatInputRow}>
                  <Image
                    src="/ui/Laia-Icon.png"
                    alt="Laia"
                    width={36}
                    height={36}
                    className={styles.chatAvatar}
                  />
                  <input
                    className={styles.chatInput}
                    placeholder="Escribe un mensaje…"
                    disabled
                  />
                  <button className={styles.chatSendBtn} disabled aria-label="Enviar">
                    <IoSend size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

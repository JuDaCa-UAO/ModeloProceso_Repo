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
import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import HorizontalScrollRail from "@/components/stage/HorizontalScrollRail";
import type { RailPanel } from "@/types/stage";
import StageViewer from "@/components/stage/StageViewer";
import ToastStack from "@/components/stage/ToastStack";
import type { Toast } from "@/components/stage/ToastStack";
import PauseMenu from "@/components/stage/PauseMenu";
import { writeProgress } from "@/lib/progress";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import Image from "next/image";
import styles from "./stageClient.module.css";
import blockStyles from "@/components/stage/blocks/blocks.module.css";

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
  return (
    <div className={styles.scrollHint} aria-label="Desplázate hacia abajo">
      <span className={styles.scrollArrow} aria-hidden>▼</span>
      {label ? <span className={styles.scrollLabel}>{label}</span> : null}
    </div>
  );
}

// ─── Contenido del diálogo de Laia — Frame 1 ─────────────────────────────────

const LAIA_INTRO_STEPS: CharacterDialogStep[] = [
  {
    text: "Bienvenido/a. Este recorrido te guiará por un modelo por etapas para integrar GenAI en experiencias de aprendizaje. Avanzaremos de forma estructurada: reconocer tu punto de partida, explorar posibilidades, diseñar con propósito, preparar el terreno, desplegar en el aula y evaluar para mejorar.",
    imgSrc: "/ui/laia.png",
  },
  {
    text: "Este modelo se recorre por etapas. Cada una cumple una función distinta dentro del proceso y te ayudará a avanzar con mayor claridad y sentido pedagógico.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Contenido de CharacterStepDialog — Frame 3 Fase A (modelo visible) ──────────────

const F3_LAIA_STEPS_A: CharacterDialogStep[] = [
  {
    text: "Comenzamos en la primera etapa: Reconócete para avanzar. Aquí establecerás tu punto de partida para orientar el resto del recorrido.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Contenido de CharacterStepDialog — Frame 3 Fase B (viewer visible) ──────────────

const F3_LAIA_STEPS_B: CharacterDialogStep[] = [
  {
    text: "A partir de ahora podrás ver siempre en qué etapa del modelo te encuentras. Cuando termines esta introducción, también podrás acceder al resto de etapas desde la pantalla principal.",
    imgSrc: "/ui/laia.png",
  },
];

// ─── Rail de etapas — Frame 4 ──────────────────────────────────────────────

const STAGE_RAIL_CARDS: RailPanel[] = [
  {
    id: "rail-etapa-1",
    label: "Etapa 1",
    title: "Recónócete para avanzar",
    lines: [
      "Identifica tu punto de partida con un autodiagnóstico individual y formativo.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-2",
    label: "Etapa 2",
    title: "Descubre nuevas posibilidades",
    lines: [
      "Explora opciones de GenAI para apoyar una actividad real de tu docencia con criterio pedagógico y ético.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-3",
    label: "Etapa 3",
    title: "Diseña con propósito",
    lines: [
      "Transforma lo explorado en una experiencia de aprendizaje estructurada, coherente y mediada por GenAI.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-4",
    label: "Etapa 4",
    title: "Prepara el terreno para el éxito",
    lines: [
      "Convierte el diseño en condiciones operativas, logísticas y pedagógicas para un despliegue fluido y seguro.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-5",
    label: "Etapa 5",
    title: "Hazlo realidad en el aula",
    lines: [
      "Pon en práctica lo diseñado con criterio pedagógico y atención a la experiencia real de cada estudiante.",
      "",
    ],
    kind: "stage",
  },
  {
    id: "rail-etapa-6",
    label: "Etapa 6",
    title: "Reflexiona, aprende y mejora",
    lines: [
      "Analiza los resultados, recoge evidencias y ajusta tu práctica para fortalecer el aprendizaje mediado por GenAI.",
      "",
    ],
    kind: "stage",
  },
];

// ─── Diálogo de Laia — Frame 4 ──────────────────────────────────────────────

const F4_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Este recorrido no es lineal ni rígido. Cada etapa te ayudará a avanzar con mayor claridad, y podrás volver sobre ellas cuando lo necesites.",
    imgSrc: "/ui/laia.png",
  },
];

// ─── Diálogo de Laia — Frame 5 ──────────────────────────────────────────────

const F5_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "\u201cOh, \u00a1es verdad! Podr\u00e9 asistirte cada vez que lo necesites. Si quieres apoyo adicional, puedes usar este chatbot. Te explicar\u00e9 qu\u00e9 puede hacer, qu\u00e9 no puede hacer y cu\u00e1ndo te puede ayudar.\u201d",
    imgSrc: "/ui/laia.png",
  },
];

const F5_LAIA_COMPLETE_STEPS: CharacterDialogStep[] = [
  {
    text: "\u00a1Continuemos! Ya sabes que puedes contar con mi apoyo en cualquier momento del recorrido.",
    imgSrc: "/ui/laia.png",
  },
];

// ─── Diálogo de Laia — Frame 6 ──────────────────────────────────────────────

const F6_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "Tus respuestas son confidenciales y se usan únicamente para orientar este recorrido. No es un examen, ni tiene efectos administrativos. Si necesitas apoyo adicional, puedes usar el chatbot. Te explicaré qué puede hacer, qué no puede hacer y cuándo te puede ayudar.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Diálogo de Laia — Frame 7 ──────────────────────────────────────────────

const F7_LAIA_STEPS: CharacterDialogStep[] = [
  {
    text: "A lo largo de este proceso podrás reconocer en qué estado te encuentras frente al uso de la IA. Estos estados no son etiquetas ni juicios de valor: son puntos de referencia que ayudan a orientar tu recorrido. El autodiagnóstico permitirá identificar tu punto de partida dentro del modelo.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Tarjetas de estados — Frame 7 ──────────────────────────────────────────

const ESTADO_CARDS = [
  {
    label: "Inicial",
    title: "Aprendiendo sin miedo",
    desc: "Primeras aproximaciones con curiosidad y necesidad de guía clara. Recibirás apoyo más guiado, ejemplos listos para adaptar y recomendaciones paso a paso.",
  },
  {
    label: "Intermedio",
    title: "Explorando con propósito",
    desc: "Ya experimentas con intención educativa y buscas mayor coherencia pedagógica. Recibirás recomendaciones para fortalecer decisiones didácticas, críticas y éticas.",
  },
  {
    label: "Avanzado",
    title: "Innovando e inspirando",
    desc: "Integras GenAI de forma crítica, creativa y estratégica en distintos contextos. Recibirás retos de mayor profundidad y oportunidades para compartir aprendizajes.",
  },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

type StageClientProps = {
  stageId: string;
  stageName: string;
  initialTree: unknown[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StageClient({ stageId, stageName }: StageClientProps) {
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

  // ── Hidratación desde localStorage ────────────────────────────────────────
  // Seguro porque page.tsx usa dynamic({ ssr: false }) — no hay SSR de este
  // componente, así que no puede haber hydration mismatch.
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved <= 0) return;
    notifiedFrames.current = new Set(Array.from({ length: saved }, (_, i) => i + 1));
    setCompletedFrames(saved);
    if (saved >= 3) setF3Phase("laia-viewer");
    if (saved >= 5) setF5Phase("after-chat");
    if (saved >= 6) {
      // Frame 6 ya completado: marcar consentimientos como aceptados
      setConsentAdmin(true);
      setConsentUsage(true);
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
    completeFrame(2);
    if (!notifiedFrames.current.has(2)) {
      notifiedFrames.current.add(2);
      pushToast("\u00a1Proceso guardado!");
    }
  }, [completeFrame, pushToast]);

  return (
    <div className={styles.root}>
      <TechTrailBackground className={styles.background} />
      <PauseMenu open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* ═══ FRAME 1: Bienvenida con Laia ══════════════════════════════ */}
      <Frame
        id="frame-intro"
        sectionTitle={`Sección 1: ${stageName}`}
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

      {/* ═══ FRAME 2: Modelo 3D interactivo ════════════════════════════ */}
      {completedFrames >= 1 ? (
        <Frame
          id="frame-modelo"
          sectionTitle="Sección 2: Interactúa con tu entorno"
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 2 ? <ScrollHint label="¡Avancemos!" /> : null}
        >
          {videoPlaying ? (
            <>
              {/* Video sin controles — no se puede pausar */}
              <video
                className={styles.videoPlayer}
                src="/videos/intro-modelo.mp4"
                autoPlay
                playsInline
                onEnded={handleVideoEnded}
              />
              <p className={styles.videoStatus}>Animación en reproducción</p>
            </>
          ) : (
            <>
              <div className={styles.modelStage}>
                <MiniSpiralViewer enableRotation />
              </div>
              <p className={styles.frameInstructions}>
                Puedes interactuar con el modelo usando el scroll para acercarte y
                arrastrando con el click presionado para girarlo.
              </p>
              {completedFrames < 2 ? (
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

      {/* ═══ FRAME 3: Tu lugar en el modelo ════════════════════════════ */}
      {completedFrames >= 2 ? (
        <>
          {/* Viewer fijo top-right — aparece en fase B y se mantiene permanente */}
          {f3Phase === "laia-viewer" ? (
            <StageViewer stageLabel="Etapa actual: Etapa 1" />
          ) : null}

          <Frame
            id="frame-modelo-interactivo"
            sectionTitle="Sección 3: Tu lugar en el modelo"
            backgroundImage="/ui/backgroundUAO.png"
            overlay="rgba(4, 2, 3, 0.45)"
            hint={completedFrames >= 3 ? <ScrollHint label="Continuar" /> : null}
          >
            {/* Fase A y B: modelo visible solo mientras no estamos en viewer */}
            {f3Phase !== "laia-viewer" ? (
              <>
                <div className={styles.modelStage}>
                  <MiniSpiralViewer enableRotation />
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
              <div style={{ marginTop: "auto", width: "100%", paddingTop: "16px" }}>
                <CharacterStepDialog
                  key={f3Phase}
                  size="compact"
                  density="tight"
                  steps={f3Phase === "laia-model" ? F3_LAIA_STEPS_A : F3_LAIA_STEPS_B}
                  onComplete={
                    f3Phase === "laia-model"
                      ? () => setF3Phase("laia-viewer")
                      : () => {
                          completeFrame(3);
                          if (!notifiedFrames.current.has(3)) {
                            notifiedFrames.current.add(3);
                            pushToast("\u00a1Proceso guardado!");
                            pushToast("Ahora puedes acceder a cualquier etapa desde el men\u00fa principal");
                          }
                        }
                  }
                />
              </div>
            ) : null}
          </Frame>
        </>
      ) : null}

      {/* ═══ FRAME 4: Familiárizándote con el modelo ══════════════════ */}
      {completedFrames >= 3 ? (
        <Frame
          id="frame-rail"
          sectionTitle="Sección 4: Familiárizándote con el modelo"
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 4 ? <ScrollHint label="¡Continuemos!" /> : null}
        >
          <HorizontalScrollRail panels={STAGE_RAIL_CARDS} />

          {/* Diálogo de Laia — empujado al fondo del frame */}
          <div style={{ marginTop: "auto", width: "100%", paddingTop: "16px" }}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F4_LAIA_STEPS}
              onComplete={() => {
                completeFrame(4);
                if (!notifiedFrames.current.has(4)) {
                  notifiedFrames.current.add(4);
                  pushToast("\u00a1Proceso guardado!");
                }
              }}
            />
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 5: Asistencia guiada ═══════════════════════════════ */}
      {completedFrames >= 4 ? (
        <Frame
          id="frame-asistencia"
          sectionTitle="Sección 5: Asistencia guiada"
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 5 ? <ScrollHint label="Continuar" /> : null}
        >
          {/* Diálogo de Laia — cambia tras usar el chatbot */}
          <div style={{ marginTop: "auto", width: "100%", paddingTop: "16px" }}>
            {f5Phase !== "after-chat" ? (
              <CharacterStepDialog
                size="compact"
                density="tight"
                steps={F5_LAIA_STEPS}
                onComplete={() => setF5Phase("show-button")}
              />
            ) : (
              <CharacterStepDialog
                key="f5-complete"
                size="compact"
                density="tight"
                steps={F5_LAIA_COMPLETE_STEPS}
                onComplete={() => {
                  completeFrame(5);
                  if (!notifiedFrames.current.has(5)) {
                    notifiedFrames.current.add(5);
                    pushToast("\u00a1Proceso guardado!");
                  }
                }}
              />
            )}
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 6: Condiciones de confianza ══════════════════════ */}
      {completedFrames >= 5 ? (
        <Frame
          id="frame-consentimiento"
          sectionTitle="Sección 6: Condiciones de confianza"
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 6 ? <ScrollHint label="Iniciar diagnóstico" /> : null}
        >
          {/* Formulario de consentimiento */}
          {completedFrames < 6 ? (
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
                    completeFrame(6);
                    if (!notifiedFrames.current.has(6)) {
                      notifiedFrames.current.add(6);
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
          <div style={{ marginTop: "auto", width: "100%", paddingTop: "16px" }}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F6_LAIA_STEPS}
              showAudioButton={false}
            />
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 7: Estados iniciales ═══════════════════════════════ */}
      {completedFrames >= 6 ? (
        <Frame
          id="frame-estados"
          sectionTitle="Sección 7: Estados iniciales"
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 7 ? <ScrollHint label="Continuar" /> : null}
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
          <div style={{ marginTop: "auto", width: "100%", paddingTop: "16px" }}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F7_LAIA_STEPS}
              onComplete={() => {
                completeFrame(7);
                if (!notifiedFrames.current.has(7)) {
                  notifiedFrames.current.add(7);
                  pushToast("¡Proceso guardado!");
                }
              }}
            />
          </div>
        </Frame>
      ) : null}

      {/* ═══ Floating ChatBot button — fijo abajo-izquierda ═══════════ */}
      {completedFrames >= 4 && f5Phase !== "intro" ? (
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
            <IoChatbubbleEllipses size={18} /> ChatBot con Laia
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

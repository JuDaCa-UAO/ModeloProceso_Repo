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
import LaiaChatBar from "@/components/stage/LaiaChatBar";
import type { LaiaChatStep } from "@/components/stage/LaiaChatBar";
import StageViewer from "@/components/stage/StageViewer";
import ToastStack from "@/components/stage/ToastStack";
import type { Toast } from "@/components/stage/ToastStack";
import { writeProgress } from "@/lib/progress";
import styles from "./stageClient.module.css";

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

// ─── Contenido de LaiaChatBar — Frame 3 Fase A (modelo visible) ──────────────

const F3_LAIA_STEPS_A: LaiaChatStep[] = [
  {
    text: "Comenzamos en la primera etapa: Reconócete para avanzar. Aquí establecerás tu punto de partida para orientar el resto del recorrido.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Contenido de LaiaChatBar — Frame 3 Fase B (viewer visible) ──────────────

const F3_LAIA_STEPS_B: LaiaChatStep[] = [
  {
    text: "A partir de ahora podrás ver siempre en qué etapa del modelo te encuentras. Cuando termines esta introducción, también podrás acceder al resto de etapas desde la pantalla principal.",
    imgSrc: "/ui/laia.png",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type StageClientProps = {
  stageId: string;
  stageName: string;
  initialTree: unknown[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StageClient({ stageId, stageName }: StageClientProps) {
  /**
   * completedFrames: cuántos frames han terminado.
   *   0 = ninguno listo  (solo frame 1 visible)
   *   1 = frame 1 listo  (frame 2 visible)
   *   2 = frame 2 listo  (frame 3 visible)
   *   ...
   */
  const [completedFrames, setCompletedFrames] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

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

  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapa/${stageId}` });
  }, [stageId]);

  /** Marca el frame N como terminado. Seguro llamarlo más de una vez. */
  const completeFrame = useCallback((frameIndex: number) => {
    setCompletedFrames((prev) => Math.max(prev, frameIndex));
  }, []);

  const handleStartVideo = useCallback(() => setVideoPlaying(true), []);

  const handleVideoEnded = useCallback(() => {
    setVideoPlaying(false);
    completeFrame(2);
    pushToast("\u00a1Proceso guardado!");
  }, [completeFrame, pushToast]);

  return (
    <div className={styles.root}>
      <TechTrailBackground className={styles.background} />
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
          onComplete={() => { completeFrame(1); pushToast("\u00a1Proceso guardado!"); }}
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
            className={styles.frameWithBar}
            hintOffset={145}
            hint={completedFrames >= 3 ? <ScrollHint label="Continuar" /> : null}
            bottomBar={
              f3Phase !== "initial" ? (
                <LaiaChatBar
                  key={f3Phase}
                  steps={f3Phase === "laia-model" ? F3_LAIA_STEPS_A : F3_LAIA_STEPS_B}
                  onComplete={
                    f3Phase === "laia-model"
                      ? () => setF3Phase("laia-viewer")
                      : () => {
                          completeFrame(3);
                          pushToast("\u00a1Proceso guardado!");
                          pushToast("Ahora puedes acceder a cualquier etapa desde el men\u00fa principal");
                        }
                  }
                />
              ) : null
            }
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
          </Frame>
        </>
      ) : null}
    </div>
  );
}

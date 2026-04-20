"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../stage/StageViewer.module.css";
import blockStyles from "../stage/blocks/blocks.module.css";
import { sequenceRegistry, StageKey } from "./sequenceRegistry";
import { useImageSequence } from "./useImageSequence";
import { STAGE_META, STAGE_INFO } from "@/content/stages/index";

type MiniSpiralViewerProps = {
  /** Etiqueta que se muestra debajo del canvas. Ej: "Etapa actual: Etapa 1" */
  stageLabel: string;
  stageKey: StageKey;
};

function drawFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // Hacemos que cubra ("cover") para eliminar barras negras asimetricas
  const scale = Math.max(width / img.width, height / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  
  const sx = (width - drawWidth) / 2;
  const sy = (height - drawHeight) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img, sx, sy, drawWidth, drawHeight);
}

export default function MiniSpiralViewer({ stageLabel, stageKey }: MiniSpiralViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = sequenceRegistry[stageKey];
  const { framesRef, posterLoaded, readyToAnimate } = useImageSequence(config);
  const [panelOpen, setPanelOpen] = useState(false);

  const frameIndexRef = useRef(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let observer: ResizeObserver | null = null;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        let currentFrame = framesRef.current[frameIndexRef.current];
        if (!currentFrame && posterLoaded) {
           currentFrame = framesRef.current[config.posterFrame - 1];
        }
        if (currentFrame) drawFrame(ctx, canvas, currentFrame);
      }
    };

    observer = new ResizeObserver(() => resizeCanvas());
    const parentContainer = canvas.parentElement;
    if (parentContainer) observer.observe(parentContainer);

    resizeCanvas();

    return () => {
      if (observer) observer.disconnect();
    };
  }, [config.posterFrame, posterLoaded, framesRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      if (posterLoaded) {
        const posterFrame = framesRef.current[config.posterFrame - 1];
        if (posterFrame) drawFrame(ctx, canvas, posterFrame);
      }
      return;
    }

    if (!readyToAnimate) {
      if (posterLoaded) {
        const posterFrame = framesRef.current[config.posterFrame - 1];
        if (posterFrame) drawFrame(ctx, canvas, posterFrame);
      }
      return;
    }

    const fpsInterval = 1000 / config.fps;

    const render = (time: number) => {
      animationRef.current = requestAnimationFrame(render);

      if (document.hidden) return;

      const elapsed = time - lastTimeRef.current;
      if (elapsed > fpsInterval) {
        lastTimeRef.current = time - (elapsed % fpsInterval);

        const nextFrameImg = framesRef.current[frameIndexRef.current];
        if (nextFrameImg) {
          drawFrame(ctx, canvas, nextFrameImg);
          frameIndexRef.current = (frameIndexRef.current + 1) % config.totalFrames;
        }
      }
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [posterLoaded, readyToAnimate, config.fps, config.posterFrame, framesRef, config.totalFrames]);

  const currentIdx = STAGE_META.findIndex(s => s.id === stageKey);

  return (
    <div className={styles.widget} aria-label={stageLabel}>
      <div className={styles.canvas}>
        <canvas ref={canvasRef} style={{ display: "block", aspectRatio: "16/9" }} />
      </div>
      <p className={styles.label}>{stageLabel}</p>
      
      {/* Stepper progress */}
      <div className={styles.stepperTrack}>
        {STAGE_META.map((stage, i) => {
          let stateClass = styles.pending;
          let stateName = "Pendiente";
          if (i < currentIdx) { stateClass = styles.completed; stateName = "Completada"; }
          else if (i === currentIdx) { stateClass = styles.current; stateName = "Actual"; }
          else if (i === currentIdx + 1) { stateClass = styles.next; stateName = "Siguiente"; }

          return (
            <div 
              key={stage.id} 
              className={`${styles.stepDot} ${stateClass}`} 
              title={`${stage.name} (${stateName})`}
              aria-label={`${stage.name}: ${stateName}`}
            />
          );
        })}
      </div>

      <button className={styles.journeyBtn} onClick={() => setPanelOpen(true)}>
        Ver más
      </button>

      {panelOpen && typeof document !== "undefined" && createPortal(
        <div className={styles.modalBackdrop} onClick={() => setPanelOpen(false)}>
          <div 
            className={blockStyles.formCard} 
            style={{ width: '90%', maxWidth: '560px', position: 'relative', cursor: 'default' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={() => setPanelOpen(false)} aria-label="Cerrar">✕</button>
            
            {/* Bloque Principal: Etapa Actual */}
            <div className={blockStyles.stageCopy} style={{ marginTop: '8px' }}>
              <span className={blockStyles.stateHierarchy}>Etapa actual</span>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '24px', letterSpacing: '0.02em' }}>
                {STAGE_INFO[stageKey]?.title || "Etapa Actual"}
              </h2>
              <p style={{ color: '#d1d1d1', fontSize: '15px', lineHeight: '1.5' }}>
                {STAGE_INFO[stageKey]?.extendedDescription}
              </p>
            </div>

            <div className={blockStyles.bulletBlock} style={{ background: 'rgba(80, 6, 8, 0.15)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(248, 46, 53, 0.15)' }}>
              <ul className={blockStyles.bulletList}>
                <li><strong>Propósito:</strong> {STAGE_INFO[stageKey]?.stagePurpose}</li>
                <li><strong>Foco actual:</strong> {STAGE_INFO[stageKey]?.currentFocus}</li>
                <li><strong>Meta:</strong> {STAGE_INFO[stageKey]?.completionGoal}</li>
              </ul>
            </div>

            {/* Bloque Secundario: Siguiente Etapa */}
            {STAGE_INFO[stageKey]?.nextStagePreview ? (
              <div className={blockStyles.callout} style={{ marginTop: '12px' }}>
                <span className={blockStyles.stateHierarchy} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#d1d1d1', marginBottom: '8px' }}>
                  Siguiente etapa
                </span>
                <h3 className={blockStyles.calloutTitle}>{STAGE_INFO[stageKey].nextStagePreview!.title}</h3>
                <p className={blockStyles.calloutBody}>
                  {STAGE_INFO[stageKey].nextStagePreview!.context} <br/>
                  <strong>Acción:</strong> {STAGE_INFO[stageKey].nextStagePreview!.userAction}
                </p>
              </div>
            ) : (
              <div className={blockStyles.callout} style={{ marginTop: '12px', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <h3 className={blockStyles.calloutTitle}>Recorrido completado</h3>
                <p className={blockStyles.calloutBody}>Has llegado al final del proceso iterativo. Puedes volver a revisar cualquier etapa anterior.</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import styles from "../stage/StageViewer.module.css";
import { sequenceRegistry, StageKey } from "./sequenceRegistry";
import { useImageSequence } from "./useImageSequence";

type MiniSpiralViewerProps = {
  /** Etiqueta que se muestra debajo del canvas. Ej: "Etapa actual: Etapa 1" */
  stageLabel: string;
  stageKey: StageKey;
};

function drawFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const scale = Math.min(width / img.width, height / img.height);
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

  const frameIndexRef = useRef(0);
  const animationRef = useRef<number>();
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

  return (
    <div className={styles.widget} aria-label={stageLabel}>
      <div className={styles.canvas}>
        <canvas ref={canvasRef} style={{ display: "block", aspectRatio: "1/1" }} />
      </div>
      <p className={styles.label}>{stageLabel}</p>
    </div>
  );
}

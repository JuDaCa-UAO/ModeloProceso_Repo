"use client";

/**
 * GUIDE HAND — Guía animada con la mano de Laia (no conversacional).
 *
 * Señala un control objetivo identificado por `data-guide-id` y muestra una
 * instrucción breve. Sistema reusable por cualquier etapa.
 *
 * Posicionamiento: se calcula desde el elemento real con `getBoundingClientRect`
 * y se recalcula en scroll, resize y cambios de layout (`ResizeObserver`).
 * Se ubica DEBAJO del control para no taparlo, y se mantiene dentro del viewport.
 *
 * Accesibilidad:
 *   - Instrucción visible con `aria-live="polite"`.
 *   - La mano es decorativa (`aria-hidden`) porque la instrucción está escrita.
 *   - Botón "Omitir guía" con foco visible; teclado operativo.
 *   - Respeta `prefers-reduced-motion` (sin flotación).
 *   - Si el SVG no carga, la instrucción y el botón siguen visibles.
 *   - La finalización se guarda con clave versionada (se muestra una sola vez).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { resolveMedia } from "@/content/shared/media-registry";
import styles from "./GuideHand.module.css";

const GUIDE_VERSION = "v1";

type GuideHandProps = {
  stageId: string;
  /** Identificador estable del paso (para persistencia "mostrar una vez"). */
  guideKey: string;
  /** `data-guide-id` del control objetivo. */
  targetGuideId: string;
  text: string;
  placement?: "top" | "bottom" | "left" | "right";
};

function storageKey(stageId: string) {
  return `ai-tech-ed-guide-${stageId}-${GUIDE_VERSION}`;
}

function readSeen(stageId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(stageId));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markSeen(stageId: string, guideKey: string) {
  if (typeof window === "undefined") return;
  try {
    const seen = readSeen(stageId);
    seen.add(guideKey);
    window.localStorage.setItem(storageKey(stageId), JSON.stringify([...seen]));
  } catch {
    /* quota — ignore */
  }
}

export default function GuideHand({ stageId, guideKey, targetGuideId, text, placement = "bottom" }: GuideHandProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  // El host usa ssr:false, así que window existe al montar: se lee localStorage
  // en el inicializador para mostrar la guía una sola vez (clave versionada).
  const [dismissed, setDismissed] = useState<boolean>(
    () => (typeof window === "undefined" ? true : readSeen(stageId).has(guideKey))
  );
  const [svgFailed, setSvgFailed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const hand = resolveMedia("laia.leftPointingHand");

  const recompute = useCallback(() => {
    const el = document.querySelector<HTMLElement>(`[data-guide-id="${targetGuideId}"]`);
    if (!el) {
      setPos(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const margin = 12;
    let top = r.bottom + 10;
    let left = r.left + r.width / 2;
    if (placement === "top") top = r.top - 96;
    if (placement === "left") left = r.left - 40;
    if (placement === "right") left = r.right + 40;
    left = Math.min(Math.max(left, margin + 90), window.innerWidth - margin - 90);
    top = Math.min(Math.max(top, margin), window.innerHeight - margin - 40);
    setPos({ top, left });
  }, [targetGuideId, placement]);

  useEffect(() => {
    if (dismissed) return;

    const el = document.querySelector<HTMLElement>(`[data-guide-id="${targetGuideId}"]`);

    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recompute);
    };

    schedule();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    if (el) ro.observe(el);

    // Si el usuario interactúa con el control, se considera la guía cumplida.
    const onTargetClick = () => handleDismiss();
    el?.addEventListener("click", onTargetClick, { once: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      el?.removeEventListener("click", onTargetClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed, recompute, targetGuideId]);

  const handleDismiss = useCallback(() => {
    markSeen(stageId, guideKey);
    setDismissed(true);
  }, [stageId, guideKey]);

  if (dismissed || !pos) return null;

  return (
    <div className={styles.layer} style={{ top: pos.top, left: pos.left }} role="status" aria-live="polite">
      {hand.available && hand.url && !svgFailed ? (
        <Image
          src={hand.url}
          alt=""
          aria-hidden
          width={88}
          height={47}
          unoptimized
          className={styles.hand}
          onError={() => setSvgFailed(true)}
        />
      ) : (
        <span className={styles.handFallback} aria-hidden>
          👉
        </span>
      )}
      <div className={styles.bubble}>
        <p className={styles.text}>{text}</p>
        <button type="button" className={styles.skip} onClick={handleDismiss}>
          Omitir guía
        </button>
      </div>
    </div>
  );
}

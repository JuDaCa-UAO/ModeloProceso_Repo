"use client";

/**
 * PRESENTATION — Client Component
 *
 * Estepper de mensajes prediseñados de LaIA: guía narrativa paso a paso, NO
 * un chatbot de respuesta abierta. Recibe los avatares YA resueltos por el
 * servidor (`avatarUrl`); no conoce `MediaKey` ni proveedores.
 */
import { useState } from "react";
import Image from "next/image";
import styles from "./LaiaStepper.module.css";

export interface ResolvedLaiaStep {
  id: string;
  text: string;
  avatarUrl: string | null;
  avatarFallback: string;
}

export default function LaiaStepper({
  steps,
  badge = "LaIA",
  onStepChange,
  onFinish,
}: {
  steps: ResolvedLaiaStep[];
  badge?: string;
  onStepChange?: (index: number) => void;
  onFinish?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const total = steps.length;
  const step = steps[index];
  const atStart = index === 0;
  const atEnd = index === total - 1;

  if (!step) return null;

  return (
    <div className={styles.panel} data-reveal>
      <div className={styles.avatarFrame}>
        {step.avatarUrl ? (
          <Image src={step.avatarUrl} alt="LaIA" fill sizes="170px" className={styles.avatarImg} />
        ) : (
          <span aria-hidden>{step.avatarFallback}</span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.badge}>{badge}</span>
          <span className={styles.stepCounter}>
            paso {index + 1} de {total}
          </span>
        </div>
        <p className={styles.text}>{step.text}</p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => {
              const nextIdx = Math.max(0, index - 1);
              setIndex(nextIdx);
              onStepChange?.(nextIdx);
            }}
            disabled={atStart}
          >
            ← Anterior
          </button>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => {
              if (atEnd) {
                onFinish?.();
              } else {
                const nextIdx = Math.min(total - 1, index + 1);
                setIndex(nextIdx);
                onStepChange?.(nextIdx);
              }
            }}
          >
            {atEnd ? "Entendido" : "Leer más"}
          </button>
        </div>
      </div>
    </div>
  );
}

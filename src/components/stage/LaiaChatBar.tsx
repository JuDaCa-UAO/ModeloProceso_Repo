/**
 * PRESENTATION — LaiaChatBar
 *
 * Barra de diálogo de Laia anclada al pie de un frame.
 * Diseñada para salir visualmente del borde inferior del frame
 * usando el slot `bottomBar` del componente <Frame>.
 *
 * Maneja internamente el avance de pasos.
 * Llama `onComplete` cuando el usuario hace clic en el último paso.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./LaiaChatBar.module.css";

export interface LaiaChatStep {
  text: string;
  /** Ruta de la imagen del avatar de Laia para este paso. */
  imgSrc?: string;
}

interface LaiaChatBarProps {
  steps: LaiaChatStep[];
  /** Llamado al avanzar más allá del último paso. */
  onComplete: () => void;
}

export default function LaiaChatBar({ steps, onComplete }: LaiaChatBarProps) {
  const [current, setCurrent] = useState(0);

  const step = steps[current] ?? steps[0];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const imgSrc = step.imgSrc ?? "/ui/laia.png";

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrent((c) => c - 1);
  };

  return (
    <div className={styles.bar}>
      {/* Avatar de Laia */}
      <div className={styles.avatar}>
        <div className={styles.avatarFrame}>
          <Image
            src={imgSrc}
            alt="Laia"
            fill
            className={styles.avatarImg}
            unoptimized
          />
        </div>
        <span className={styles.avatarName}>Laia</span>
      </div>

      {/* Texto del paso actual */}
      <p className={styles.text}>{step.text}</p>

      {/* Controles */}
      <div className={styles.controls}>
        {/* Audio — funcionalidad pendiente */}
        <button
          className={styles.iconBtn}
          aria-label="Reproducir audio"
          disabled
          tabIndex={-1}
          title="Audio próximamente"
        >
          🔊
        </button>

        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Paso anterior"
        >
          ◀
        </button>

        <button
          className={`${styles.navBtn} ${styles.navBtnNext}`}
          onClick={handleNext}
          aria-label={isLast ? "Continuar" : "Siguiente paso"}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

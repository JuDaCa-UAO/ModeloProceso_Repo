"use client";

import React, { useEffect, useState } from "react";
import styles from "./ReflectionPrompt.module.css";

interface ReflectionAndContinueProps {
  question: string;
  accent: string;
  stageNumber: string;
  children?: React.ReactNode;
}

export default function ReflectionAndContinue({
  question,
  accent,
  stageNumber,
  children,
}: ReflectionAndContinueProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const storageKey = `reflection_stage_${stageNumber}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReflectionText(saved);
      setIsSaved(true);
    }
    setHasMounted(true);
  }, [storageKey]);

  const handleSave = () => {
    if (!reflectionText.trim()) return;
    localStorage.setItem(storageKey, reflectionText.trim());
    setIsSaved(true);
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  // Render minimal fallback state during SSR to avoid hydration mismatch
  if (!hasMounted) {
    return (
      <>
        <div className={styles.box} style={{ "--accent": accent } as React.CSSProperties}>
          <span className={styles.label}>PAUSA PARA REFLEXIONAR</span>
          <p className={styles.question}>{question}</p>
          <textarea
            className={styles.textarea}
            placeholder="Si quieres, anota aquí tu reflexión (opcional)"
            disabled
          />
        </div>
        <div className={styles.continueRow}>
          <button
            type="button"
            className={styles.saveButton}
            style={{ "--accent": accent } as React.CSSProperties}
            disabled
          >
            Guardar reflexión
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.box} style={{ "--accent": accent } as React.CSSProperties}>
        <span className={styles.label}>PAUSA PARA REFLEXIONAR</span>
        <p className={styles.question}>{question}</p>
        {isSaved ? (
          <div className={styles.savedContainer}>
            <p className={styles.savedText}>{reflectionText}</p>
            <button
              type="button"
              className={styles.editButton}
              style={{ "--accent": accent } as React.CSSProperties}
              onClick={handleEdit}
            >
              Modificar respuesta
            </button>
          </div>
        ) : (
          <textarea
            className={styles.textarea}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Si quieres, anota aquí tu reflexión (opcional)"
          />
        )}
      </div>

      {isSaved && children ? children : null}

      {!isSaved ? (
        <div className={styles.continueRow}>
          <button
            type="button"
            className={styles.saveButton}
            style={{ "--accent": accent } as React.CSSProperties}
            onClick={handleSave}
            disabled={!reflectionText.trim()}
          >
            Guardar reflexión
          </button>
        </div>
      ) : null}
    </>
  );
}

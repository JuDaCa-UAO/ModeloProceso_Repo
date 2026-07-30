"use client";

import React, { useEffect, useState } from "react";
import styles from "./ReflectionPrompt.module.css";

const REFLECTION_NOTICE = "Tu respuesta es personal, voluntaria, local y no evaluativa.";

interface ReflectionAndContinueProps {
  question: string;
  accent: string;
  /**
   * Variante oscurecida de `accent` para los elementos con texto (rótulo,
   * botones, borde de foco). `accent` se reserva a lo decorativo.
   */
  accentInk: string;
  stageNumber: string;
  children?: React.ReactNode;
}

export default function ReflectionAndContinue({
  question,
  accent,
  accentInk,
  stageNumber,
  children,
}: ReflectionAndContinueProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const storageKey = `reflection_stage_${stageNumber}`;
  const accentVars = { "--accent": accent, "--accent-ink": accentInk } as React.CSSProperties;

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
        <div className={styles.box} style={accentVars}>
          <span className={styles.label}>PAUSA PARA REFLEXIONAR</span>
          <p className={styles.question}>{question}</p>
          <p className={styles.notice}>{REFLECTION_NOTICE}</p>
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
            style={accentVars}
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
      <div className={styles.box} style={accentVars}>
        <span className={styles.label}>PAUSA PARA REFLEXIONAR</span>
        <p className={styles.question}>{question}</p>
        <p className={styles.notice}>{REFLECTION_NOTICE}</p>
        {isSaved ? (
          <div className={styles.savedContainer}>
            <p className={styles.savedText}>{reflectionText}</p>
            <button
              type="button"
              className={styles.editButton}
              style={accentVars}
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
            style={accentVars}
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

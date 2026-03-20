"use client";

import { useEffect, useState } from "react";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import { N8N_CONFIG } from "@infra/n8n/n8n.config";
import type { BlockContext } from "./BlockContext";

type AutodiagnosticBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque del modulo de autodiagnostico.
 *
 * Mejoras vs implementacion anterior:
 *  1. La URL del formulario viene de N8N_CONFIG (Infrastructure), no hardcodeada.
 *  2. El timeout de fallback es configurable.
 *  3. El bloque es independiente y se puede renderizar en cualquier etapa.
 *
 * Cuando el docente confirma que completo el formulario, llama onUpdate.
 * En el futuro, esta accion puede invocar CompleteAutodiagnosticUseCase
 * para notificar al webhook de N8N y obtener el resultado real.
 */
export default function AutodiagnosticBlock({ ctx }: AutodiagnosticBlockProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { state, onUpdate } = ctx;

  const formUrl = N8N_CONFIG.forms.autodiagnostic || "";

  useEffect(() => {
    if (!state.autodiagnosticStarted || iframeLoaded) return;
    const timer = window.setTimeout(() => setShowFallback(true), 4_500);
    return () => window.clearTimeout(timer);
  }, [iframeLoaded, state.autodiagnosticStarted]);

  return (
    <div className={styles.embedCard}>
      <div className={styles.embedHeader}>
        <span className={styles.embedLabel}>Autodiagnostico</span>
        <span className={styles.embedStatus}>
          {state.autodiagnosticCompleted ? "Completado" : "Pendiente"}
        </span>
      </div>

      <div className={styles.embedViewport}>
        {!showFallback || iframeLoaded ? (
          <iframe
            src={formUrl || undefined}
            title="Autodiagnostico etapa 1"
            className={styles.embedIframe}
            loading="lazy"
            sandbox="allow-forms allow-scripts allow-same-origin"
            onLoad={() => {
              setIframeLoaded(true);
              setShowFallback(false);
            }}
          />
        ) : (
          <div className={styles.embedFallback}>
            <h3 className={styles.embedFallbackTitle}>Modulo en implementacion</h3>
            <p className={styles.embedFallbackCopy}>
              Puedes continuar con el recorrido usando el embebido como base de la
              siguiente iteracion de Etapa 1.
            </p>
            <p className={styles.embedFallbackCopy}>
              Cuando el modulo este disponible, podras completar aqui tu
              autodiagnostico individual y confidencial.
            </p>
          </div>
        )}
      </div>

      <div className={styles.embedActions}>
        <button
          type="button"
          className={stageStyles.buttonSecondary}
          disabled={state.autodiagnosticCompleted}
          onClick={() =>
            onUpdate({
              autodiagnosticCompleted: true,
              resultStateId: state.resultStateId || "intermedio",
            })
          }
        >
          {state.autodiagnosticCompleted
            ? "Autodiagnostico completado"
            : "He completado el autodiagnostico"}
        </button>
      </div>

      <p className={styles.helperText}>
        Durante este paso el foco queda en el embebido y el avance se conserva
        localmente para la siguiente iteracion del flujo.
      </p>
    </div>
  );
}

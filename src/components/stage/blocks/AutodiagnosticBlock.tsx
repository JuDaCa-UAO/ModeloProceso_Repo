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
 * Bloque del módulo de autodiagnóstico.
 *
 * Mejoras vs implementación anterior:
 *  1. La URL del formulario viene de N8N_CONFIG (Infrastructure), no hardcodeada.
 *  2. El timeout de fallback es configurable.
 *  3. El bloque es independiente — se puede renderizar en cualquier etapa.
 *
 * Cuando el docente confirma que completó el formulario, llama onUpdate.
 * En el futuro, esta acción puede invocar CompleteAutodiagnosticUseCase
 * para notificar al webhook de N8N y obtener el resultado real.
 */
export default function AutodiagnosticBlock({ ctx }: AutodiagnosticBlockProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { state, onUpdate, onScrollTo } = ctx;

  const formUrl = N8N_CONFIG.forms.autodiagnostic || "";

  useEffect(() => {
    if (!state.autodiagnosticStarted || iframeLoaded) return;
    const timer = window.setTimeout(() => setShowFallback(true), 4_500);
    return () => window.clearTimeout(timer);
  }, [iframeLoaded, state.autodiagnosticStarted]);

  return (
    <div className={styles.embedCard}>
      <div className={styles.embedHeader}>
        <span className={styles.embedLabel}>Autodiagnóstico</span>
        <span className={styles.embedStatus}>
          {state.autodiagnosticCompleted ? "Completado" : "Pendiente"}
        </span>
      </div>

      <div className={styles.embedViewport}>
        {!showFallback || iframeLoaded ? (
          <iframe
            src={formUrl || undefined}
            title="Autodiagnóstico etapa 1"
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
            <h3 className={styles.embedFallbackTitle}>Módulo en implementación</h3>
            <p className={styles.embedFallbackCopy}>
              Puedes continuar con el recorrido usando la simulación de resultado disponible en esta etapa.
            </p>
            <p className={styles.embedFallbackCopy}>
              Cuando el módulo esté disponible, podrás completar aquí tu autodiagnóstico individual y confidencial.
            </p>
          </div>
        )}
      </div>

      <div className={styles.embedActions}>
        <button
          type="button"
          className={stageStyles.buttonSecondary}
          disabled={state.autodiagnosticCompleted}
          onClick={() => {
            onUpdate({
              autodiagnosticCompleted: true,
              resultStateId: state.resultStateId || "intermedio",
            });
            window.setTimeout(() => onScrollTo("resultado"), 120);
          }}
        >
          {state.autodiagnosticCompleted
            ? "Autodiagnóstico completado"
            : "He completado el autodiagnóstico"}
        </button>
      </div>

      <p className={styles.helperText}>
        Durante este paso la navegación queda libre, y el acompañamiento de Laia se retoma al presentar el resultado.
      </p>
    </div>
  );
}

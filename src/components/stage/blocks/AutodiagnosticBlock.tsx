"use client";

import { useEffect, useMemo, useState } from "react";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import { N8N_CONFIG } from "@infra/n8n/n8n.config";
import type { BlockContext } from "./BlockContext";

type AutodiagnosticBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque del modulo de autodiagnostico integrado dentro del stage.
 *
 * Conserva el embebido actual, pero lo envuelve en un marco visual propio
 * de la cartilla para que el salto al formulario no rompa la continuidad.
 */
export default function AutodiagnosticBlock({ ctx }: AutodiagnosticBlockProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const { state, flags, onUpdate } = ctx;

  const formUrl = N8N_CONFIG.forms.autodiagnostic || "";
  const fallbackVisible = showFallback || !formUrl;

  useEffect(() => {
    if (!state.autodiagnosticStarted || iframeLoaded) return;
    if (!formUrl) return;

    const timer = window.setTimeout(() => setShowFallback(true), 4_500);
    return () => window.clearTimeout(timer);
  }, [formUrl, iframeLoaded, state.autodiagnosticStarted]);

  const loadingMessage = useMemo(() => {
    if (showFallback) {
      return "No fue posible cargar el embebido en este momento.";
    }

    if (!iframeLoaded) {
      return "Preparando el autodiagnostico dentro de la cartilla.";
    }

    return "Autodiagnostico listo dentro del recorrido.";
  }, [iframeLoaded, showFallback]);

  return (
    <section className={styles.embedStageCard}>
      <div className={styles.embedStageTop}>
        <div className={styles.embedStageCopy}>
          <span className={styles.embedStageLabel}>Autodiagnostico integrado</span>
          <h3 className={styles.embedStageTitle}>Tu punto de partida se completa aqui</h3>
          <p className={styles.embedStageBody}>
            Este embebido permanece dentro del marco visual de la cartilla. En este tramo
            Laia queda en silencio narrativo para que toda la atencion se concentre en tu
            lectura individual.
          </p>
        </div>

        <div className={styles.embedStageMeta}>
          <span className={styles.embedStageMetaTag}>
            {flags.consentValidated ? "Consentimiento validado" : "Consentimiento pendiente"}
          </span>
          <span className={styles.embedStatus}>
            {state.autodiagnosticCompleted ? "Completado" : iframeLoaded ? "Listo" : "Cargando"}
          </span>
        </div>
      </div>

      <div className={styles.embedViewportLarge}>
        {!fallbackVisible && formUrl ? (
          <iframe
            src={formUrl}
            title="Autodiagnostico etapa 1"
            className={`${styles.embedIframe} ${styles.embedIframeLarge} ${
              !iframeLoaded ? styles.embedIframeLoading : ""
            }`}
            loading="lazy"
            sandbox="allow-forms allow-scripts allow-same-origin"
            onLoad={() => {
              setIframeLoaded(true);
              setShowFallback(false);
            }}
          />
        ) : null}

        {!iframeLoaded && !fallbackVisible ? (
          <div className={styles.embedLoadingLayer}>
            <span className={styles.embedLoadingTag}>Cargando</span>
            <p className={styles.embedLoadingTitle}>{loadingMessage}</p>
            <p className={styles.embedLoadingCopy}>
              El bloque se mantiene dentro del mismo stage para no romper la continuidad
              visual del recorrido.
            </p>
          </div>
        ) : null}

        {fallbackVisible ? (
          <div className={styles.embedFallbackLarge}>
            <h3 className={styles.embedFallbackTitle}>Modulo en implementacion</h3>
            <p className={styles.embedFallbackCopy}>
              El contenedor del autodiagnostico sigue integrado al stage aunque el embebido
              no termine de cargar. Asi el recorrido conserva su continuidad visual.
            </p>
            <p className={styles.embedFallbackCopy}>
              Cuando el modulo este disponible, podras completar aqui tu autodiagnostico
              individual, confidencial y formativo.
            </p>
          </div>
        ) : null}
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
        El acceso a este embebido depende del consentimiento previo. Cuando termina,
        el flujo puede continuar hacia el cierre de la etapa sin salir del recorrido.
      </p>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../stage/StageViewer.module.css";
import blockStyles from "../stage/blocks/blocks.module.css";
import LazyStageViewer from "../stage/LazyStageViewer";
import { STAGE_META, STAGE_INFO } from "@/content/stages/index";

type MiniSpiralViewerProps = {
  /** Etiqueta que se muestra debajo del canvas. Ej: "Etapa actual: Etapa 1" */
  stageLabel: string;
  stageKey: string;
};

export default function MiniSpiralViewer({ stageLabel, stageKey }: MiniSpiralViewerProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const currentIdx = STAGE_META.findIndex(s => s.id === stageKey);
  // El índice de la etapa activa corresponde a su índice en STAGE_META (0 = introducción, 1 = etapa 1, etc.).
  const activeStageIndex = currentIdx !== -1 ? currentIdx : undefined;

  return (
    <div className={styles.widget} aria-label={stageLabel}>
      <div className={styles.canvas}>
        <LazyStageViewer 
          enableRotation={!prefersReducedMotion} 
          activeStage={activeStageIndex} 
          lowPower={true} 
        />
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

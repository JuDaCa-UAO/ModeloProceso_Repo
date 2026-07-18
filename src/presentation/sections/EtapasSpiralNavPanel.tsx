"use client";

import { useState } from "react";
import type { Stage } from "@domain/content/Stage";
import type { ResolvedLaiaStep } from "@/presentation/laia/LaiaStepper";
import CartillaSpiralNav from "@/presentation/spiral/CartillaSpiralNav";
import LaiaStepper from "@/presentation/laia/LaiaStepper";
import styles from "./EtapasSpiralNavSection.module.css";

interface EtapasSpiralNavPanelProps {
  stages: Stage[];
  navigationSteps: ResolvedLaiaStep[];
}

export default function EtapasSpiralNavPanel({ stages, navigationSteps }: EtapasSpiralNavPanelProps) {
  const ordered = [...stages].sort((a, b) => a.order - b.order);
  const [showLaia, setShowLaia] = useState(true);

  const handleStepChange = (index: number) => {
    // Si avanzamos al paso 2 (index === 1), activamos el resaltado/parpadeo del botón flotante
    if (index === 1) {
      window.dispatchEvent(new CustomEvent("laia-nav-highlight-start"));
    } else {
      window.dispatchEvent(new CustomEvent("laia-nav-highlight-stop"));
    }
  };

  const handleFinish = () => {
    // Apagar el resaltado y ocultar el asistente de LaIA
    window.dispatchEvent(new CustomEvent("laia-nav-highlight-stop"));
    setShowLaia(false);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Explora las seis etapas</h2>
        <span className={styles.eyebrow}>gira el modelo y elige una etapa</span>
      </div>

      {showLaia ? (
        <div className={styles.splitRow}>
          <div className={styles.spiralCol}>
            <CartillaSpiralNav />
          </div>
          <div className={styles.laiaCol}>
            <LaiaStepper
              steps={navigationSteps}
              onStepChange={handleStepChange}
              onFinish={handleFinish}
            />
          </div>
        </div>
      ) : (
        <div className={styles.fullWidthRow}>
          <CartillaSpiralNav />
        </div>
      )}

      <nav className={styles.linksNav} aria-label="Ir directamente a una etapa">
        <p className={styles.linksHint}>¿Prefieres ir directo? Elige una etapa:</p>
        <ul className={styles.grid}>
          {ordered.map((stage) => (
            <li key={stage.id}>
              <a
                href={`#${stage.id}`}
                className={styles.card}
                style={{ "--stage-accent": stage.accent.main } as React.CSSProperties}
              >
                <span className={styles.cardNumber}>{stage.order}</span>
                <span className={styles.cardName}>{stage.officialName}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className={styles.description}>
        Cada etapa se acompaña de cinco factores rectores —propósito, razonamiento crítico, ética, herramientas y
        reflexión— que conocerás al final del recorrido.
      </p>
    </div>
  );
}

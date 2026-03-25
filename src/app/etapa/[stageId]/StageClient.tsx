/**
 * PRESENTATION — Client Component (Stage Engine)
 *
 * StageClient: motor genérico de renderizado de etapas.
 * Frame 1: bienvenida con diálogo de Laia.
 * El siguiente frame se habilita al completar el diálogo.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import Frame from "@/components/stage/Frame";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import type { CharacterDialogStep } from "@/components/character-step-dialog/CharacterStepDialog";
import { writeProgress } from "@/lib/progress";
import styles from "./stageClient.module.css";

// ─── Contenido del diálogo de Laia — Frame 1 ─────────────────────────────────

const LAIA_INTRO_STEPS: CharacterDialogStep[] = [
  {
    text: "Bienvenido/a. Este recorrido te guiará por un modelo por etapas para integrar GenAI en experiencias de aprendizaje. Avanzaremos de forma estructurada: reconocer tu punto de partida, explorar posibilidades, diseñar con propósito, preparar el terreno, desplegar en el aula y evaluar para mejorar.",
    imgSrc: "/ui/laia.png",
  },
  {
    text: "Este modelo se recorre por etapas. Cada una cumple una función distinta dentro del proceso y te ayudará a avanzar con mayor claridad y sentido pedagógico.",
    imgSrc: "/ui/laia_explaining.png",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type StageClientProps = {
  stageId: string;
  stageName: string;
  initialTree: unknown[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StageClient({ stageId, stageName }: StageClientProps) {
  const [dialogueDone, setDialogueDone] = useState(false);

  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapa/${stageId}` });
  }, [stageId]);

  const handleDialogueComplete = useCallback(() => {
    setDialogueDone(true);
  }, []);

  return (
    <div className={styles.root}>
      <TechTrailBackground className={styles.background} />

      {/* ── Frame 1: Bienvenida con Laia ───────────────────────────────── */}
      <Frame
        id="frame-intro"
        sectionTitle={`Sección 1: ${stageName}`}
        backgroundImage="/ui/frames/frame-intro.jpg"
        overlay="rgba(4, 2, 3, 0.52)"
      >
        <CharacterStepDialog
          steps={LAIA_INTRO_STEPS}
          characterName="Laia"
          nextLabel="Siguiente"
          onComplete={handleDialogueComplete}
        />
      </Frame>

      {/* ── Indicador de scroll — aparece cuando el diálogo termina ────── */}
      {dialogueDone ? (
        <div className={styles.scrollHint} aria-label="Puedes continuar hacia abajo">
          <span className={styles.scrollArrow} aria-hidden>▼</span>
        </div>
      ) : null}

      {/* ── Frame 2 y siguientes se agregarán aquí ─────────────────────── */}
    </div>
  );
}

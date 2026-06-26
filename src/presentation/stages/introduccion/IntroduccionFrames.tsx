"use client";

import { useEffect, useState } from "react";
import Frame from "@/components/stage/Frame";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import HorizontalScrollRail from "@/components/stage/HorizontalScrollRail";
import StageViewer from "@/components/stage/StageViewer";
import {
  LAIA_INTRO_STEPS,
  F3_LAIA_STEPS,
  STAGE_RAIL_CARDS,
  F4_LAIA_STEPS,
  F5_LAIA_STEPS,
} from "@/content/dialogs/introduccion.dialogs";
import styles from "../stageClient.module.css";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";
import { FiArrowRight } from "react-icons/fi";
import ScrollHint from "../shared/ScrollHint";
import { readFrameProgress } from "../shared/frameProgress";
import type { StageFramesProps } from "../shared/StageFramesProps";

export default function IntroduccionFrames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  const [f3Phase, setF3Phase] = useState<"initial" | "laia-model" | "laia-viewer">("initial");

  // Restaura estados secundarios desde localStorage al montar
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved >= 2) setF3Phase("laia-viewer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ═══ FRAME 1: Bienvenida con LaIA ══════════════════════════════════ */}
      <Frame
        id="frame-intro"
        sectionTitle="Sección 1: Bienvenido a esta iteración"
        stageTitle="Introducción: Bienvenido a esta iteración"
        backgroundImage="/ui/uao-hero-img_1.webp"
        overlay="rgba(4, 2, 3, 0.45)"
        hint={completedFrames >= 1 ? <ScrollHint label="Iniciar recorrido" /> : null}
      >
        <CharacterStepDialog
          steps={LAIA_INTRO_STEPS}
          characterName="LaIA"
          nextLabel="Siguiente"
          onComplete={() => {
            completeFrame(1);
            if (!notifiedFrames.current.has(1)) {
              notifiedFrames.current.add(1);
              pushToast("¡Proceso guardado!");
            }
          }}
        />
      </Frame>

      {/* ═══ FRAME 2: Tu lugar en el modelo ════════════════════════════════ */}
      {completedFrames >= 1 ? (
        <>
          {f3Phase === "laia-viewer" ? (
            <MiniSpiralViewer stageLabel="Introducción" stageKey="introduccion" />
          ) : null}

          <Frame
            id="frame-modelo-interactivo"
            sectionTitle="Sección 2: Tu lugar en el modelo"
            backgroundImage="/ui/uao-hero-img_1.webp"
            overlay="rgba(4, 2, 3, 0.45)"
            hint={completedFrames >= 2 ? <ScrollHint label="Continuar" /> : null}
          >
            {f3Phase !== "laia-viewer" ? (
              <>
                <div className={styles.modelStageCompact}>
                  <StageViewer enableRotation />
                </div>
                <p className={styles.frameInstructions}>
                  Puedes interactuar con el modelo usando el scroll para acercarte y
                  arrastrando con el click presionado para girarlo.
                </p>
                {f3Phase === "initial" ? (
                  <div className={styles.frameActions}>
                    <UaoButton
                      pill
                      trailingIcon={<FiArrowRight />}
                      onClick={() => setF3Phase("laia-model")}
                    >
                      Continuar
                    </UaoButton>
                  </div>
                ) : null}
              </>
            ) : null}

            {f3Phase !== "initial" ? (
              <div className={styles.laiaSlot}>
                <CharacterStepDialog
                  size="compact"
                  density="tight"
                  steps={F3_LAIA_STEPS}
                  onStepChange={(idx) => {
                    if (idx === 1) setF3Phase("laia-viewer");
                    else setF3Phase("laia-model");
                  }}
                  onComplete={() => {
                    completeFrame(2);
                    if (!notifiedFrames.current.has(2)) {
                      notifiedFrames.current.add(2);
                      pushToast("¡Proceso guardado!");
                      pushToast("Ahora puedes acceder a cualquier etapa desde el menú principal");
                    }
                  }}
                />
              </div>
            ) : null}
          </Frame>
        </>
      ) : null}

      {/* ═══ FRAME 3: Familiárizándote con el modelo ════════════════════════ */}
      {completedFrames >= 2 ? (
        <Frame
          id="frame-rail"
          sectionTitle="Sección 3: Familiárizándote con el modelo"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 3 ? <ScrollHint label="¡Continuemos!" /> : null}
        >
          <HorizontalScrollRail panels={STAGE_RAIL_CARDS} />

          <div className={styles.laiaSlot}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F4_LAIA_STEPS}
              onComplete={() => {
                completeFrame(3);
                if (!notifiedFrames.current.has(3)) {
                  notifiedFrames.current.add(3);
                  pushToast("¡Proceso guardado!");
                }
              }}
            />
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 4: Asistencia guiada ═════════════════════════════════════ */}
      {completedFrames >= 3 ? (
        <Frame
          id="frame-asistencia"
          sectionTitle="Sección 4: Asistencia guiada"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={null}
        >
          <div className={styles.laiaSlot}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F5_LAIA_STEPS}
              onComplete={() => {
                completeFrame(4);
                if (!notifiedFrames.current.has(4)) {
                  notifiedFrames.current.add(4);
                  pushToast("¡Proceso guardado!");
                }
              }}
            />
          </div>

          {completedFrames >= 4 ? (
            <div className={styles.f9NextRow}>
              <UaoButtonLink
                href="/etapas/etapa-1"
                pill
                size="lg"
                trailingIcon={<FiArrowRight />}
                aria-label="Ir a la siguiente etapa"
              >
                Ir a la siguiente etapa
              </UaoButtonLink>
            </div>
          ) : null}
        </Frame>
      ) : null}
    </>
  );
}

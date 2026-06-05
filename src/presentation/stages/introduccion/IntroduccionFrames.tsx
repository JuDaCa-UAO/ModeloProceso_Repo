"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
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
  /**
   * f5Phase: fase interna del Frame 4 (asistencia guiada).
   *   'intro'       → diálogo inicial visible, botón chatbot oculto
   *   'show-button' → diálogo completado, botón chatbot visible + pulsando
   *   'after-chat'  → chatbot usado, diálogo muestra "Continuemos"
   */
  const [f5Phase, setF5Phase] = useState<"intro" | "show-button" | "after-chat">("intro");
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Restaura estados secundarios desde localStorage al montar
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved >= 2) setF3Phase("laia-viewer");
    if (saved >= 4) setF5Phase("after-chat");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChatbotToggle = useCallback(() => {
    setChatbotOpen((open) => {
      if (open) {
        if (f5Phase === "show-button") setF5Phase("after-chat");
        return false;
      }
      return true;
    });
  }, [f5Phase]);

  return (
    <>
      {/* ═══ FRAME 1: Bienvenida con Laia ══════════════════════════════════ */}
      <Frame
        id="frame-intro"
        sectionTitle="Sección 1: Bienvenido a esta iteración"
        stageTitle="Introducción: Bienvenido a esta iteración"
        backgroundImage="/ui/backgroundUAO.png"
        overlay="rgba(4, 2, 3, 0.45)"
        hint={completedFrames >= 1 ? <ScrollHint label="Iniciar recorrido" /> : null}
      >
        <CharacterStepDialog
          steps={LAIA_INTRO_STEPS}
          characterName="Laia"
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
            backgroundImage="/ui/backgroundUAO.png"
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
                    <button
                      className={styles.btnVerAnimacion}
                      onClick={() => setF3Phase("laia-model")}
                    >
                      Continuar →
                    </button>
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
          backgroundImage="/ui/backgroundUAO.png"
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
          backgroundImage="/ui/backgroundUAO.png"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={null}
        >
          <div className={styles.laiaSlot}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F5_LAIA_STEPS}
              disableNext={f5Phase === "show-button"}
              onBeforeNext={(idx) => {
                if (idx === 0 && f5Phase === "intro") {
                  setF5Phase("show-button");
                  return false;
                }
                return true;
              }}
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
              <a
                href="/etapas/etapa-1"
                className={styles.f9NextBtn}
                aria-label="Ir a la siguiente etapa"
              >
                Ir a la siguiente etapa
              </a>
            </div>
          ) : null}
        </Frame>
      ) : null}

      {/* ═══ Chatbot flotante — visible después de la fase intro ════════════ */}
      {f5Phase !== "intro" ? (
        <>
          <button
            type="button"
            className={[
              styles.chatbotBtn,
              f5Phase === "show-button" && !chatbotOpen ? styles.chatbotBtnAttract : "",
              chatbotOpen ? styles.chatbotBtnPulseClose : "",
            ].join(" ")}
            onClick={handleChatbotToggle}
          >
            <Image
              src="/ui/Laia-Icon.png"
              alt="Chat con Laia"
              width={44}
              height={44}
              unoptimized
              className={styles.chatbotBtnIcon}
            />
          </button>

          {chatbotOpen ? (
            <div className={styles.chatPanel}>
              <div className={styles.chatPanelInner}>
                <div className={styles.chatBubble}>
                  <p className={styles.chatTitle}>Hola, soy Laia.</p>
                  <p className={styles.chatBody}>
                    Este chatbot está aquí para acompañarte durante tu recorrido
                    por la cartilla web. Puedes acudir a mí si necesitas aclarar
                    algo puntual, entender mejor una parte de la página o
                    profundizar en algún aspecto del modelo de proceso. Mi
                    alcance se limita a esta experiencia: puedo explicarte el
                    modelo, sus etapas, sus estados y el funcionamiento de la
                    cartilla, pero no responder preguntas por fuera de este
                    contexto.{" "}
                    <strong>
                      Siempre que lo necesites, estaré aquí para orientarte.
                    </strong>
                  </p>
                </div>
                <div className={styles.chatInputRow}>
                  <Image
                    src="/ui/Laia-Icon.png"
                    alt="Laia"
                    width={36}
                    height={36}
                    className={styles.chatAvatar}
                  />
                  <input
                    className={styles.chatInput}
                    placeholder="Escribe un mensaje…"
                    disabled
                  />
                  <button className={styles.chatSendBtn} disabled aria-label="Enviar">
                    <IoSend size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

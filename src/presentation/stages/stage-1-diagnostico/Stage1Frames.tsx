"use client";

import { useCallback, useEffect, useState } from "react";
import Frame from "@/components/stage/Frame";
import CharacterStepDialog from "@/components/character-step-dialog/CharacterStepDialog";
import MiniSpiralViewer from "@/components/mini-spiral-viewer/MiniSpiralViewer";
import StageViewer from "@/components/stage/StageViewer";
import YouTubeNarrativePlayer from "@/components/youtube-narrative-player/YouTubeNarrativePlayer";
import { VIDEO_REGISTRY } from "@/content/shared/video-registry";
import { N8N_CONFIG } from "@/infrastructure/n8n/n8n.config";
import {
  F6_LAIA_STEPS,
  F7_LAIA_STEPS,
  ESTADO_CARDS,
  F8_LAIA_STEPS,
  F9_LAIA_STEPS,
} from "@/content/dialogs/stage-1.dialogs";
import styles from "../stageClient.module.css";
import blockStyles from "@/components/stage/blocks/blocks.module.css";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";
import { FiArrowRight, FiPlay, FiRotateCcw } from "react-icons/fi";
import ScrollHint from "../shared/ScrollHint";
import { readFrameProgress } from "../shared/frameProgress";
import type { StageFramesProps } from "../shared/StageFramesProps";

export default function Stage1Frames({
  stageId,
  completedFrames,
  completeFrame,
  pushToast,
  notifiedFrames,
}: StageFramesProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [consentAdmin, setConsentAdmin] = useState(false);
  const [consentUsage, setConsentUsage] = useState(false);
  const [consentEmail, setConsentEmail] = useState("");
  const [consentTouched, setConsentTouched] = useState(false);
  const consentValid =
    consentAdmin && consentUsage && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consentEmail);

  const [autodiagDone, setAutodiagDone] = useState(false);
  const [f9VideoEnded, setF9VideoEnded] = useState(false);
  const [f9VideoPlaying, setF9VideoPlaying] = useState(false);

  // Restaura estados secundarios desde localStorage al montar
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved >= 2) {
      setConsentAdmin(true);
      setConsentUsage(true);
    }
    if (saved >= 4) setAutodiagDone(true);
    if (saved >= 5) { setF9VideoEnded(true); setF9VideoPlaying(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartVideo = useCallback(() => setVideoPlaying(true), []);

  const handleVideoEnded = useCallback(() => {
    setVideoPlaying(false);
    completeFrame(1);
    if (!notifiedFrames.current.has(1)) {
      notifiedFrames.current.add(1);
      pushToast("¡Proceso guardado!");
    }
  }, [completeFrame, pushToast, notifiedFrames]);

  return (
    <>
      {/* Viewer fijo top-right — visible en toda la etapa-1 */}
      <MiniSpiralViewer stageLabel="Etapa actual: Etapa 1" stageKey="etapa-1" />

      {/* ═══ FRAME 1: Reconociendo nuestros pasos ════════════════════════ */}
      <Frame
        id="frame-modelo"
        sectionTitle="Sección 1: Reconociendo nuestros pasos"
        stageTitle="Etapa 1: Reconócete para avanzar"
        backgroundImage="/ui/uao-hero-img_1.webp"
        overlay="rgba(4, 2, 3, 0.45)"
        hint={completedFrames >= 1 ? <ScrollHint label="¡Avancemos!" /> : null}
      >
        {videoPlaying ? (
          <YouTubeNarrativePlayer
            videoId={VIDEO_REGISTRY.introModelo.videoId}
            startSeconds={VIDEO_REGISTRY.introModelo.startSeconds}
            autoplay
            onEnded={handleVideoEnded}
            className={styles.ytIntro}
          />
        ) : (
          <>
            <div className={styles.modelStage}>
              <StageViewer enableRotation activeStage={1} />
            </div>
            <p className={styles.frameInstructions}>
              Puedes interactuar con el modelo usando el scroll para acercarte y
              arrastrando con el click presionado para girarlo.
            </p>
            {completedFrames < 1 ? (
              <div className={styles.frameActions}>
                <UaoButton pill trailingIcon={<FiPlay />} onClick={handleStartVideo}>
                  Ver animación
                </UaoButton>
              </div>
            ) : null}
          </>
        )}
      </Frame>

      {/* ═══ FRAME 2: Condiciones de confianza ══════════════════════════════ */}
      {completedFrames >= 1 ? (
        <Frame
          id="frame-consentimiento"
          sectionTitle="Sección 2: Condiciones de confianza"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 2 ? <ScrollHint label="Iniciar diagnóstico" /> : null}
        >
          {completedFrames < 2 ? (
            <form className={blockStyles.formCard} onSubmit={(e) => e.preventDefault()}>
              <div className={blockStyles.stageCopy}>
                <p>Este ejercicio es individual, objetivo y confidencial.</p>
                <p>No tiene efectos administrativos. Su único propósito es orientar el camino formativo.</p>
              </div>

              <label className={blockStyles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentAdmin}
                  onChange={(e) => setConsentAdmin(e.target.checked)}
                />
                <span>Entiendo que no es una evaluación administrativa.</span>
              </label>

              <label className={blockStyles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentUsage}
                  onChange={(e) => setConsentUsage(e.target.checked)}
                />
                <span>Acepto que mis respuestas se usen para generar mi resultado y recomendaciones.</span>
              </label>

              <label className={blockStyles.fieldLabel} htmlFor="consent-email">
                Correo para enviarte el resultado
              </label>
              <input
                id="consent-email"
                type="email"
                className={blockStyles.textInput}
                placeholder="docente@uao.edu.co"
                value={consentEmail}
                onChange={(e) => setConsentEmail(e.target.value)}
                autoComplete="email"
              />

              {consentTouched && !consentValid ? (
                <p className={blockStyles.errorText}>
                  Completa los dos consentimientos e ingresa un correo válido para continuar.
                </p>
              ) : null}

              <div className={blockStyles.actionRow}>
                <UaoButton
                  pill
                  trailingIcon={<FiArrowRight />}
                  onClick={() => {
                    setConsentTouched(true);
                    if (!consentValid) return;
                    completeFrame(2);
                    if (!notifiedFrames.current.has(2)) {
                      notifiedFrames.current.add(2);
                      pushToast("¡Proceso guardado!");
                    }
                  }}
                >
                  Iniciar autodiagnóstico
                </UaoButton>
              </div>
            </form>
          ) : (
            <div className={blockStyles.formCard}>
              <div className={blockStyles.stageCopy}>
                <p>Ya diste tu consentimiento. El autodiagnóstico está habilitado.</p>
              </div>
            </div>
          )}

          <div className={styles.laiaSlot}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F6_LAIA_STEPS}
            />
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 3: Estados iniciales ══════════════════════════════════════ */}
      {completedFrames >= 2 ? (
        <Frame
          id="frame-estados"
          sectionTitle="Sección 3: Estados iniciales"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 3 ? <ScrollHint label="Continuar" /> : null}
        >
          <div className={blockStyles.stateGrid}>
            {ESTADO_CARDS.map((card) => (
              <div key={card.label} className={blockStyles.stateCard}>
                <span className={blockStyles.stateHierarchy}>{card.label}</span>
                <p className={blockStyles.stateTitle}>{card.title}</p>
                <p className={blockStyles.stateDesc}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.laiaSlot}>
            <CharacterStepDialog
              size="compact"
              density="tight"
              steps={F7_LAIA_STEPS}
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

      {/* ═══ FRAME 4: Autodiagnóstico ════════════════════════════════════════ */}
      {completedFrames >= 3 ? (
        <Frame
          id="frame-autodiagnostico"
          sectionTitle="Sección 4: Autodiagnóstico"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={completedFrames >= 4 ? <ScrollHint label="Continuar" /> : null}
        >
          <div className={styles.autodiagLayout}>
            <div className={styles.embedShell}>
              <span className={styles.embedCornerTL} aria-hidden />
              <span className={styles.embedCornerTR} aria-hidden />
              <span className={styles.embedCornerBL} aria-hidden />
              <span className={styles.embedCornerBR} aria-hidden />

              <div className={styles.embedHeader}>
                <span className={styles.embedHeaderDot} />
                <span className={styles.embedHeaderDot} />
                <span className={styles.embedHeaderDot} />
                <span className={styles.embedHeaderLabel}>AUTODIAGNÓSTICO — ETAPA 1</span>
              </div>

              <div className={styles.embedViewport}>
                <iframe
                  src={N8N_CONFIG.forms.autodiagnostic || undefined}
                  title="Autodiagnóstico Etapa 1"
                  className={styles.embedIframe}
                  loading="lazy"
                  sandbox="allow-forms allow-scripts allow-same-origin"
                />
              </div>

              <div className={styles.embedFooter}>
                <span className={styles.embedFooterStatus}>
                  {autodiagDone ? "✓ Completado" : "Pendiente de respuesta"}
                </span>
              </div>
            </div>

            <div className={styles.laiaSlot}>
              <CharacterStepDialog
                size="compact"
                density="tight"
                steps={F8_LAIA_STEPS}
                onStepChange={(idx) => {
                  if (idx === 1) setAutodiagDone(true);
                  else setAutodiagDone(false);
                }}
                onComplete={() => {
                  completeFrame(4);
                  if (!notifiedFrames.current.has(4)) {
                    notifiedFrames.current.add(4);
                    pushToast("¡Proceso guardado!");
                  }
                }}
                nextLabel={!autodiagDone ? "Autodiagnóstico completado" : "Siguiente"}
              />
            </div>
          </div>
        </Frame>
      ) : null}

      {/* ═══ FRAME 5: Transición ═════════════════════════════════════════════ */}
      {completedFrames >= 4 ? (
        <Frame
          id="frame-transicion"
          sectionTitle="Sección 5: Transición"
          backgroundImage="/ui/uao-hero-img_1.webp"
          overlay="rgba(4, 2, 3, 0.45)"
          hint={null}
        >
          {f9VideoPlaying && !f9VideoEnded ? (
            <YouTubeNarrativePlayer
              videoId={VIDEO_REGISTRY.transicionE1aE2.videoId}
              startSeconds={VIDEO_REGISTRY.transicionE1aE2.startSeconds}
              autoplay
              onEnded={() => setF9VideoEnded(true)}
              className={styles.ytTransicion}
            />
          ) : !f9VideoEnded ? (
            <div className={styles.f9Splash}>
              <div className={styles.f9ModelWrap}>
                <StageViewer enableRotation activeStage={1} />
              </div>
              <UaoButton
                pill
                trailingIcon={<FiPlay />}
                onClick={() => setF9VideoPlaying(true)}
              >
                Ver animación
              </UaoButton>
            </div>
          ) : null}

          {f9VideoEnded ? (
            <>
              <div className={styles.f9RepeatRow}>
                <UaoButton
                  variant="ghost"
                  size="sm"
                  pill
                  leadingIcon={<FiRotateCcw />}
                  onClick={() => { setF9VideoEnded(false); setF9VideoPlaying(true); }}
                >
                  Repetir animación
                </UaoButton>
              </div>

              <div className={styles.f9LaIAWrap}>
                <CharacterStepDialog
                  steps={F9_LAIA_STEPS}
                  size="default"
                  density="standard"
                  showAudioButton
                  onComplete={() => {
                    completeFrame(5);
                    if (!notifiedFrames.current.has(5)) {
                      notifiedFrames.current.add(5);
                    }
                  }}
                />
              </div>

              {completedFrames >= 5 ? (
                <div className={styles.f9NextRow}>
                  <UaoButtonLink
                    href="/etapas/etapa-2"
                    pill
                    size="lg"
                    trailingIcon={<FiArrowRight />}
                    aria-label="Ir a la siguiente etapa"
                  >
                    Ir a la siguiente etapa
                  </UaoButtonLink>
                </div>
              ) : null}
            </>
          ) : null}
        </Frame>
      ) : null}
    </>
  );
}

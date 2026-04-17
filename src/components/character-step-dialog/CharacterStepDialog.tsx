"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight, HiOutlineSpeakerWave, HiOutlineArrowPath } from "react-icons/hi2";
import { useVolume } from "@/context/VolumeContext";
import styles from "./CharacterStepDialog.module.css";

/** Memoizado para evitar re-render del avatar en cada tick del typewriter. */
const CharacterAvatar = memo(function CharacterAvatar({
  src,
  alt,
  characterName,
  onError,
}: {
  src: string;
  alt?: string;
  characterName: string;
  onError: () => void;
}) {
  return (
    <div className={styles.left}>
      <div className={styles.avatarFrame}>
        <Image
          src={src}
          alt={alt || characterName}
          fill
          className={styles.avatarImg}
          priority
          unoptimized
          onError={onError}
        />
        <div className={`${styles.avatarTag} ${styles.avatarTagInside}`}>
          {characterName}
        </div>
      </div>
    </div>
  );
});

export type CharacterDialogStep = {
  text: string;
  imgSrc: string;
  imgAlt?: string;
};

type CharacterStepDialogProps = {
  steps: CharacterDialogStep[];
  characterName?: string;
  className?: string;
  nextLabel?: string;
  size?: "default" | "compact";
  density?: "standard" | "tight";
  /** Muestra el botón de reproducir audio. Default: true. Audio pendiente de implementar. */
  showAudioButton?: boolean;
  onComplete?: (isComplete: true) => void;
};

const DEFAULT_CHARACTER_NAME = "Laia";
const DEFAULT_NEXT_LABEL = "Siguiente";
const DEFAULT_CHARACTER_IMAGE = "/ui/laia.png";
const TYPEWRITER_MS = 22;

export default function CharacterStepDialog({
  steps,
  characterName = DEFAULT_CHARACTER_NAME,
  className,
  nextLabel = DEFAULT_NEXT_LABEL,
  size = "default",
  density = "standard",
  showAudioButton = true,
  onComplete,
}: CharacterStepDialogProps) {
  const { volume } = useVolume();
  const safeSteps = useMemo(
    () => steps.filter((step) => step.text.trim() && step.imgSrc.trim()),
    [steps]
  );
  const [idx, setIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [erroredStepKey, setErroredStepKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const completionSent = useRef(false);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeOutIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (shellRef.current) {
      observer.observe(shellRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    typingAudioRef.current = new Audio("/audio/tecleo.ogg");
    typingAudioRef.current.loop = true;
    return () => {
      typingAudioRef.current?.pause();
      if (fadeOutIntervalRef.current) {
        window.clearInterval(fadeOutIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    completionSent.current = false;
  }, [safeSteps]);

  const step = safeSteps[idx] ?? safeSteps[0];
  const isLast = idx >= safeSteps.length - 1;
  const currentText = step?.text ?? "";
  const isTyping = step ? typedChars < currentText.length : false;
  const isDecisionStep = Boolean(step) && isLast && !isTyping;
  const displayedText = currentText.slice(0, typedChars);
  const stepKey = step ? `${idx}:${step.imgSrc}` : "";
  const resolvedImgSrc =
    step && erroredStepKey === stepKey ? DEFAULT_CHARACTER_IMAGE : step?.imgSrc ?? DEFAULT_CHARACTER_IMAGE;

  useEffect(() => {
    if (!step || !step.text.length || !isTyping || !isVisible) return;

    const timerId = window.setInterval(() => {
      setTypedChars((current) => {
        const next = current + 1;
        return next > step.text.length ? step.text.length : next;
      });
    }, TYPEWRITER_MS);

    return () => window.clearInterval(timerId);
  }, [isTyping, step, step?.text, isVisible]);

  useEffect(() => {
    const audio = typingAudioRef.current;
    if (!audio) return;

    if (isTyping && isVisible) {
      // Cancelar fade-out si estaba en progreso
      if (fadeOutIntervalRef.current) {
        window.clearInterval(fadeOutIntervalRef.current);
        fadeOutIntervalRef.current = null;
      }
      audio.volume = volume;
      audio.play().catch((e) => console.debug("Typing audio prevented:", e));
    } else {
      // Iniciar fade out si está reproduciendo
      if (audio.paused || fadeOutIntervalRef.current) return;

      const FADE_STEP = 0.05;
      const FADE_INTERVAL = 30;

      fadeOutIntervalRef.current = window.setInterval(() => {
        if (audio.volume > FADE_STEP) {
          audio.volume = Math.max(0, audio.volume - FADE_STEP);
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          if (fadeOutIntervalRef.current) {
            window.clearInterval(fadeOutIntervalRef.current);
            fadeOutIntervalRef.current = null;
          }
        }
      }, FADE_INTERVAL);
    }
  }, [isTyping, volume, isVisible]);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/audio/button.ogg");
      audio.volume = volume;
      audio.play().catch((e) => {
        // Ignorar el error si el navegador bloquea la reproducción automática
        console.debug("Audio play prevented:", e);
      });
    } catch (e) {
      // Ignorar si Audio no está disponible
    }
  }, [volume]);

  const goNext = useCallback(() => {
    if (!step) return;

    if (isTyping) {
      setTypedChars(step.text.length);
      return;
    }

    playClickSound();

    if (!isLast) {
      setIdx((current) => Math.min(current + 1, safeSteps.length - 1));
      setTypedChars(0);
      setErroredStepKey(null);
      return;
    }
  }, [isLast, isTyping, safeSteps.length, step]);

  const goPrevious = useCallback(() => {
    if (!step) return;
    if (idx <= 0) return;
    playClickSound();
    setIdx((current) => Math.max(current - 1, 0));
    setTypedChars(0);
    setErroredStepKey(null);
  }, [idx, step, playClickSound]);

  const completeDialog = useCallback(() => {
    if (!completionSent.current) {
      playClickSound();
      completionSent.current = true;
      onComplete?.(true);
    }
  }, [onComplete, playClickSound]);

  const restartDialog = useCallback(() => {
    playClickSound();
    setIdx(0);
    setTypedChars(0);
    setErroredStepKey(null);
    completionSent.current = false;
  }, [playClickSound]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isEditable =
        Boolean(target?.isContentEditable) ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (isEditable) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isDecisionStep) {
          completeDialog();
          return;
        }
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [completeDialog, goNext, goPrevious, isDecisionStep]);

  const handleAvatarError = useCallback(() => {
    if (step && step.imgSrc !== DEFAULT_CHARACTER_IMAGE) {
      setErroredStepKey(stepKey);
    }
  }, [step, stepKey]);

  if (!step) return null;

  return (
    <div
      ref={shellRef}
      className={`${styles.shell} ${size === "compact" ? styles.compact : ""
        } ${styles.modelCenter} ${density === "tight" ? styles.tight : ""
        } ${className ?? ""}`.trim()}
    >
      <CharacterAvatar
        src={resolvedImgSrc}
        alt={step.imgAlt}
        characterName={characterName}
        onError={handleAvatarError}
      />

      <div className={styles.right}>
        <div className={styles.dialogBox}>
          <div className={styles.dialogText}>
            {displayedText}
            {isTyping ? <span className={styles.cursor} /> : null}
          </div>

          <div className={styles.actions}>
            <div className={styles.leftActions}>
              {showAudioButton ? (
                <button
                  type="button"
                  className={styles.audioBtn}
                  aria-label="Reproducir audio"
                  disabled
                  tabIndex={-1}
                  title="Audio próximamente"
                >
                  <HiOutlineSpeakerWave />
                </button>
              ) : null}
              <button
                type="button"
                className={styles.navBtn}
                onClick={goPrevious}
                disabled={idx <= 0}
                aria-label="Anterior"
                title="Anterior (flecha izquierda)"
              >
                <span className={styles.arrow}><HiChevronLeft size={20} /></span>
              </button>
            </div>

            <div className={styles.counter}>
              {idx + 1}/{safeSteps.length}
            </div>

            {isDecisionStep ? (
              <div className={styles.endActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={restartDialog}
                >
                  <HiOutlineArrowPath size={16} /> Repetir
                </button>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={completeDialog}
                >
                  Continuar <span className={styles.arrow}><HiChevronRight size={18} /></span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={goNext}
                title="Siguiente (flecha derecha)"
              >
                {nextLabel} <span className={styles.arrow}><HiChevronRight size={18} /></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

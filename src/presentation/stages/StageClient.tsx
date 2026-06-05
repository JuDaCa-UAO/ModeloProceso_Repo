/**
 * PRESENTATION — Client Component (Stage Engine — Orquestador)
 *
 * Responsabilidades de este componente:
 *   - Estado compartido entre frames: completedFrames, toasts, menuOpen
 *   - Persistencia: lee/escribe localStorage (progreso de frames y ruta actual)
 *   - Shell visual: PauseMenu, ToastStack, BackgroundAudio
 *   - Despacho: renderiza el componente de frames correspondiente a cada etapa
 *
 * La lógica de frames de cada etapa vive en su propio componente:
 *   introduccion → introduccion/IntroduccionFrames.tsx
 *   etapa-1 → stage-1-diagnostico/Stage1Frames.tsx
 *   etapa-2 → stage-2-discover/Stage2Frames.tsx  (placeholder)
 *   ...
 *
 * Sistema de frames progresivos:
 *   - completedFrames cuenta cuántos frames han terminado.
 *   - Frame N se renderiza cuando completedFrames >= N-1.
 *   - completeFrame(N) avanza el contador y persiste en localStorage.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToastStack from "@/components/stage/ToastStack";
import type { Toast } from "@/components/stage/ToastStack";
import PauseMenu from "@/components/stage/PauseMenu";
import { writeProgress } from "@/lib/progress";
import BackgroundAudio from "@/components/audio/BackgroundAudio";
import styles from "./stageClient.module.css";
import { readFrameProgress, saveFrameProgress } from "./shared/frameProgress";
import IntroduccionFrames from "./introduccion/IntroduccionFrames";
import Stage1Frames from "./stage-1-diagnostico/Stage1Frames";
import Stage2Frames from "./stage-2-discover/Stage2Frames";
import Stage3Frames from "./stage-3-design/Stage3Frames";
import Stage4Frames from "./stage-4-prepare/Stage4Frames";
import Stage5Frames from "./stage-5-implement/Stage5Frames";
import Stage6Frames from "./stage-6-reflect/Stage6Frames";

type StageClientProps = {
  stageId: string;
  stageName: string;
};

export default function StageClient({ stageId }: StageClientProps) {
  const [completedFrames, setCompletedFrames] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);
  const notifiedFrames = useRef(new Set<number>());

  const pushToast = useCallback((text: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeFrame = useCallback(
    (frameIndex: number) => {
      setCompletedFrames((prev) => {
        const next = Math.max(prev, frameIndex);
        if (next > prev) saveFrameProgress(stageId, next);
        return next;
      });
    },
    [stageId]
  );

  // Hidrata completedFrames desde localStorage al montar.
  // Seguro: page.tsx usa dynamic({ ssr: false }), no hay SSR de este componente.
  useEffect(() => {
    const saved = readFrameProgress(stageId);
    if (saved > 0) {
      notifiedFrames.current = new Set(Array.from({ length: saved }, (_, i) => i + 1));
      setCompletedFrames(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeProgress({ hasStarted: true, lastRoute: `/etapas/${stageId}` });
  }, [stageId]);

  const sharedProps = { stageId, completedFrames, completeFrame, pushToast, notifiedFrames };

  function renderStage() {
    switch (stageId) {
      case "introduccion": return <IntroduccionFrames {...sharedProps} />;
      case "etapa-1": return <Stage1Frames {...sharedProps} />;
      case "etapa-2": return <Stage2Frames {...sharedProps} />;
      case "etapa-3": return <Stage3Frames {...sharedProps} />;
      case "etapa-4": return <Stage4Frames {...sharedProps} />;
      case "etapa-5": return <Stage5Frames {...sharedProps} />;
      case "etapa-6": return <Stage6Frames {...sharedProps} />;
      default:        return null;
    }
  }

  return (
    <div className={styles.root}>
      {(stageId === "introduccion" || stageId === "etapa-1") && (
        <BackgroundAudio src="/audio/fondo.ogg" />
      )}
      <PauseMenu open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      {renderStage()}
    </div>
  );
}

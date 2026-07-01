"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./inicio.module.css";
import { useProgress } from "../../lib/useProgress";
import { UaoButton, UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";

export default function ActionButtons() {
  const { progress, reset } = useProgress();
  const showContinue = progress.hasStarted;
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleStartOver = () => {
    if (showContinue) {
      setShowConfirmModal(true);
    } else {
      router.push("/etapas/introduccion");
    }
  };

  const confirmReset = () => {
    reset();
    setShowConfirmModal(false);
    router.push("/etapas/introduccion");
  };

  const cancelReset = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className={styles.buttonsCol}>
        {showContinue && (
          <UaoButtonLink
            variant="secondary"
            size="lg"
            className={styles.actionBtn}
            href={progress.lastRoute || "/etapas/introduccion"}
          >
            Continuar
          </UaoButtonLink>
        )}

        <UaoButton
          variant="secondary"
          size="lg"
          className={styles.actionBtn}
          onClick={handleStartOver}
        >
          {showContinue ? "Comenzar de nuevo" : "Iniciar"}
        </UaoButton>

        <UaoButtonLink variant="secondary" size="lg" className={styles.actionBtn} href="/etapas">
          Etapas
        </UaoButtonLink>

        <UaoButtonLink variant="secondary" size="lg" className={styles.actionBtn} href="/opciones">
          Opciones
        </UaoButtonLink>
      </div>

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>¿Comenzar de nuevo?</h2>
            <p className={styles.modalText}>
              Esta acción borrará todo tu progreso actual y regresarás a la introducción. ¿Estás seguro?
            </p>
            <div className={styles.modalActions}>
              <UaoButton variant="secondary" onClick={cancelReset}>
                Cancelar
              </UaoButton>
              <UaoButton variant="danger" onClick={confirmReset}>
                Sí, borrar todo
              </UaoButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import styles from "./inicio.module.css";
import { useProgress } from "../../lib/useProgress";
import { UaoButtonLink } from "@/components/uao/UaoButton/UaoButton";

export default function ActionButtons() {
  const { progress } = useProgress();
  const showContinue = progress.hasStarted;

  return (
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

      <UaoButtonLink variant="secondary" size="lg" className={styles.actionBtn} href="/etapas/introduccion">
        Iniciar
      </UaoButtonLink>

      <UaoButtonLink variant="secondary" size="lg" className={styles.actionBtn} href="/etapas">
        Etapas
      </UaoButtonLink>

      <UaoButtonLink variant="secondary" size="lg" className={styles.actionBtn} href="/opciones">
        Opciones
      </UaoButtonLink>
    </div>
  );
}

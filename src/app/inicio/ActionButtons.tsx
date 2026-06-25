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
          href={progress.lastRoute || "/etapas/introduccion"}
        >
          Continuar
        </UaoButtonLink>
      )}

      <UaoButtonLink variant="primary" size="lg" href="/etapas/introduccion">
        Iniciar
      </UaoButtonLink>

      <UaoButtonLink variant="secondary" size="lg" href="/etapas">
        Etapas
      </UaoButtonLink>

      <UaoButtonLink variant="danger" size="lg" href="/opciones">
        Opciones
      </UaoButtonLink>
    </div>
  );
}

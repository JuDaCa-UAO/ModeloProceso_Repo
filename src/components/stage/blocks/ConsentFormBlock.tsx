"use client";

import { useState } from "react";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import type { BlockContext } from "./BlockContext";

type ConsentFormBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque de formulario de consentimiento.
 * Extraído de Etapa1Client.tsx (God Component) como componente independiente.
 *
 * Responsabilidades: UI del formulario + validación de interacción.
 * La validación de negocio (consentValid) viene de ctx.flags.consentValidated
 * calculado por EvaluateFlagsUseCase en la capa Application.
 */
export default function ConsentFormBlock({ ctx }: ConsentFormBlockProps) {
  const [touched, setTouched] = useState(false);
  const { state, flags, onUpdate, onScrollTo } = ctx;

  return (
    <form
      className={styles.formCard}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.stageCopy}>
        <p>Este ejercicio es individual, objetivo y confidencial.</p>
        <p>No tiene efectos administrativos. Su único propósito es orientar el camino formativo.</p>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={state.consentAdmin}
          onChange={(event) => onUpdate({ consentAdmin: event.target.checked })}
        />
        <span>Entiendo que no es una evaluación administrativa.</span>
      </label>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={state.consentUsage}
          onChange={(event) => onUpdate({ consentUsage: event.target.checked })}
        />
        <span>Acepto que mis respuestas se usen para generar mi resultado y recomendaciones.</span>
      </label>

      <label className={styles.fieldLabel} htmlFor="consent-email">
        Correo para enviarte el resultado
      </label>
      <input
        id="consent-email"
        type="email"
        className={styles.textInput}
        placeholder="docente@uao.edu.co"
        value={state.email}
        onChange={(event) => onUpdate({ email: event.target.value })}
        autoComplete="email"
      />

      {touched && !flags.consentValidated ? (
        <p className={styles.errorText}>
          Completa los dos consentimientos, una dirección de correo válida y la animación inicial para continuar.
        </p>
      ) : null}

      <div className={styles.actionRow}>
        <button
          type="button"
          className={stageStyles.buttonPrimary}
          onClick={() => {
            setTouched(true);
            if (!flags.consentValidated) return;
            onUpdate({ autodiagnosticStarted: true });
            window.setTimeout(() => onScrollTo("autodiagnostico"), 120);
          }}
        >
          Iniciar autodiagnóstico
        </button>
      </div>

      <p className={styles.helperText}>
        Este paso habilita el módulo de autodiagnóstico y mantiene la experiencia confidencial.
      </p>
    </form>
  );
}

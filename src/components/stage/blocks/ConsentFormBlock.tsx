"use client";

import { useState } from "react";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import type { BlockContext } from "./BlockContext";

type ConsentFormBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque de consentimiento previo al autodiagnostico.
 *
 * Mantiene la validacion real derivada desde Application/Domain
 * y se limita a presentar la UI, reforzar el contexto y destrabar
 * el siguiente tramo del flujo cuando el acuerdo es valido.
 */
export default function ConsentFormBlock({ ctx }: ConsentFormBlockProps) {
  const [touched, setTouched] = useState(false);
  const { state, flags, onUpdate, onScrollTo } = ctx;
  const isReady = flags.consentValidated;

  return (
    <form className={styles.formCard} onSubmit={(event) => event.preventDefault()}>
      <div className={styles.stageCopy}>
        <p>Este ejercicio es individual y confidencial.</p>
        <p>No tiene un fin punitivo ni efectos administrativos sobre tu labor docente.</p>
        <p>Su proposito es formativo: orientar el acompanamiento dentro de la cartilla.</p>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={state.consentAdmin}
          onChange={(event) => onUpdate({ consentAdmin: event.target.checked })}
        />
        <span>Entiendo que este ejercicio no se usa para evaluacion administrativa ni sancionatoria.</span>
      </label>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={state.consentUsage}
          onChange={(event) => onUpdate({ consentUsage: event.target.checked })}
        />
        <span>
          Acepto que mis respuestas se usen para construir una lectura formativa y
          recomendaciones de acompanamiento.
        </span>
      </label>

      <label className={styles.fieldLabel} htmlFor="consent-email">
        Correo para compartirte tu resultado
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

      <div className={styles.consentSummary}>
        <span className={styles.consentSummaryLabel}>
          {isReady ? "Consentimiento listo" : "Consentimiento pendiente"}
        </span>
        <p className={styles.consentSummaryText}>
          {isReady
            ? "Ya puedes continuar al siguiente tramo del flujo. Este acuerdo habilita el paso posterior y prepara la apertura del autodiagnostico."
            : "Para continuar, debes confirmar ambos acuerdos y registrar un correo valido. El resto del flujo depende de este paso previo."}
        </p>
      </div>

      {touched && !isReady ? (
        <p className={styles.errorText}>
          Completa los dos acuerdos y escribe un correo valido para habilitar el siguiente
          bloque del recorrido.
        </p>
      ) : null}

      <div className={styles.actionRow}>
        <button
          type="button"
          className={stageStyles.buttonPrimary}
          onClick={() => {
            setTouched(true);
            if (!isReady) return;
            onUpdate({ autodiagnosticStarted: true });
            window.setTimeout(() => onScrollTo("chatbot-contextual"), 120);
          }}
        >
          Aceptar y continuar
        </button>
      </div>

      <p className={styles.helperText}>
        Este paso habilita el siguiente tramo del flujo y conserva el caracter
        confidencial, no punitivo y formativo de la experiencia.
      </p>
    </form>
  );
}

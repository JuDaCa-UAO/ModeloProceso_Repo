"use client";

import { useState } from "react";
import stageStyles from "@/components/stage/stage.module.css";
import styles from "./blocks.module.css";
import { isRequired } from "@domain/shared/validation/RequiredValidator";
import type { BlockContext } from "./BlockContext";

type IntentionFormBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque del formulario de intención personal.
 *
 * La validación "intención no vacía" usa isRequired del dominio,
 * no lógica inline en el componente.
 */
export default function IntentionFormBlock({ ctx }: IntentionFormBlockProps) {
  const [touched, setTouched] = useState(false);
  const { state, onUpdate, onScrollTo } = ctx;

  const intentionValid = isRequired(state.intentionText);

  return (
    <form
      className={styles.formCard}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.intentGrid}>
        <label className={styles.fieldLabel} htmlFor="intention-text">
          Mi intención para este recorrido es…
        </label>
        <textarea
          id="intention-text"
          className={styles.textArea}
          value={state.intentionText}
          onChange={(event) =>
            onUpdate({ intentionText: event.target.value, intentionSaved: false })
          }
          placeholder="Ej.: Diseñar una actividad concreta con GenAI alineada a mis objetivos de aprendizaje"
          maxLength={280}
        />

        <label className={styles.fieldLabel} htmlFor="intention-emotion">
          Emoción con la que inicio (opcional)
        </label>
        <select
          id="intention-emotion"
          className={styles.selectInput}
          value={state.emotion}
          onChange={(event) =>
            onUpdate({ emotion: event.target.value, intentionSaved: false })
          }
        >
          <option value="">Selecciona una opción</option>
          <option value="curiosidad">Curiosidad</option>
          <option value="expectativa">Expectativa</option>
          <option value="duda">Duda</option>
          <option value="entusiasmo">Entusiasmo</option>
          <option value="cautela">Cautela</option>
        </select>
      </div>

      {touched && !intentionValid ? (
        <p className={styles.errorText}>Escribe una intención breve para continuar.</p>
      ) : null}

      <div className={styles.actionRow}>
        <button
          type="button"
          className={stageStyles.buttonPrimary}
          onClick={() => {
            setTouched(true);
            if (!intentionValid) return;
            onUpdate({ intentionSaved: true });
            window.setTimeout(() => onScrollTo("transicion-etapa-2"), 120);
          }}
        >
          {state.intentionSaved ? "Intención guardada" : "Guardar intención"}
        </button>
      </div>

      <p className={styles.helperText}>
        Este registro se conserva localmente para acompañar tu recorrido en esta experiencia.
      </p>
    </form>
  );
}

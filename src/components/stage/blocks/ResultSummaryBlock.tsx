"use client";

import styles from "./blocks.module.css";
import { deriveResultRecommendations } from "@domain/stage/rules/ResultRule";
import { STATE_CARDS } from "@/content/stages/stage-1.content";
import type { BlockContext } from "./BlockContext";

type ResultSummaryBlockProps = {
  ctx: BlockContext;
};

/**
 * Bloque de resumen de resultado del autodiagnóstico.
 *
 * Las recomendaciones vienen de deriveResultRecommendations
 * (regla pura del dominio) — no están hardcodeadas en el componente.
 */
export default function ResultSummaryBlock({ ctx }: ResultSummaryBlockProps) {
  const { state } = ctx;

  const byId = {
    inicial: STATE_CARDS[0],
    intermedio: STATE_CARDS[1],
    avanzado: STATE_CARDS[2],
  } as const;

  const selectedCard = byId[state.resultStateId] ?? STATE_CARDS[1];
  const recommendations = deriveResultRecommendations(state.resultStateId);

  return (
    <div className={styles.resultGrid}>
      <section className={`${styles.resultCard} ${styles.resultCardWide}`}>
        <h3>Estado de partida identificado</h3>
        <span className={styles.pill}>
          {selectedCard.hierarchy} — {selectedCard.title}
        </span>
        <div className={styles.metricGrid}>
          <div>
            <span className={styles.metricLabel}>Lectura inicial</span>
            <div className={styles.metricValue}>{selectedCard.description}</div>
          </div>
          <div>
            <span className={styles.metricLabel}>Cómo afecta el recorrido</span>
            <div className={styles.metricValue}>
              Ajusta ritmo sugerido, ayudas y recomendaciones, sin bloquear contenido.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.resultCard}>
        <h3>Estados posibles</h3>
        <ul className={styles.listStack}>
          {STATE_CARDS.map((item) => (
            <li key={item.title}>
              {item.hierarchy} — {item.title}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.resultCard}>
        <h3>Recomendaciones iniciales</h3>
        <ul className={styles.listStack}>
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

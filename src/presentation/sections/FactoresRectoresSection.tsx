import type { Factor } from "@domain/content/Factor";
import styles from "./FactoresRectoresSection.module.css";

export default function FactoresRectoresSection({ factores }: { factores: Factor[] }) {
  return (
    <section data-reveal data-screen-label="Factores rectores" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Los cinco factores que guían cada etapa</h2>
        <p className={styles.description}>
          Sin importar tu estado, estos <strong>factores rectores</strong> son el marco común que asegura una
          integración de la IA coherente, responsable y de calidad. Tu compromiso como docente es cumplirlos en
          cada etapa.
        </p>
        <div className={styles.grid}>
          {factores.map((factor) => (
            <div key={factor.id} className={styles.card}>
              <span className={styles.cardId}>{factor.id}</span>
              <h3 className={styles.cardName}>{factor.name}</h3>
              <p className={styles.cardQuestion}>{factor.question}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

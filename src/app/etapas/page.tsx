import Link from "next/link";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import { STAGE_META } from "@/content/stages/index";
import styles from "./etapas.module.css";

export default function EtapasPage() {
  return (
    <div className={styles.stage}>
      <TechTrailBackground className={styles.background} />

      <main className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Etapas del modelo</h1>
            <p className={styles.subtitle}>
              Selecciona la etapa a la que deseas acceder
            </p>
          </header>

          <ul className={styles.list}>
            {STAGE_META.map((stage) => (
              <li key={stage.id}>
                {stage.available ? (
                  <Link href={stage.href} className={styles.itemAvailable}>
                    <span className={styles.order}>
                      {String(stage.order).padStart(2, "0")}
                    </span>
                    <span className={styles.name}>{stage.name}</span>
                    <span className={styles.arrow}>→</span>
                  </Link>
                ) : (
                  <div className={styles.itemLocked} aria-disabled>
                    <span className={styles.order}>
                      {String(stage.order).padStart(2, "0")}
                    </span>
                    <span className={styles.name}>{stage.name}</span>
                    <span className={styles.lockBadge}>Próximamente</span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.footer}>
            <Link href="/inicio" className={styles.backLink}>
              ← Volver al inicio
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

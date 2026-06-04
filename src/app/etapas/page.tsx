import Link from "next/link";
import TechTrailBackground from "@/components/tech-trail-background/TechTrailBackground";
import InteractiveSpiral from "@/components/InteractiveSpiral/InteractiveSpiral";
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

          <InteractiveSpiral />

          {STAGE_META[0] && (
            <Link href={STAGE_META[0].href} className={styles.stage0Button}>
              <span className={styles.stage0Order}>
                {String(STAGE_META[0].order).padStart(2, "0")}
              </span>
              <span>{STAGE_META[0].name}</span>
            </Link>
          )}

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

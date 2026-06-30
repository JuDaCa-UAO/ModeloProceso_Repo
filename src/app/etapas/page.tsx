import Link from "next/link";
import InteractiveSpiral from "@/components/InteractiveSpiral/InteractiveSpiral";
import { STAGE_META } from "@/content/stages/index";
import styles from "./etapas.module.css";

export default function EtapasPage() {
  return (
    <div className={styles.stage}>
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
            <div className={styles.introSection}>
              <p className={styles.introText}>
                <strong>Introducción:</strong> Aquí podrás reconocer de qué se trata el modelo de proceso para la integración responsable de GenAI en la formación docente.
              </p>
              <Link href={STAGE_META[0].href} className={styles.stage0Button}>
                <span>Regresar a la Introducción</span>
              </Link>
            </div>
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

import type { Block } from "@domain/content/Block";
import styles from "../ContentSection.module.css";

/**
 * Tarjeta CTA "Haz tu autodiagnóstico". Hoy es un enlace estático — la
 * Fase 13 la conecta a `IAutodiagnosticGateway` (modal lazy con el iframe
 * n8n real, corrigiendo el bug de env documentado en `contexto/context.md`).
 */
export default function AutodiagnosticBlock({ block }: { block: Extract<Block, { type: "autodiagnostic" }> }) {
  return (
    <div className={styles.downloadCard}>
      <div>
        <h3 className={styles.downloadTitle}>{block.title}</h3>
        <p className={styles.downloadDescription}>{block.description}</p>
      </div>
      <a className={styles.downloadButton} href="#autodiagnostico">
        {block.ctaLabel}
      </a>
    </div>
  );
}

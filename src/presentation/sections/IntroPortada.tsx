/**
 * PRESENTATION — Server Component
 *
 * Portada de la Cartilla (Capítulo 0): hero con logo UAO, título, cita de
 * Einstein y el visor 3D de la espiral. Las URLs de medios llegan YA
 * resueltas desde `app/cartilla/page.tsx` — este componente no conoce
 * `MediaKey` ni proveedores.
 */
import Image from "next/image";
import type { IntroCover } from "@domain/content/Cartilla";
import IntroSpiralViewer from "@/presentation/spiral/IntroSpiralViewer";
import styles from "./IntroPortada.module.css";

interface IntroPortadaProps {
  cover: IntroCover;
  heroBackgroundUrl: string | null;
  logoUrl: string | null;
}

export default function IntroPortada({ cover, heroBackgroundUrl, logoUrl }: IntroPortadaProps) {
  return (
    <section id="inicio" className={styles.hero}>
      {heroBackgroundUrl ? (
        <Image src={heroBackgroundUrl} alt="" fill sizes="100vw" className={styles.heroBackground} priority />
      ) : null}
      <div className={styles.card}>
        <div className={styles.textCol}>
          {logoUrl ? (
            <Image src={logoUrl} alt="Universidad Autónoma de Occidente" width={150} height={48} className={styles.logo} priority />
          ) : null}
          <div className={styles.eyebrow}>
            <span className={styles.badge}>CARTILLA</span>
            <span className={styles.chapterLabel}>CAPÍTULO 0 · INTRODUCCIÓN</span>
          </div>
          <h1 className={styles.title}>{cover.title}</h1>
          <blockquote className={styles.quote}>
            &ldquo;{cover.quote}&rdquo;
            <br />
            <span className={styles.quoteAuthor}>— {cover.quoteAuthor}</span>
          </blockquote>
          <p className={styles.description}>{cover.description}</p>
        </div>
        <IntroSpiralViewer caption="El modelo en espiral · arrástralo para explorarlo" />
      </div>
      <div className={styles.scrollHint}>
        <span>Desplázate para comenzar</span>
        <span className={styles.scrollArrow} aria-hidden>
          ▼
        </span>
      </div>
    </section>
  );
}

"use client";

/**
 * PRESENTATION — Client Component
 *
 * Carrusel de evidencias (Etapa 5): un panel visible a la vez, dots + ← / →
 * + contador "N de M · etiqueta" — mismo patrón que `slider` en el script de
 * `Cartilla.dc.html`. Recibe las imágenes YA resueltas; no conoce `MediaKey`.
 *
 * Fluidez (fix de la entrada 36 de la bitácora): las evidencias fuente son
 * enormes (~8478 px), así que un `<img>` crudo tardaba en decodificar al
 * cambiar de panel y parecía "no avanzar" (había que pulsar dos veces). Se
 * usa `next/image` (variante optimizada ~640 px, decodificación instantánea)
 * y se montan TODAS las diapositivas apiladas con crossfade por opacidad: al
 * entrar el carrusel en viewport se precargan las 5, y cambiar de panel es un
 * toggle de opacidad — sin recarga, sin parpadeo, sin salto de layout.
 */
import { useCallback, useState } from "react";
import Image from "next/image";
import styles from "./EvidenceCarousel.module.css";

export interface ResolvedCarouselPanel {
  id: string;
  label: string;
  imageUrl: string | null;
  imageAlt: string;
  fallback: string;
}

export default function EvidenceCarousel({ panels }: { panels: ResolvedCarouselPanel[] }) {
  const total = panels.length;
  const [index, setIndex] = useState(0);

  // Salto acotado a [0, total-1]: un único punto de mutación para botones,
  // dots y teclado — sin lógica duplicada en cada handler.
  const goTo = useCallback(
    (next: number) => setIndex(Math.min(total - 1, Math.max(0, next))),
    [total]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  const current = panels[index];
  if (!current) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.counter}>
        <span className={styles.counterLabel}>
          {index + 1} de {total} · {current.label}
        </span>
      </div>
      <div
        className={styles.stage}
        role="group"
        aria-roledescription="carrusel"
        aria-label="Evidencias para mejorar"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {panels.map((p, i) => (
          <div key={p.id} className={styles.slide} data-active={i === index} aria-hidden={i !== index}>
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.imageAlt}
                fill
                sizes="(max-width: 620px) 90vw, 560px"
                className={styles.slideImage}
                priority={i === 0}
              />
            ) : (
              <span className={styles.fallback}>{p.fallback}</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButtonSecondary}
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          ← Anterior
        </button>
        <div className={styles.dots}>
          {panels.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Ver evidencia ${i + 1}: ${p.label}`}
              aria-current={i === index}
              title={`Ver evidencia ${i + 1}: ${p.label}`}
              className={i === index ? `${styles.dot} ${styles.dotActive}` : styles.dot}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.navButtonPrimary}
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

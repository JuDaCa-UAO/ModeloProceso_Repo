/**
 * PRESENTATION — Frame
 *
 * Contenedor de pantalla completa (100dvh) con fondo personalizable.
 * Cada "frame" del recorrido ocupa la vista completa del viewport.
 *
 * El título de sección aparece arriba a la izquierda con estilo de bracket tech.
 *
 * Para usar una imagen de fondo, coloca el archivo en:
 *   public/ui/frames/<nombre>.jpg   (o .png / .webp)
 * y pásalo como:  backgroundImage="/ui/frames/mi-imagen.jpg"
 *
 * Uso:
 *   <Frame sectionTitle="Sección 1: Bienvenido/a" background="#0a0506">
 *     <h1>Contenido</h1>
 *   </Frame>
 *
 *   <Frame
 *     sectionTitle="Sección 1: Bienvenido/a"
 *     backgroundImage="/ui/frames/corredor.jpg"
 *     overlay="rgba(0,0,0,0.52)"
 *   >
 *     <MiComponente />
 *   </Frame>
 */

"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./Frame.module.css";

export type FrameProps = {
  children: ReactNode;
  /** Título del frame — aparece en la esquina superior izquierda con estilo bracket. */
  sectionTitle?: string;
  /** CSS background (color, gradiente, etc.). Se ignora si backgroundImage está presente. */
  background?: string;
  /**
   * URL de imagen de fondo.
   * Coloca las imágenes en public/ui/frames/ y referencia como "/ui/frames/nombre.jpg".
   */
  backgroundImage?: string;

  /** Color/gradiente de overlay sobre el fondo. Ej: "rgba(0,0,0,0.5)" */
  overlay?: string;
  /** Alineación vertical del contenido. Default: "center". */
  align?: "start" | "center" | "end";
  /**
   * Indicador de avance anclado al fondo del frame.
   * Siempre se renderiza dentro del frame, no en el flujo de la página.
   * Uso: hint={<ScrollHint label="..." />}
   */
  hint?: ReactNode;
  /** ID del frame para navegación con anclas. */
  id?: string;
  /** Clase CSS adicional. */
  className?: string;
  /** Estilos inline adicionales. */
  style?: CSSProperties;
};

export default function Frame({
  children,
  sectionTitle,
  background,
  backgroundImage,
  overlay,
  align = "center",
  hint,
  id,
  className,
  style,
}: FrameProps) {
  const alignClass =
    align === "start"
      ? styles.alignStart
      : align === "end"
        ? styles.alignEnd
        : styles.alignCenter;

  return (
    <section
      id={id}
      className={`${styles.frame} ${className ?? ""}`.trim()}
      style={{ ...style, background: backgroundImage ? undefined : background }}
    >
      {/* Background image layer */}
      {backgroundImage ? (
        <div
          className={styles.backgroundLayer}
          style={{
            background,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      {/* Overlay layer */}
      {overlay ? (
        <div className={styles.overlay} style={{ background: overlay }} />
      ) : null}

      {/* Corner bracket accents */}
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
      <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
      <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />

      {/* Section title — top-left bracket */}
      {sectionTitle ? (
        <div className={styles.sectionTitle}>
          <span className={styles.sectionTitleText}>{sectionTitle}</span>
        </div>
      ) : null}

      {/* Content */}
      <div className={`${styles.content} ${alignClass}`}>
        {children}
      </div>

      {/* Hint slot — anclado al fondo del frame */}
      {hint ? (
        <div className={styles.hintSlot}>
          {hint}
        </div>
      ) : null}
    </section>
  );
}

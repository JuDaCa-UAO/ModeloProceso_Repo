/**
 * PRESENTATION — Frame
 *
 * Contenedor de pantalla completa (100dvh) con fondo personalizable.
 * Cada "frame" del recorrido ocupa la vista completa del viewport.
 *
 * Soporta:
 * - Fondo como color/gradiente CSS (vía `background`)
 * - Fondo como imagen (vía `backgroundImage`)
 * - Overlay semi-transparente sobre el fondo
 * - Tag/etiqueta opcional arriba del contenido
 * - Alineación vertical del contenido (start, center, end)
 * - Renderizado de cualquier children
 *
 * Uso:
 *   <Frame background="linear-gradient(180deg, #0a0506, #050304)">
 *     <h1>Contenido del frame</h1>
 *   </Frame>
 *
 *   <Frame backgroundImage="/videos/bg-stage1.jpg" overlay="rgba(0,0,0,0.6)">
 *     <p>Con imagen de fondo y overlay</p>
 *   </Frame>
 */

"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./Frame.module.css";

export type FrameProps = {
  children: ReactNode;
  /** CSS background (color, gradiente, etc.). */
  background?: string;
  /** URL de imagen de fondo. Se renderiza como <img> para carga lazy. */
  backgroundImage?: string;
  /** Alt text para la imagen de fondo (accesibilidad). */
  backgroundAlt?: string;
  /** Color/gradiente de overlay sobre el fondo. Ej: "rgba(0,0,0,0.5)" */
  overlay?: string;
  /** Etiqueta opcional que aparece arriba del contenido. */
  tag?: string;
  /** Alineación vertical del contenido. Default: "start". */
  align?: "start" | "center" | "end";
  /** ID del frame para navegación con anclas. */
  id?: string;
  /** Clase CSS adicional. */
  className?: string;
  /** Estilos inline adicionales. */
  style?: CSSProperties;
};

export default function Frame({
  children,
  background,
  backgroundImage,
  backgroundAlt = "",
  overlay,
  tag,
  align = "start",
  id,
  className,
  style,
}: FrameProps) {
  const alignClass =
    align === "center"
      ? styles.alignCenter
      : align === "end"
        ? styles.alignEnd
        : styles.alignStart;

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
          style={!overlay ? { background } : undefined}
        >
          <img
            src={backgroundImage}
            alt={backgroundAlt}
            className={styles.backgroundImage}
            loading="lazy"
            draggable={false}
          />
        </div>
      ) : null}

      {/* Overlay layer */}
      {overlay ? (
        <div className={styles.overlay} style={{ background: overlay }} />
      ) : null}

      {/* Content */}
      <div className={`${styles.content} ${alignClass}`}>
        {tag ? <span className={styles.frameTag}>{tag}</span> : null}
        {children}
      </div>
    </section>
  );
}

/**
 * VIDEO REGISTRY — Fuente centralizada de referencias a videos de YouTube.
 *
 * Edita este archivo para actualizar videoIds o tiempos de inicio.
 * No pongas estas referencias directamente en los componentes de presentación.
 *
 * Cada entrada contiene:
 *   - videoId:      ID del video en YouTube.
 *   - startSeconds: Segundo desde el que debe iniciar la reproducción.
 */

export interface VideoEntry {
  /** YouTube video ID */
  videoId: string;
  /** Second to start playback from */
  startSeconds: number;
}

export const VIDEO_REGISTRY = {
  /**
   * Animación introductoria del modelo de proceso.
   * Reemplaza el archivo local /videos/intro-modelo.mp4
   */
  introModelo: {
    videoId: "FMJe_HAsEEQ",
    startSeconds: 1,
  },

  /**
   * Animación de transición de Etapa 1 a Etapa 2.
   * Reemplaza el archivo local /videos/TransicionE1-a-E2.mp4
   */
  transicionE1aE2: {
    videoId: "7ZrhwlUjViQ",
    startSeconds: 1,
  },
} as const satisfies Record<string, VideoEntry>;

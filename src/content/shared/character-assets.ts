/**
 * CONTENT — Shared Assets
 *
 * Mapa de assets visuales del personaje Laia.
 * Separado del contenido de etapas para que cambiar el personaje,
 * renombrar assets o agregar nuevos modos no requiera editar todos
 * los archivos de definición de etapas.
 *
 * Depende de: nada (solo strings de rutas de archivos públicos).
 */

export const LAIA_ASSETS = {
  neutral: "/ui/laia.png",
  explain: "/ui/laia_explaining.png",
  holo: "/ui/laia_explaining_holo.png",
  triumphant: "/ui/laia_triumphant.png",
  confused: "/ui/laia_confused.png",
} as const;

export type LaiaAssetKey = keyof typeof LAIA_ASSETS;

/**
 * MEDIA REGISTRY — Registro lógico central de recursos multimedia.
 *
 * Los componentes NO deben referenciar rutas de archivos directamente.
 * En su lugar piden un recurso por clave lógica (ej. "stage2.pughMatrix") y
 * `resolveMedia` decide de dónde sale:
 *
 *   1. Una URL remota basada en `NEXT_PUBLIC_MEDIA_BASE_URL` (si está definida).
 *   2. Una ruta local bajo `public/` (si el recurso ya existe).
 *   3. Un fallback seguro cuando el recurso todavía no existe (status "pending").
 *
 * Reglas:
 *   - Si un recurso está "pending", `resolveMedia(...).available === false` y
 *     `url === null`. La UI DEBE mostrar el `fallbackLabel` y nunca un enlace roto.
 *   - No se incrustan recursos pesados (Base64) ni se copian aquí las imágenes
 *     de diseño de `contexto/disenos/` (son referencias, no recursos de producción).
 *   - Las infografías de criterios y del ejemplo comparativo se reproducen en
 *     HTML/CSS semántico (no como imagen). Se registran igual por trazabilidad,
 *     por si más adelante se entrega un asset gráfico definitivo.
 */

export type MediaKind =
  | "svg"
  | "image"
  | "video-youtube"
  | "video-file"
  | "download"
  | "image-sequence";

export type MediaStatus = "available" | "pending";

export interface MediaEntry {
  kind: MediaKind;
  status: MediaStatus;
  /** Ruta local relativa bajo `public/` (debe empezar con "/"). */
  localPath?: string;
  /** ID de YouTube cuando kind === "video-youtube". */
  youtubeId?: string;
  /** Segundo inicial para video de YouTube. */
  startSeconds?: number;
  /** Nombre de archivo sugerido al descargar. */
  downloadName?: string;
  /** Descripción accesible del recurso (alt / aria-label). */
  description?: string;
  /** Texto visible cuando el recurso está pendiente o no carga. Sin enlaces rotos. */
  fallbackLabel: string;
}

/** Base remota opcional. Se limpia la barra final para componer URLs limpias. */
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

export const MEDIA_REGISTRY = {
  // ── Personaje / guía ──────────────────────────────────────────────────────
  "laia.leftPointingHand": {
    kind: "svg",
    status: "available",
    localPath: "/mano/Mano izq apunta.svg",
    description: "Mano de Laia señalando un control",
    fallbackLabel: "👉",
  },

  // ── Etapa 2 · recursos ────────────────────────────────────────────────────
  "stage2.section2Video": {
    kind: "video-file",
    status: "pending",
    // Ruta esperada cuando exista: public/media/etapa-2/seccion-2-propositos.mp4
    description:
      "Animación de íconos de herramientas dispersas que se organizan alrededor de propósitos educativos.",
    fallbackLabel:
      "Animación de íconos de herramientas dispersas que se organizan alrededor de propósitos educativos.",
  },
  "stage2.criteriaInfographic": {
    // Reproducida en HTML/CSS por el bloque criteria-infographic.
    kind: "image",
    status: "pending",
    description: "Infografía: cómo se miran las posibilidades (seis criterios).",
    fallbackLabel: "Infografía de criterios (versión interactiva en pantalla).",
  },
  "stage2.comparisonExample": {
    // Reproducida en HTML/CSS por el bloque comparison-example.
    kind: "image",
    status: "pending",
    description:
      "Infografía del ejemplo comparativo: tres posibilidades de IA para fortalecer un debate.",
    fallbackLabel: "Ejemplo comparativo (versión interactiva en pantalla).",
  },
  "stage2.pughMatrix": {
    kind: "download",
    status: "pending",
    // Ruta esperada cuando exista: public/media/etapa-2/Matriz-de-Pugh.pdf
    downloadName: "Matriz-de-Pugh.pdf",
    description: "Matriz de Pugh para el análisis de herramientas de GenAI.",
    fallbackLabel:
      "La Matriz de Pugh estará disponible para descarga próximamente.",
  },
  "stage2.transitionVideo": {
    kind: "video-file",
    status: "pending",
    // Ruta esperada cuando exista: public/media/etapa-2/transicion-e2-e3.mp4
    description: "Animación de transición de la Etapa 2 hacia la Etapa 3.",
    fallbackLabel: "Animación de transición (próximamente).",
  },
} as const satisfies Record<string, MediaEntry>;

export type MediaKey = keyof typeof MEDIA_REGISTRY;

export interface ResolvedMedia {
  key: MediaKey;
  kind: MediaKind;
  /** true solo si el recurso existe y es resoluble a una URL/identificador. */
  available: boolean;
  /** URL resuelta (remota o local) o null si está pendiente. */
  url: string | null;
  youtubeId?: string;
  startSeconds?: number;
  downloadName?: string;
  description?: string;
  fallbackLabel: string;
}

/**
 * Resuelve una clave lógica a un recurso utilizable.
 * Nunca lanza: si el recurso está pendiente devuelve `available: false` y `url: null`.
 */
export function resolveMedia(key: MediaKey): ResolvedMedia {
  const entry = MEDIA_REGISTRY[key];

  const base: ResolvedMedia = {
    key,
    kind: entry.kind,
    available: false,
    url: null,
    downloadName: entry.downloadName,
    description: entry.description,
    fallbackLabel: entry.fallbackLabel,
  };

  if (entry.status === "pending") return base;

  if (entry.kind === "video-youtube") {
    return {
      ...base,
      available: Boolean(entry.youtubeId),
      youtubeId: entry.youtubeId,
      startSeconds: entry.startSeconds ?? 0,
    };
  }

  if (entry.localPath) {
    const url = MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${entry.localPath}` : entry.localPath;
    return { ...base, available: true, url };
  }

  return base;
}

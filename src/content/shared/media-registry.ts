/**
 * MEDIA REGISTRY — Registro lógico central de recursos multimedia.
 *
 * Los componentes NO referencian rutas de archivos directamente: piden un
 * recurso por clave lógica (ej. "stage2.pughMatrix") y `resolveMedia` decide
 * de dónde sale.
 *
 * Salida general para contenido hosteado externamente
 * ----------------------------------------------------
 * Las infografías (SVG), la Matriz de Pugh (PDF) y los videos de la Etapa 2 son
 * recursos que se diseñan aparte y se alojarán en un host de multimedia aún por
 * definir. Se declaran con `status: "hosted"` y un `remotePath`. La resolución es:
 *
 *   - Si `NEXT_PUBLIC_MEDIA_BASE_URL` está definida → el recurso resuelve a
 *     `BASE + remotePath` y queda disponible automáticamente.
 *   - Si NO está definida (estado actual) → el recurso no está disponible y la UI
 *     muestra el `fallbackLabel` ("Próximamente"). Nunca hay enlaces rotos.
 *
 * Para activarlos más adelante: definir `NEXT_PUBLIC_MEDIA_BASE_URL` y subir los
 * archivos a las rutas `remotePath` indicadas. No hay que tocar componentes.
 *
 * Reglas: no se incrustan recursos pesados (Base64) ni se copian las imágenes de
 * diseño de `contexto/disenos/` (son referencias, no recursos de producción).
 */

export type MediaKind =
  | "svg"
  | "image"
  | "video-youtube"
  | "video-file"
  | "download"
  | "image-sequence";

/**
 * - "available": recurso local ya presente bajo `public/`.
 * - "hosted": recurso externo; disponible solo si `NEXT_PUBLIC_MEDIA_BASE_URL` está definida.
 */
export type MediaStatus = "available" | "hosted";

export interface MediaEntry {
  kind: MediaKind;
  status: MediaStatus;
  /** Ruta local relativa bajo `public/` (debe empezar con "/"). Para status "available". */
  localPath?: string;
  /** Ruta dentro del host externo (debe empezar con "/"). Para status "hosted". */
  remotePath?: string;
  /** ID de YouTube cuando kind === "video-youtube". */
  youtubeId?: string;
  /** Segundo inicial para video de YouTube. */
  startSeconds?: number;
  /** Nombre de archivo sugerido al descargar. */
  downloadName?: string;
  /** Descripción accesible del recurso (alt / aria-label). */
  description?: string;
  /** Texto visible cuando el recurso no está disponible. Sin enlaces rotos. */
  fallbackLabel: string;
}

/** Base del host de multimedia. Vacía hasta que se defina el host. */
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

export const MEDIA_REGISTRY = {
  // ── Personaje / guía (local) ──────────────────────────────────────────────
  "laia.leftPointingHand": {
    kind: "svg",
    status: "available",
    localPath: "/mano/Mano izq apunta.svg",
    description: "Mano de Laia señalando un control",
    fallbackLabel: "👉",
  },

  // ── Etapa 2 · recursos hosteados (diseñados aparte) ─────────────────────────
  "stage2.section2Video": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-2/seccion-2-propositos.mp4",
    description:
      "Animación de íconos de herramientas dispersas que se organizan alrededor de propósitos educativos.",
    fallbackLabel:
      "Animación de propósitos educativos — próximamente.",
  },
  "stage2.criteriaInfographic": {
    kind: "svg",
    status: "hosted",
    remotePath: "/etapa-2/infografia-criterios.svg",
    description: "Infografía: cómo se miran las posibilidades (seis criterios).",
    fallbackLabel: "La infografía de criterios estará disponible próximamente.",
  },
  "stage2.comparisonExample": {
    kind: "svg",
    status: "hosted",
    remotePath: "/etapa-2/infografia-comparacion.svg",
    description:
      "Infografía del ejemplo comparativo: tres posibilidades de IA para fortalecer un debate.",
    fallbackLabel: "El ejemplo comparativo estará disponible próximamente.",
  },
  "stage2.pughMatrix": {
    kind: "download",
    status: "hosted",
    remotePath: "/etapa-2/Matriz-de-Pugh.pdf",
    downloadName: "Matriz-de-Pugh.pdf",
    description: "Matriz de Pugh para el análisis de herramientas de GenAI (PDF).",
    fallbackLabel: "La Matriz de Pugh estará disponible para descarga próximamente.",
  },
  "stage2.transitionVideo": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-2/transicion-e2-e3.mp4",
    description: "Animación de transición de la Etapa 2 hacia la Etapa 3.",
    fallbackLabel: "Animación de transición — próximamente.",
  },
} as const satisfies Record<string, MediaEntry>;

export type MediaKey = keyof typeof MEDIA_REGISTRY;

export interface ResolvedMedia {
  key: MediaKey;
  kind: MediaKind;
  /** true solo si el recurso es resoluble a una URL/identificador utilizable. */
  available: boolean;
  /** URL resuelta (local o del host) o null si no está disponible. */
  url: string | null;
  youtubeId?: string;
  startSeconds?: number;
  downloadName?: string;
  description?: string;
  fallbackLabel: string;
}

/**
 * Resuelve una clave lógica a un recurso utilizable.
 * Nunca lanza: si el recurso no está disponible devuelve `available: false` y `url: null`.
 */
export function resolveMedia(key: MediaKey): ResolvedMedia {
  const entry: MediaEntry = MEDIA_REGISTRY[key];

  const base: ResolvedMedia = {
    key,
    kind: entry.kind,
    available: false,
    url: null,
    downloadName: entry.downloadName,
    description: entry.description,
    fallbackLabel: entry.fallbackLabel,
  };

  if (entry.kind === "video-youtube") {
    return {
      ...base,
      available: Boolean(entry.youtubeId),
      youtubeId: entry.youtubeId,
      startSeconds: entry.startSeconds ?? 0,
    };
  }

  // Recurso local ya presente.
  if (entry.status === "available" && entry.localPath) {
    const url = MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${entry.localPath}` : entry.localPath;
    return { ...base, available: true, url };
  }

  // Recurso hosteado: disponible solo cuando el host está configurado.
  if (entry.status === "hosted" && entry.remotePath && MEDIA_BASE_URL) {
    return { ...base, available: true, url: `${MEDIA_BASE_URL}${entry.remotePath}` };
  }

  // Sin host configurado → fallback "Próximamente".
  return base;
}

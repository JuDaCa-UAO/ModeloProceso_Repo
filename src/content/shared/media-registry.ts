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
    kind: "image",
    status: "hosted",
    localPath: "/media/etapa-2/Etapa_2_1.webp",
    remotePath: "/etapa-2/Etapa_2_1.webp",
    description: "Infografía: cómo se miran las posibilidades (seis criterios).",
    fallbackLabel: "La infografía de criterios estará disponible próximamente.",
  },
  "stage2.comparisonExample": {
    kind: "image",
    status: "hosted",
    localPath: "/media/etapa-2/Etapa_2_2.webp",
    remotePath: "/etapa-2/Etapa_2_2.webp",
    description:
      "Infografía del ejemplo comparativo: tres posibilidades de IA para fortalecer un debate.",
    fallbackLabel: "El ejemplo comparativo estará disponible próximamente.",
  },
  "stage2.pughMatrix": {
    kind: "download",
    status: "hosted",
    localPath: "/media/etapa-2/Matriz-de-Pugh.pdf",
    remotePath: "/etapa-2/Matriz-de-Pugh.pdf",
    downloadName: "Matriz-de-Pugh.pdf",
    description: "Matriz de Pugh para el análisis de herramientas de GenAI (PDF).",
    fallbackLabel: "La Matriz de Pugh estará disponible para descarga próximamente.",
  },
  "stage2.transitionVideo": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E2-a-E3.webm",
    description: "Animación de transición de la Etapa 2 hacia la Etapa 3.",
    fallbackLabel: "Animación de transición — próximamente.",
  },

  // ── Etapa 3 · recursos (Diseña con propósito) ─────────────────────────────
  "stage3.section2Video": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-3/seccion-2-propositos.mp4",
    description: "Animación de componentes pedagógicos conectados con soluciones de IA.",
    fallbackLabel: "Animación de componentes pedagógicos — próximamente.",
  },
  "stage3.designMap": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-3/Canvas_etapa3.png",
    description: "Canvas de diseño de experiencia mediada por GenAI (PNG).",
    fallbackLabel: "El Canvas de diseño estará disponible próximamente.",
  },
  "stage3.caseExample": {
    kind: "image",
    status: "hosted",
    remotePath: "/etapa-3/Ejemplo-diseno.webp",
    description: "Caso práctico de diseño didáctico mediado por IA.",
    fallbackLabel: "El ejemplo de diseño práctico estará disponible próximamente.",
  },
  "stage3.designCanvas": {
    kind: "download",
    status: "available",
    localPath: "/media/etapa-3/Canvas-de-diseno.pdf",
    downloadName: "Canvas-de-diseno.pdf",
    description: "Canvas de diseño de experiencia mediada por GenAI (PDF).",
    fallbackLabel: "El Canvas de diseño estará disponible para descarga próximamente.",
  },

  // ── Videos globales de transición (locales) ──────────────────────────────────
  "transitions.stage1Intro": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E1.webm",
    description: "Animación de introducción al modelo.",
    fallbackLabel: "Animación de introducción al modelo — próximamente.",
  },
  "transitions.stage1ToStage2": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E1-a-E2.webm",
    description: "Animación de transición de la Etapa 1 a la Etapa 2.",
    fallbackLabel: "Animación de transición de Etapa 1 a 2 — próximamente.",
  },
  "transitions.stage2ToStage3": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E2-a-E3.webm",
    description: "Animación de transición de la Etapa 2 a la Etapa 3.",
    fallbackLabel: "Animación de transición de Etapa 2 a 3 — próximamente.",
  },
  "transitions.stage3ToStage4": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E3-a-E4.webm",
    description: "Animación de transición de la Etapa 3 a la Etapa 4.",
    fallbackLabel: "Animación de transición de Etapa 3 a 4 — próximamente.",
  },
  "transitions.stage4ToStage5": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E4-a-E5.webm",
    description: "Animación de transición de la Etapa 4 a la Etapa 5.",
    fallbackLabel: "Animación de transición de Etapa 4 a 5 — próximamente.",
  },
  "transitions.stage5ToStage6": {
    kind: "video-file",
    status: "available",
    localPath: "/media/transiciones/E5-a-E6.webm",
    description: "Animación de transición de la Etapa 5 a la Etapa 6.",
    fallbackLabel: "Animación de transición de Etapa 5 a 6 — próximamente.",
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

  // Recurso hosteado: disponible cuando el host de backend está configurado.
  if (entry.status === "hosted" && entry.remotePath && MEDIA_BASE_URL) {
    return { ...base, available: true, url: `${MEDIA_BASE_URL}${entry.remotePath}` };
  }

  // Fallback local: si hay un localPath definido (sea status hosted sin host configurado, o status available), lo usamos.
  if (entry.localPath) {
    const url = MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${entry.localPath}` : entry.localPath;
    return { ...base, available: true, url };
  }

  // Sin host configurado ni localPath → fallback "Próximamente".
  return base;
}

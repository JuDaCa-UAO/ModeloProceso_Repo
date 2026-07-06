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
    description: "Mano de LaIA señalando un control",
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

  // ── Etapa 3 · recursos (Diseña con propósito) ─────────────────────────────
  "stage3.section2Video": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-3/seccion-2-propositos.mp4",
    description: "Animación de componentes pedagógicos conectados con soluciones de IA.",
    fallbackLabel: "Animación de componentes pedagógicos — próximamente.",
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

  // ── Etapa 4 · recursos (Prepara el terreno para el éxito) ──────────────────
  "stage4.section2Media": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-4/imagenes/Etapa_4_2.webp",
    description: "Infografía: preparar no es repetir el diseño (capas técnica, pedagógica y ético-emocional).",
    fallbackLabel: "El recurso de la sección 2 estará disponible próximamente.",
  },
  "stage4.readinessCanvas": {
    kind: "download",
    status: "available",
    localPath: "/media/etapa-4/descargas/Canvas-de-alistamiento-GenAI.pdf",
    downloadName: "Canvas-de-alistamiento-GenAI.pdf",
    description: "Canvas de alistamiento de la experiencia (PDF).",
    fallbackLabel: "El Canvas de alistamiento estará disponible para descarga próximamente.",
  },

  // ── Etapa 5 · recursos (Hazlo realidad en el aula) ───────────────────────────
  "stage5.classroomSimulation": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-5/simulacion.mp4",
    description: "Simulación de aula interactiva.",
    fallbackLabel: "Simulación de aula interactiva — próximamente.",
  },
  "stage5.teacherAsMediator": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-5/mediador.mp4",
    description: "Animación de acciones docentes durante el despliegue.",
    fallbackLabel: "Acciones del docente como mediador — próximamente.",
  },
  "stage5.criticalMoments": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Etapa 5.webp",
    description: "Momentos críticos durante la experiencia.",
    fallbackLabel: "Recurso de momentos críticos — próximamente.",
  },
  "stage5.rail.1": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Slider Etapa 5_1.webp",
    description: "Evidencia 1",
    fallbackLabel: "Evidencia 1 — próximamente.",
  },
  "stage5.rail.2": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Slider Etapa 5_2.webp",
    description: "Evidencia 2",
    fallbackLabel: "Evidencia 2 — próximamente.",
  },
  "stage5.rail.3": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Slider Etapa 5_3.webp",
    description: "Evidencia 3",
    fallbackLabel: "Evidencia 3 — próximamente.",
  },
  "stage5.rail.4": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Slider Etapa 5_4.webp",
    description: "Evidencia 4",
    fallbackLabel: "Evidencia 4 — próximamente.",
  },
  "stage5.rail.5": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-5/Slider Etapa 5_5.webp",
    description: "Evidencia 5",
    fallbackLabel: "Evidencia 5 — próximamente.",
  },

  // ── Etapa 6 · recursos (Reflexiona, aprende y mejora) ────────────────────────
  "stage6.evaluationDimensions": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-6/imagenes/dimensiones-evaluacion.webp",
    description: "Infografía: evaluar no es solo calificar (dimensiones pedagógica, técnica, ética, emocional y cognitiva).",
    fallbackLabel: "Infografía de dimensiones de evaluación — próximamente.",
  },
  "stage6.twoPerspectives": {
    kind: "image",
    status: "available",
    localPath: "/media/etapa-6/imagenes/dos-miradas.webp",
    description: "Infografía: dos miradas sobre la experiencia (mirada docente y mirada estudiante).",
    fallbackLabel: "Infografía de dos miradas — próximamente.",
  },
  "stage6.evaluationCanvas": {
    kind: "download",
    status: "available",
    localPath: "/media/etapa-6/descargas/Canvas-de-evaluacion-GenAI.pdf",
    downloadName: "Canvas-de-evaluacion-GenAI.pdf",
    description: "Canvas de evaluación docente-estudiante de la experiencia mediada por IA (PDF).",
    fallbackLabel: "El Canvas de evaluación estará disponible para descarga próximamente.",
  },
  "stage6.improvementSequence": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-6/hallazgo-aprendizaje-ajuste.mp4",
    description: "Animación: de hallazgo a mejora (hallazgo → aprendizaje → ajuste).",
    fallbackLabel: "Animación de hallazgo a mejora — próximamente.",
  },
  "stage6.newLoopVideo": {
    kind: "video-file",
    status: "hosted",
    remotePath: "/etapa-6/nueva-vuelta-espiral.mp4",
    description: "Animación de cierre: la espiral continúa hacia una nueva vuelta.",
    fallbackLabel: "Animación de cierre de la espiral — próximamente.",
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

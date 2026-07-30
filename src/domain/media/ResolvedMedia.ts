/**
 * DOMAIN — Value Object
 *
 * Resultado de resolver una `MediaKey`: lo único que la presentación conoce.
 * Nunca contiene lógica de proveedor — solo la URL ya resuelta (o `null`).
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaKind, VideoPlayback } from "./MediaAsset";

/**
 * Pista de subtítulos ya resuelta a URL. La presentación monta un `<track>`
 * por cada una; igual que con `url`, nunca ve claves ni proveedores.
 */
export interface ResolvedCaption {
  url: string;
  lang: string;
  label: string;
}

export interface ResolvedMedia {
  key: MediaKey;
  kind: MediaKind;
  /** true solo si el recurso es resoluble a una URL utilizable. */
  available: boolean;
  url: string | null;
  poster?: string | null;
  /** Solo las pistas que se pudieron resolver: nunca produce un `<track>` roto. */
  captions?: ResolvedCaption[];
  playback?: VideoPlayback;
  downloadName?: string;
  alt?: string;
  description?: string;
  /** Dimensiones intrínsecas (imágenes): permiten a next/image reservar el
   *  aspect-ratio y evitar layout shift. */
  width?: number;
  height?: number;
  /** Texto visible cuando `available` es false. */
  fallback: string;
}

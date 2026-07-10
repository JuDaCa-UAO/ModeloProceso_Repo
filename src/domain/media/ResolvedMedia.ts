/**
 * DOMAIN — Value Object
 *
 * Resultado de resolver una `MediaKey`: lo único que la presentación conoce.
 * Nunca contiene lógica de proveedor — solo la URL ya resuelta (o `null`).
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaKind, VideoPlayback, MediaCaption } from "./MediaAsset";

export interface ResolvedMedia {
  key: MediaKey;
  kind: MediaKind;
  /** true solo si el recurso es resoluble a una URL utilizable. */
  available: boolean;
  url: string | null;
  poster?: string | null;
  captions?: MediaCaption[];
  playback?: VideoPlayback;
  downloadName?: string;
  description?: string;
  /** Dimensiones intrínsecas (imágenes): permiten a next/image reservar el
   *  aspect-ratio y evitar layout shift. */
  width?: number;
  height?: number;
  /** Texto visible cuando `available` es false. */
  fallback: string;
}

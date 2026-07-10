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
  /** Texto visible cuando `available` es false. */
  fallback: string;
}

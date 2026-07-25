/**
 * DOMAIN — Entity
 *
 * Describe un recurso multimedia en el manifiesto, independiente de cómo se
 * entrega finalmente (ver `MediaProvider`).
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaProvider } from "./MediaProvider";

export type MediaKind = "image" | "svg" | "video" | "download";

/**
 * - "available": el proveedor puede resolverlo ya (local presente, o remoto ya subido).
 * - "pending": el recurso todavía no existe en ningún proveedor (p. ej. video-resumen no producido).
 */
export type Availability = "available" | "pending";

export interface MediaCaption {
  key: MediaKey;
  lang: string;
  label: string;
}

/**
 * Los dos comportamientos de video del diseño, modelados UNA sola vez (no se
 * repiten por etapa): transición ambiental vs. video-resumen manual.
 */
export interface VideoPlayback {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  playsInline: boolean;
}

export const TRANSITION_PLAYBACK: VideoPlayback = {
  autoplay: true,
  loop: true,
  muted: true,
  controls: false,
  playsInline: true,
};

export const SUMMARY_VIDEO_PLAYBACK: VideoPlayback = {
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
  playsInline: true,
};

interface MediaAssetBase {
  key: MediaKey;
  provider: MediaProvider;
  /** Ruta local o ruta relativa dentro del host multimedia, según `provider`. */
  ref: string;
  availability: Availability;
  /** Texto visible cuando el recurso no está disponible. Nunca hay enlaces rotos. */
  fallback: string;
  format?: string;
  mimeType?: string;
  bytes?: number;
  version?: string;
  checksum?: string;
  alt?: string;
  description?: string;
  updatedAt?: string;
  variants?: { mobile?: string; desktop?: string };
}

export interface ImageAsset extends MediaAssetBase {
  kind: "image" | "svg";
  width?: number;
  height?: number;
}

export interface VideoAsset extends MediaAssetBase {
  kind: "video";
  width?: number;
  height?: number;
  durationSec?: number;
  /** Clave de otro `MediaAsset` (imagen) a usar como poster. */
  poster?: MediaKey;
  captions?: MediaCaption[];
  playback: VideoPlayback;
}

export interface DownloadAsset extends MediaAssetBase {
  kind: "download";
  downloadName?: string;
}

export type MediaAsset = ImageAsset | VideoAsset | DownloadAsset;

export type MediaManifest = Record<string, MediaAsset>;

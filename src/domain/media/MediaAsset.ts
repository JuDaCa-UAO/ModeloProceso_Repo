/**
 * DOMAIN — Entity
 *
 * Describe un recurso multimedia en el manifiesto, independiente de cómo se
 * entrega finalmente (ver `MediaProvider`). Reemplaza a `MediaEntry` de
 * `content/shared/media-registry.ts`, que hoy vive en la capa de contenido y
 * lee `process.env` directamente — ambas violaciones se cierran aquí.
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaProvider } from "./MediaProvider";

export type MediaKind = "image" | "svg" | "video" | "download" | "audio" | "caption" | "model";

/**
 * - "available": el proveedor puede resolverlo ya (local presente, o remoto ya subido).
 * - "hosted": depende de que el proveedor esté configurado (p. ej. falta una URL base/cuenta).
 * - "pending": el recurso todavía no existe en ningún proveedor (p. ej. video-resumen no producido).
 */
export type Availability = "available" | "hosted" | "pending";

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
  /** Ruta local, clave de objeto R2, UID de Stream, o ID de Images — según `provider`. */
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

export interface AudioAsset extends MediaAssetBase {
  kind: "audio";
  durationSec?: number;
}

export interface CaptionAsset extends MediaAssetBase {
  kind: "caption";
  lang: string;
}

export interface ModelAsset extends MediaAssetBase {
  kind: "model";
}

export type MediaAsset =
  | ImageAsset
  | VideoAsset
  | DownloadAsset
  | AudioAsset
  | CaptionAsset
  | ModelAsset;

export type MediaManifest = Record<string, MediaAsset>;

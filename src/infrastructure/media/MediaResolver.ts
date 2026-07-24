/**
 * INFRASTRUCTURE — Adapter (implementa IMediaResolver)
 *
 * Resuelve una `MediaKey` probando los adaptadores de proveedor en orden
 * hasta que uno la soporte y construya una URL. Nunca lanza: clave ausente
 * del manifiesto, asset `pending`, o ningún adaptador disponible → siempre
 * devuelve un `ResolvedMedia` con `available: false` y su `fallback`.
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { MediaManifest } from "@domain/media/MediaAsset";
import type { ResolvedMedia } from "@domain/media/ResolvedMedia";
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import type { MediaProviderAdapter } from "./providers/MediaProviderAdapter";

export class MediaResolver implements IMediaResolver {
  constructor(
    private readonly manifest: MediaManifest,
    private readonly adapters: MediaProviderAdapter[]
  ) {}

  resolve(key: MediaKey): ResolvedMedia {
    const asset = this.manifest[key];

    if (!asset) {
      return { key, kind: "image", available: false, url: null, fallback: "Recurso no encontrado." };
    }

    const isImage = asset.kind === "image" || asset.kind === "svg";

    const unavailable: ResolvedMedia = {
      key,
      kind: asset.kind,
      available: false,
      url: null,
      alt: asset.alt,
      description: asset.description,
      fallback: asset.fallback,
      playback: asset.kind === "video" ? asset.playback : undefined,
      captions: asset.kind === "video" ? asset.captions : undefined,
      downloadName: asset.kind === "download" ? asset.downloadName : undefined,
      width: isImage ? asset.width : undefined,
      height: isImage ? asset.height : undefined,
    };

    if (asset.availability === "pending") {
      return unavailable;
    }

    const adapter = this.adapters.find((candidate) => candidate.supports(asset));
    const url = adapter?.buildUrl(asset) ?? null;

    if (!url) {
      return unavailable;
    }

    const poster = asset.kind === "video" && asset.poster ? this.resolve(asset.poster).url ?? undefined : undefined;

    return { ...unavailable, available: true, url, poster };
  }
}

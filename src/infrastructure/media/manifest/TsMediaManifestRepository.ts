/**
 * INFRASTRUCTURE — Adapter (implementa IMediaManifestRepository)
 *
 * Fuente TS local del manifiesto. Intercambiable por JSON/API/CMS/bucket/Git
 * implementando el mismo puerto, sin tocar el resolver ni los componentes.
 */
import type { MediaManifest } from "@domain/media/MediaAsset";
import type { IMediaManifestRepository } from "@application/media/ports/IMediaManifestRepository";
import { MEDIA_MANIFEST } from "@/content/media/media-manifest";

export class TsMediaManifestRepository implements IMediaManifestRepository {
  load(): MediaManifest {
    return MEDIA_MANIFEST;
  }
}

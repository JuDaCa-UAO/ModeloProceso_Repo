/**
 * APPLICATION — Port
 *
 * Fuente del manifiesto multimedia. Intercambiable (TS local hoy; JSON/API/
 * CMS/bucket/Git más adelante) sin tocar el resolver ni los componentes.
 */
import type { MediaManifest } from "@domain/media/MediaAsset";

export interface IMediaManifestRepository {
  load(): MediaManifest;
}

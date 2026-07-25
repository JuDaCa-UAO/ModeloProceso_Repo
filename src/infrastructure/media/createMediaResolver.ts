/**
 * INFRASTRUCTURE — Composition root
 *
 * Única función que construye un `IMediaResolver` real, con los adaptadores
 * de proveedor en orden de prioridad (CDN configurado > local). La
 * presentación llama a esta función; nunca
 * construye adaptadores o el resolver directamente.
 */
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import { ENV } from "@infra/config/env";
import { MediaResolver } from "./MediaResolver";
import { TsMediaManifestRepository } from "./manifest/TsMediaManifestRepository";
import { LocalMediaAdapter } from "./providers/LocalMediaAdapter";
import { CdnBaseUrlAdapter } from "./providers/CdnBaseUrlAdapter";

let instance: IMediaResolver | null = null;

export function getMediaResolver(): IMediaResolver {
  if (instance) return instance;

  const manifest = new TsMediaManifestRepository().load();
  const adapters = [
    new CdnBaseUrlAdapter(ENV.MEDIA_BASE_URL),
    new LocalMediaAdapter(),
  ];

  instance = new MediaResolver(manifest, adapters);
  return instance;
}

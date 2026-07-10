/**
 * INFRASTRUCTURE — Composition root
 *
 * Única función que construye un `IMediaResolver` real, con los adaptadores
 * de proveedor en orden de prioridad (Cloudflare configurado > CDN genérico
 * configurado > local). La presentación llama a esta función; nunca
 * construye adaptadores o el resolver directamente.
 */
import type { IMediaResolver } from "@application/media/ports/IMediaResolver";
import { ENV } from "@infra/config/env";
import { MediaResolver } from "./MediaResolver";
import { TsMediaManifestRepository } from "./manifest/TsMediaManifestRepository";
import { LocalMediaAdapter } from "./providers/LocalMediaAdapter";
import { CdnBaseUrlAdapter } from "./providers/CdnBaseUrlAdapter";
import { CloudflareR2Adapter } from "./providers/CloudflareR2Adapter";
import { CloudflareStreamAdapter } from "./providers/CloudflareStreamAdapter";
import { CloudflareImagesAdapter } from "./providers/CloudflareImagesAdapter";

let instance: IMediaResolver | null = null;

export function getMediaResolver(): IMediaResolver {
  if (instance) return instance;

  const manifest = new TsMediaManifestRepository().load();
  const adapters = [
    new CloudflareStreamAdapter(ENV.CLOUDFLARE_STREAM_CUSTOMER_CODE),
    new CloudflareImagesAdapter(ENV.CLOUDFLARE_IMAGES_ACCOUNT_HASH),
    new CloudflareR2Adapter(ENV.CLOUDFLARE_R2_PUBLIC_URL),
    new CdnBaseUrlAdapter(ENV.MEDIA_BASE_URL),
    new LocalMediaAdapter(),
  ];

  instance = new MediaResolver(manifest, adapters);
  return instance;
}

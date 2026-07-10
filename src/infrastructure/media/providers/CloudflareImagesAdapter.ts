/**
 * INFRASTRUCTURE — Adapter (STUB, sin cuenta de Images real todavía)
 *
 * Cloudflare Images para variantes responsive de imágenes pesadas (plan de
 * rework §8/§10). `ref` es el ID de la imagen; la URL usa el account hash
 * de la cuenta. No entra en uso real hasta que exista la cuenta — hoy
 * `supports()` es falso porque la variable de entorno está vacía.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";
import type { MediaProviderAdapter } from "./MediaProviderAdapter";

export class CloudflareImagesAdapter implements MediaProviderAdapter {
  constructor(private readonly accountHash: string) {}

  supports(asset: MediaAsset): boolean {
    return asset.provider === "images" && Boolean(this.accountHash);
  }

  buildUrl(asset: MediaAsset): string | null {
    if (!this.accountHash) return null;
    return `https://imagedelivery.net/${this.accountHash}/${asset.ref}/public`;
  }
}

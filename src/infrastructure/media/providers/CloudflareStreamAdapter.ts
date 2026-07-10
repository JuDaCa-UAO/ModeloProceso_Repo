/**
 * INFRASTRUCTURE — Adapter (STUB, sin cuenta de Stream real todavía)
 *
 * Cloudflare Stream para los videos-resumen (plan de rework §8/§10). `ref`
 * es el UID del video; la URL de reproducción usa el customer code de la
 * cuenta. No entra en uso real hasta que exista la cuenta — hoy
 * `supports()` es falso porque la variable de entorno está vacía.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";
import type { MediaProviderAdapter } from "./MediaProviderAdapter";

export class CloudflareStreamAdapter implements MediaProviderAdapter {
  constructor(private readonly customerCode: string) {}

  supports(asset: MediaAsset): boolean {
    return asset.provider === "stream" && Boolean(this.customerCode);
  }

  buildUrl(asset: MediaAsset): string | null {
    if (!this.customerCode) return null;
    return `https://customer-${this.customerCode}.cloudflarestream.com/${asset.ref}/manifest/video.m3u8`;
  }
}

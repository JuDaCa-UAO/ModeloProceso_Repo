/**
 * INFRASTRUCTURE — Adapter
 *
 * CDN genérico detrás de una única URL base (hoy: `NEXT_PUBLIC_MEDIA_BASE_URL`,
 * la misma variable que ya usaba `content/shared/media-registry.ts`). `ref`
 * es la ruta relativa dentro de ese host.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";
import type { MediaProviderAdapter } from "./MediaProviderAdapter";

export class CdnBaseUrlAdapter implements MediaProviderAdapter {
  constructor(private readonly baseUrl: string) {}

  supports(asset: MediaAsset): boolean {
    return asset.provider === "http" && Boolean(this.baseUrl);
  }

  buildUrl(asset: MediaAsset): string | null {
    if (!this.baseUrl) return null;
    return `${this.baseUrl.replace(/\/+$/, "")}${asset.ref}`;
  }
}

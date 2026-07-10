/**
 * INFRASTRUCTURE — Adapter
 *
 * Recursos servidos desde `public/`. `ref` es la ruta relativa (debe
 * empezar con "/"), igual que `localPath` en el registro viejo.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";
import type { MediaProviderAdapter } from "./MediaProviderAdapter";

export class LocalMediaAdapter implements MediaProviderAdapter {
  supports(asset: MediaAsset): boolean {
    return asset.provider === "local";
  }

  buildUrl(asset: MediaAsset): string | null {
    return asset.ref || null;
  }
}

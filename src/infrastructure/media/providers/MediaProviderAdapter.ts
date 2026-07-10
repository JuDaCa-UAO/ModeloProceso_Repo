/**
 * INFRASTRUCTURE — Strategy interface
 *
 * Contrato común de los adaptadores de proveedor multimedia. `MediaResolver`
 * prueba una lista de adaptadores en orden hasta que uno `supports()` el
 * asset y construye una URL.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";

export interface MediaProviderAdapter {
  supports(asset: MediaAsset): boolean;
  buildUrl(asset: MediaAsset): string | null;
}

/**
 * INFRASTRUCTURE — Adapter (STUB, sin bucket real todavía)
 *
 * Cloudflare R2 para infografías, PDFs, transiciones cortas y subtítulos
 * (plan de rework §8/§10). `ref` es la clave del objeto dentro del bucket;
 * la URL pública se construye contra `CLOUDFLARE_R2_PUBLIC_URL`. No entra en
 * uso real hasta que exista el bucket — hoy `supports()` es falso porque la
 * variable de entorno está vacía, así que `MediaResolver` cae al siguiente
 * adaptador sin romper nada.
 */
import type { MediaAsset } from "@domain/media/MediaAsset";
import type { MediaProviderAdapter } from "./MediaProviderAdapter";

export class CloudflareR2Adapter implements MediaProviderAdapter {
  constructor(private readonly publicUrl: string) {}

  supports(asset: MediaAsset): boolean {
    return asset.provider === "r2" && Boolean(this.publicUrl);
  }

  buildUrl(asset: MediaAsset): string | null {
    if (!this.publicUrl) return null;
    return `${this.publicUrl.replace(/\/+$/, "")}/${asset.ref.replace(/^\/+/, "")}`;
  }
}

/**
 * DOMAIN — Value Object
 *
 * Clave lógica de un recurso multimedia (string branded). El dominio y el
 * contenido tipado solo conocen esta clave; nunca una ruta de archivo, un ID
 * de proveedor concreto ni una URL. La resolución real (local, CDN,
 * Cloudflare R2/Stream/Images, HTTP genérico) vive en `infrastructure/media`
 * (Fase 6) detrás de `IMediaResolver`.
 */
export type MediaKey = string & { readonly __brand: "MediaKey" };

export function mediaKey(key: string): MediaKey {
  return key as MediaKey;
}

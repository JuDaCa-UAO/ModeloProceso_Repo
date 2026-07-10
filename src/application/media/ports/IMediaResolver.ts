/**
 * APPLICATION — Port
 *
 * Resuelve una clave lógica a un recurso utilizable. Nunca lanza: si la
 * clave no existe en el manifiesto, o el proveedor no puede resolverla,
 * devuelve `available: false` con su `fallback`.
 */
import type { MediaKey } from "@domain/content/value-objects/MediaKey";
import type { ResolvedMedia } from "@domain/media/ResolvedMedia";

export interface IMediaResolver {
  resolve(key: MediaKey): ResolvedMedia;
}

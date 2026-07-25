/**
 * DOMAIN — Value Object
 *
 * Proveedor de entrega de un recurso multimedia. El dominio solo conoce este
 * nombre; construir la URL real es responsabilidad de un adaptador en
 * `infrastructure/media/providers/`. Cambiar de proveedor nunca
 * toca un componente de presentación.
 */
export type MediaProvider = "local" | "http";

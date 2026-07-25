/**
 * DOMAIN — Entity
 *
 * Mensaje prediseñado de LaIA: guía narrativa paso a paso, NO un chatbot de
 * respuesta abierta. `avatarKey` es una clave lógica, nunca una ruta.
 */
import type { MediaKey } from "./value-objects/MediaKey";

export interface LaiaMessage {
  id: string;
  text: string;
  avatarKey: MediaKey;
}

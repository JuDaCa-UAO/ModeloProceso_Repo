/**
 * DOMAIN — Entity
 *
 * Mensaje prediseñado de LaIA: guía narrativa paso a paso, NO un chatbot de
 * respuesta abierta. `avatarKey`/`audioKey` son claves lógicas, nunca rutas.
 *
 * `audioKey` (Fase 9, hoy sin usar): cuando existan los audios reales, van en
 * `public/media/audio/laia/<stageId>/<messageId>.mp3` — carpeta ya reservada
 * con `.gitkeep`. Alta en el manifiesto como `laia.audio.<stageId>.<messageId>`
 * (ver `content/media/media-manifest.ts`) y enlazar aquí. `LaiaStepper` no
 * reproduce audio todavía: falta esa UI, no solo el dato.
 */
import type { MediaKey } from "./value-objects/MediaKey";

export interface LaiaMessage {
  id: string;
  text: string;
  avatarKey: MediaKey;
  audioKey?: MediaKey;
}

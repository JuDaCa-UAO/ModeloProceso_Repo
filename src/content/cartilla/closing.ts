/**
 * CONTENT — Datos (cierre final de la Cartilla)
 *
 * Panel "La espiral continúa" tras los factores rectores — distinto del
 * cierre cíclico propio de la Etapa 6 (`StageClosing.final`). Texto verbatim
 * del cuerpo estático de `Cartilla.dc.html` (única fuente de contenido,
 * directiva del usuario 2026-07-10).
 */
import { mediaKey } from "@domain/content/value-objects/MediaKey";
import type { FinalClosing } from "@domain/content/Cartilla";

export const FINAL_CLOSING: FinalClosing = {
  title: "La espiral continúa",
  message:
    "Completaste una vuelta: ahora tienes más experiencia, más confianza y más herramientas. Cada nueva vuelta comienza otra vez en Reconócete para avanzar, pero nunca desde el mismo punto.",
  note: "Mantén viva tu curiosidad y ponla al servicio de la educación del futuro.",
  laiaAvatar: mediaKey("laia.pose.triumphant"),
};

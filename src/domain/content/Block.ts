/**
 * DOMAIN — Value Object (unión discriminada)
 *
 * Bloques de contenido reutilizables dentro de una `Section`. Las variantes
 * expresan únicamente estructuras renderizadas por `ContentSection`; las
 * rutas de recursos se representan mediante `MediaKey`.
 */

import type { MediaKey } from "./value-objects/MediaKey";

export type Block =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "callout"; title?: string; body: string }
  | { type: "bullets"; title?: string; items: string[]; variant?: "list" | "ordered" | "pills" }
  | { type: "infographic"; mediaKey: MediaKey; caption: string }
  | { type: "narrative-video"; mediaKey: MediaKey; caption?: string }
  | {
      type: "download";
      mediaKey: MediaKey;
      previewMediaKey: MediaKey;
      title: string;
      description: string;
      information: string;
      stageLabel: string;
      resourceType: string;
    }
  | {
      type: "action-cards";
      title?: string;
      description?: string;
      cards: { title: string; description: string; icon?: string }[];
    }
  | {
      type: "carousel";
      title: string;
      description?: string;
      panels: { id: string; label: string; description?: string; mediaKey: MediaKey }[];
    }
  | {
      type: "state-cards";
      layout?: "grid" | "rows";
      title?: string;
      description?: string;
      items: {
        hierarchy: "Inicial" | "Intermedio" | "Avanzado";
        title: string;
        description: string;
      }[];
    }
  | { type: "autodiagnostic"; title: string; description: string; ctaLabel: string; formUrl: string };

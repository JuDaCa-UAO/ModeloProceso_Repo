/**
 * DOMAIN — Value Object (unión discriminada)
 *
 * Bloques de contenido reutilizables dentro de una `Section`. Fuente única:
 * el contenido real de `Cartilla.dc.html` verificado sección por sección
 * (ver `contexto/context.md`, entrada de la Fase 8) — no el motor viejo
 * (`engine/types.ts`) ni el legacy (`types/stage.ts::SectionContentBlock`),
 * que solo sirvieron de inspiración inicial en la Fase 5.
 *
 * **Revisión de la Fase 8** (tras verificar las 6 etapas verbatim contra el
 * diseño, directiva del usuario de usar solo el diseño como fuente):
 * - `infographic`: el diseño SIEMPRE muestra las infografías como `<figure>`
 *   inline con `<figcaption>` — nunca detrás de un botón que abre modal. Se
 *   simplifica a `{ mediaKey, caption }`, sin `openLabel`/`modalTitle`/
 *   `modalBadge`/`guideId` (herencia del motor viejo, sin uso real).
 * - `download`: tarjeta de recurso pedagógico con PDF, preview y acciones
 *   accesibles. Las URLs siguen viviendo en el manifiesto multimedia.
 * - `design-canvas`, `checklist`, `scenario`: **eliminados**. Ninguna etapa
 *   del diseño real los usa — E3 (antes "design-canvas") es solo
 *   `action-cards` + `infographic` + `download`; E4 (antes "checklist"/
 *   "scenario") es solo `action-cards` (4 tarjetas con glifo) + 2
 *   `infographic` + `download`. Mantenerlos habría sido código especulativo.
 * - `narrative-video`: se conserva, pero su semántica real es "video ambiental
 *   embebido en el flujo de contenido, con estado `pending` mostrado como
 *   placeholder rayado" (así se ve Etapa 5 con sus 2 videos aún no producidos)
 *   — no el "narrative-video con botón" del motor viejo.
 * - `dialogue`/`transition` siguen sin ser bloques (campos de `Stage`).
 * - `consent`: **eliminado** (no llegó a usarse). El diseño de Etapa 1 no
 *   muestra ningún formulario de consentimiento ni checkboxes — solo 3
 *   tarjetas explicativas + un aviso "RECUERDA" + un botón "Comenzar →". El
 *   consentimiento, si existe, vive dentro del propio formulario n8n
 *   embebido (Fase 13), no como pantalla previa de la app.
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
  | { type: "spiral"; activeStage: number; instructions?: string; variant?: "default" | "compact" }
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

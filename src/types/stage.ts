/** Panel shown in the HorizontalScrollRail stage summary. */
export type RailPanel = {
  id: string;
  title: string;
  lines: [string, string];
  kind?: "intro" | "stage";
  label?: string;
};

/** Nodo del árbol de contenido de etapa (usado por el repositorio estático). */
export type SectionNode = Record<string, unknown>;



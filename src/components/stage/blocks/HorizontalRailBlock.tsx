"use client";

import HorizontalScrollRail from "@/components/stage/HorizontalScrollRail";
import type { RailPanel } from "@/types/stage";

type HorizontalRailBlockProps = {
  panels: RailPanel[];
};

/**
 * Thin wrapper que adapta el bloque de tipo "horizontal-rail" al componente
 * HorizontalScrollRail existente. Mantiene separación entre el descriptor
 * de contenido (data) y el componente de presentación.
 */
export default function HorizontalRailBlock({ panels }: HorizontalRailBlockProps) {
  return <HorizontalScrollRail panels={panels} />;
}

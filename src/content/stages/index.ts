/**
 * CONTENT — Index
 *
 * Punto de entrada único para los metadatos de todas las etapas.
 * No exporta árboles de contenido completos (eso es responsabilidad de
 * StaticStageContentRepository). Solo expone metadatos ligeros para
 * navegación, breadcrumbs y el Stage Engine dinámico.
 *
 * Para agregar una etapa nueva:
 *  1. Crear content/stages/stage-N.content.ts
 *  2. Agregar una entrada en STAGE_META aquí
 *  3. Registrar en StaticStageContentRepository
 */

export type StageMeta = {
  id: string;
  name: string;
  order: number;
  /** URL de la página de la etapa */
  href: string;
  /** Indica si el contenido está implementado y publicado */
  available: boolean;
  shortDescription?: string;
};

export const STAGE_META: StageMeta[] = [
  {    id: "etapa-0",
    name: "Introducción",
    order: 0,
    href: "/etapa/etapa-0",
    available: true,
    shortDescription: "Conoce el modelo y a Laia, tu asistente.",
  },
  {    id: "etapa-1",
    name: "Reconócete para avanzar",
    order: 1,
    href: "/etapa/etapa-1",
    available: true,
    shortDescription: "Identifica tu punto de partida con un autodiagnóstico.",
  },
  {
    id: "etapa-2",
    name: "Descubre nuevas posibilidades",
    order: 2,
    href: "/etapa/etapa-2",
    available: false,
    shortDescription: "Explora opciones de GenAI para apoyar tu docencia.",
  },
  {
    id: "etapa-3",
    name: "Diseña con propósito",
    order: 3,
    href: "/etapa/etapa-3",
    available: false,
    shortDescription: "Transforma lo explorado en una experiencia estructurada.",
  },
  {
    id: "etapa-4",
    name: "Prepara el terreno para el éxito",
    order: 4,
    href: "/etapa/etapa-4",
    available: false,
    shortDescription: "Convierte el diseño en condiciones operativas y logísticas.",
  },
  {
    id: "etapa-5",
    name: "Hazlo realidad en el aula",
    order: 5,
    href: "/etapa/etapa-5",
    available: false,
    shortDescription: "Pon en práctica lo diseñado con atención a cada estudiante.",
  },
  {
    id: "etapa-6",
    name: "Reflexiona, aprende y mejora",
    order: 6,
    href: "/etapa/etapa-6",
    available: false,
    shortDescription: "Analiza resultados, recoge evidencias y ajusta tu práctica.",
  },
];

/** Obtiene el StageMeta para un stageId dado, o undefined si no existe. */
export function getStageMeta(stageId: string): StageMeta | undefined {
  return STAGE_META.find((s) => s.id === stageId);
}

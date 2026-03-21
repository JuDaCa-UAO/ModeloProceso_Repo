export type StageMeta = {
  id: string;
  name: string;
  order: number;
  href: string;
  available: boolean;
};

export const STAGE_META: StageMeta[] = [
  {
    id: "etapa-1",
    name: "Recon\u00F3cete para avanzar",
    order: 1,
    href: "/etapa/etapa-1",
    available: true,
  },
  {
    id: "etapa-2",
    name: "Descubre nuevas posibilidades",
    order: 2,
    href: "/etapa/etapa-2",
    available: true,
  },
  {
    id: "etapa-3",
    name: "Dise\u00F1a con prop\u00F3sito",
    order: 3,
    href: "/etapa/etapa-3",
    available: false,
  },
  {
    id: "etapa-4",
    name: "Prepara el terreno para el \u00E9xito",
    order: 4,
    href: "/etapa/etapa-4",
    available: false,
  },
  {
    id: "etapa-5",
    name: "Hazlo realidad en el aula",
    order: 5,
    href: "/etapa/etapa-5",
    available: false,
  },
  {
    id: "etapa-6",
    name: "Reflexiona, aprende y mejora",
    order: 6,
    href: "/etapa/etapa-6",
    available: false,
  },
];

export function getStageMeta(stageId: string): StageMeta | undefined {
  return STAGE_META.find((s) => s.id === stageId);
}

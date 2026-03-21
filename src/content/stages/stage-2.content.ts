import type { SectionNode } from "@/types/stage";
import { LAIA_ASSETS } from "@/content/shared/character-assets";

export const STAGE2_ID = "etapa-2";
export const STAGE2_NAME = "Descubre nuevas posibilidades";

export const STAGE2_TREE: SectionNode[] = [
  {
    id: "entrada-etapa-2",
    title: STAGE2_NAME,
    subtitle: "Landing provisional de llegada para la siguiente estacion del recorrido.",
    surface: "plain",
    dialogue: [
      {
        text: "Llegaste a Etapa 2. Esta landing por ahora funciona como punto de llegada de la transicion, mientras implementamos el flujo completo de esta estacion.",
        imgSrc: LAIA_ASSETS.triumphant,
        imgAlt: "Laia recibe al usuario en la etapa 2",
      },
    ],
    content: [
      {
        type: "stage-header",
        title: "Etapa 2: Descubre nuevas posibilidades",
        subtitle:
          "La transicion desde Etapa 1 ya te deja en una llegada coherente, aunque el desarrollo completo de esta etapa sigue en construccion.",
        stageChip: "Nueva estacion",
        continuityLabel: "Landing provisional",
        currentStageLabel: "Etapa 2 activa",
      },
      {
        type: "paragraphs",
        paragraphs: [
          "Este punto de llegada confirma el cambio de ambiente entre etapas y evita que la transicion termine en una ruta vacia.",
          "La implementacion completa de Etapa 2 seguira este mismo sistema stage-driven y mantendra independencia respecto a Etapa 1.",
        ],
      },
      {
        type: "scaffold-panel",
        label: "Provisional",
        body:
          "Esta landing existe solo como llegada segura despues del cierre de Etapa 1. El flujo definitivo de Etapa 2 se implementara en una iteracion posterior.",
        tone: "accent",
      },
    ],
  },
];
